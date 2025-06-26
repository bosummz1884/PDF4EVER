import { useCallback, useState } from 'react';
import { useFileStore } from '../stores/fileStore';
import { 
  BatchOperation, 
  ProcessingStatus, 
  BatchResult, 
  QueueItem,
  ExportOptions,
  SplitOptions,
  MergeOperation
} from '../types/advanced';
import { usePDFOperations } from './usePDFOperations';

export function useBatchOperations() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<BatchOperation | null>(null);
  const { files } = useFileStore();
  const { 
    splitDocument, 
    mergeDocuments, 
    exportDocument, 
    addWatermark, 
    addHeaderFooter, 
    applySecurity 
  } = usePDFOperations();

  const createBatchOperation = useCallback((
    name: string,
    type: string,
    fileIds: string[],
    operations: any[]
  ): BatchOperation => {
    return {
      id: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      files: fileIds,
      operations,
      status: {
        state: 'pending',
        currentStep: 'Initializing',
        totalSteps: operations.length * fileIds.length,
        completedSteps: 0,
      },
      progress: 0,
      results: [],
    };
  }, []);

  const addToQueue = useCallback((operation: BatchOperation, priority: number = 0) => {
    const queueItem: QueueItem = {
      id: operation.id,
      operation,
      priority,
      retryCount: 0,
      maxRetries: 3,
    };

    setQueue(prev => [...prev, queueItem].sort((a, b) => b.priority - a.priority));
  }, []);

  const removeFromQueue = useCallback((operationId: string) => {
    setQueue(prev => prev.filter(item => item.id !== operationId));
  }, []);

  const updateOperationStatus = useCallback((
    operationId: string, 
    status: Partial<ProcessingStatus>
  ) => {
    setQueue(prev => prev.map(item => 
      item.id === operationId 
        ? { ...item, operation: { ...item.operation, status: { ...item.operation.status, ...status } } }
        : item
    ));

    if (currentOperation?.id === operationId) {
      setCurrentOperation(prev => prev ? { ...prev, status: { ...prev.status, ...status } } : null);
    }
  }, [currentOperation]);

  const addResult = useCallback((operationId: string, result: BatchResult) => {
    setQueue(prev => prev.map(item => 
      item.id === operationId 
        ? { 
            ...item, 
            operation: { 
              ...item.operation, 
              results: [...item.operation.results, result],
              progress: Math.round((item.operation.results.length + 1) / item.operation.files.length * 100)
            }
          }
        : item
    ));
  }, []);

  const processFile = useCallback(async (
    fileId: string,
    operation: any,
    operationType: string
  ): Promise<BatchResult> => {
    const file = files.find(f => f.id === fileId);
    if (!file) {
      return {
        fileId,
        fileName: 'Unknown',
        success: false,
        error: 'File not found',
      };
    }

    const startTime = Date.now();

    try {
      let outputPath: string | undefined;
      let outputSize: number | undefined;

      switch (operationType) {
        case 'export':
          const exportOptions: ExportOptions = operation;
          const exportedBlob = await exportDocument(exportOptions);
          outputSize = exportedBlob.size;
          outputPath = `${file.name}_exported.${exportOptions.format.type}`;
          break;

        case 'split':
          const splitOptions: SplitOptions = operation;
          const splitResults = await splitDocument(splitOptions);
          outputSize = splitResults.reduce((total, blob) => total + blob.size, 0);
          outputPath = `${file.name}_split_${splitResults.length}_files`;
          break;

        case 'merge':
          // Merge operations are handled differently as they combine multiple files
          break;

        case 'watermark':
          await addWatermark(operation);
          outputPath = `${file.name}_watermarked.pdf`;
          break;

        case 'header_footer':
          await addHeaderFooter(operation);
          outputPath = `${file.name}_with_headers.pdf`;
          break;

        case 'security':
          await applySecurity(operation);
          outputPath = `${file.name}_secured.pdf`;
          break;

        default:
          throw new Error(`Unsupported operation type: ${operationType}`);
      }

      return {
        fileId,
        fileName: file.name,
        success: true,
        outputPath,
        outputSize,
        processingTime: Date.now() - startTime,
      };

    } catch (error) {
      return {
        fileId,
        fileName: file.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime,
      };
    }
  }, [files, exportDocument, splitDocument, addWatermark, addHeaderFooter, applySecurity]);

  const processOperation = useCallback(async (operation: BatchOperation) => {
    setCurrentOperation(operation);
    updateOperationStatus(operation.id, { 
      state: 'processing', 
      currentStep: 'Starting batch operation' 
    });

    const results: BatchResult[] = [];
    let completedSteps = 0;

    try {
      // Handle merge operations specially as they combine multiple files
      if (operation.type === 'merge' && operation.operations.length > 0) {
        const mergeOp: MergeOperation = operation.operations[0];
        const startTime = Date.now();

        try {
          const mergedBlob = await mergeDocuments(mergeOp);
          results.push({
            fileId: 'merged',
            fileName: 'merged_document.pdf',
            success: true,
            outputSize: mergedBlob.size,
            processingTime: Date.now() - startTime,
          });
        } catch (error) {
          results.push({
            fileId: 'merged',
            fileName: 'merged_document.pdf',
            success: false,
            error: error instanceof Error ? error.message : 'Merge failed',
            processingTime: Date.now() - startTime,
          });
        }
      } else {
        // Process each file with each operation
        for (const fileId of operation.files) {
          for (const op of operation.operations) {
            updateOperationStatus(operation.id, {
              currentStep: `Processing ${files.find(f => f.id === fileId)?.name || fileId}`,
              completedSteps,
            });

            const result = await processFile(fileId, op, operation.type);
            results.push(result);
            addResult(operation.id, result);

            completedSteps++;
            const progress = Math.round((completedSteps / (operation.files.length * operation.operations.length)) * 100);
            
            updateOperationStatus(operation.id, {
              completedSteps,
              currentStep: result.success 
                ? `Completed ${result.fileName}` 
                : `Failed ${result.fileName}: ${result.error}`,
            });

            // Update progress in queue
            setQueue(prev => prev.map(item => 
              item.id === operation.id 
                ? { ...item, operation: { ...item.operation, progress } }
                : item
            ));
          }
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;

      updateOperationStatus(operation.id, {
        state: failureCount === 0 ? 'completed' : failureCount === results.length ? 'failed' : 'completed',
        currentStep: `Completed: ${successCount} successful, ${failureCount} failed`,
        completedSteps: operation.status.totalSteps,
        message: `Batch operation completed`,
      });

      // Set end time
      setQueue(prev => prev.map(item => 
        item.id === operation.id 
          ? { ...item, operation: { ...item.operation, endTime: new Date() } }
          : item
      ));

    } catch (error) {
      updateOperationStatus(operation.id, {
        state: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Batch operation failed',
      });
    }

    setCurrentOperation(null);
  }, [files, processFile, mergeDocuments, updateOperationStatus, addResult]);

  const processQueue = useCallback(async () => {
    if (isProcessing || queue.length === 0) return;

    setIsProcessing(true);

    try {
      while (queue.length > 0) {
        const nextItem = queue.find(item => item.operation.status.state === 'pending');
        if (!nextItem) break;

        // Set start time
        setQueue(prev => prev.map(item => 
          item.id === nextItem.id 
            ? { ...item, operation: { ...item.operation, startTime: new Date() } }
            : item
        ));

        await processOperation(nextItem.operation);

        // Remove completed operation from queue
        removeFromQueue(nextItem.id);
      }
    } catch (error) {
      console.error('Queue processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, queue, processOperation, removeFromQueue]);

  const pauseOperation = useCallback((operationId: string) => {
    updateOperationStatus(operationId, { state: 'paused' });
  }, [updateOperationStatus]);

  const resumeOperation = useCallback((operationId: string) => {
    updateOperationStatus(operationId, { state: 'pending' });
    processQueue();
  }, [updateOperationStatus, processQueue]);

  const cancelOperation = useCallback((operationId: string) => {
    updateOperationStatus(operationId, { state: 'cancelled' });
    removeFromQueue(operationId);
  }, [updateOperationStatus, removeFromQueue]);

  const retryOperation = useCallback((operationId: string) => {
    const item = queue.find(q => q.id === operationId);
    if (item && item.retryCount < item.maxRetries) {
      setQueue(prev => prev.map(q => 
        q.id === operationId 
          ? { 
              ...q, 
              retryCount: q.retryCount + 1,
              operation: { 
                ...q.operation, 
                status: { ...q.operation.status, state: 'pending' },
                results: [] 
              }
            }
          : q
      ));
      processQueue();
    }
  }, [queue, processQueue]);

  const clearCompleted = useCallback(() => {
    setQueue(prev => prev.filter(item => 
      !['completed', 'failed', 'cancelled'].includes(item.operation.status.state)
    ));
  }, []);

  const getQueueStats = useCallback(() => {
    const pending = queue.filter(item => item.operation.status.state === 'pending').length;
    const processing = queue.filter(item => item.operation.status.state === 'processing').length;
    const completed = queue.filter(item => item.operation.status.state === 'completed').length;
    const failed = queue.filter(item => item.operation.status.state === 'failed').length;

    return { pending, processing, completed, failed, total: queue.length };
  }, [queue]);

  // Batch operation creators
  const createBatchExport = useCallback((fileIds: string[], options: ExportOptions) => {
    return createBatchOperation(
      `Export ${fileIds.length} files to ${options.format.type.toUpperCase()}`,
      'export',
      fileIds,
      [options]
    );
  }, [createBatchOperation]);

  const createBatchSplit = useCallback((fileIds: string[], options: SplitOptions) => {
    return createBatchOperation(
      `Split ${fileIds.length} files`,
      'split',
      fileIds,
      [options]
    );
  }, [createBatchOperation]);

  const createBatchMerge = useCallback((fileIds: string[], options: MergeOperation) => {
    return createBatchOperation(
      `Merge ${fileIds.length} files`,
      'merge',
      fileIds,
      [options]
    );
  }, [createBatchOperation]);

  const createBatchWatermark = useCallback((fileIds: string[], watermark: any) => {
    return createBatchOperation(
      `Add watermark to ${fileIds.length} files`,
      'watermark',
      fileIds,
      [watermark]
    );
  }, [createBatchOperation]);

  const createBatchHeaderFooter = useCallback((fileIds: string[], headerFooter: any) => {
    return createBatchOperation(
      `Add header/footer to ${fileIds.length} files`,
      'header_footer',
      fileIds,
      [headerFooter]
    );
  }, [createBatchOperation]);

  const createBatchSecurity = useCallback((fileIds: string[], security: any) => {
    return createBatchOperation(
      `Apply security to ${fileIds.length} files`,
      'security',
      fileIds,
      [security]
    );
  }, [createBatchOperation]);

  return {
    queue,
    currentOperation,
    isProcessing,
    addToQueue,
    removeFromQueue,
    processQueue,
    pauseOperation,
    resumeOperation,
    cancelOperation,
    retryOperation,
    clearCompleted,
    getQueueStats,
    createBatchExport,
    createBatchSplit,
    createBatchMerge,
    createBatchWatermark,
    createBatchHeaderFooter,
    createBatchSecurity,
  };
}