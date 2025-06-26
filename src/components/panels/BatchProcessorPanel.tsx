import { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Trash2, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity,
  Download,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { useBatchOperations } from '../../hooks/useBatchOperations';
import { cn } from '../../utils/cn';

export function BatchProcessorPanel() {
  const {
    queue,
    currentOperation,
    isProcessing,
    processQueue,
    pauseOperation,
    resumeOperation,
    cancelOperation,
    retryOperation,
    clearCompleted,
    getQueueStats,
  } = useBatchOperations();

  const [showCompleted, setShowCompleted] = useState(false);
  const stats = getQueueStats();

  const getStatusIcon = (state: string) => {
    switch (state) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <Square className="h-4 w-4 text-gray-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (state: string) => {
    const variants = {
      pending: 'secondary',
      processing: 'default',
      completed: 'success',
      failed: 'destructive',
      cancelled: 'secondary',
      paused: 'outline',
    } as const;

    return (
      <Badge variant={variants[state as keyof typeof variants] || 'secondary'}>
        {state.charAt(0).toUpperCase() + state.slice(1)}
      </Badge>
    );
  };

  const formatDuration = (startTime?: Date, endTime?: Date) => {
    if (!startTime) return '-';
    
    const end = endTime || new Date();
    const duration = end.getTime() - startTime.getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const filteredQueue = showCompleted 
    ? queue 
    : queue.filter(item => !['completed', 'failed', 'cancelled'].includes(item.operation.status.state));

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Batch Processor</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? 'Hide Completed' : 'Show All'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCompleted}
              disabled={stats.completed === 0 && stats.failed === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Queue Statistics */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-lg font-semibold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Processing</div>
            <div className="text-lg font-semibold text-blue-600">{stats.processing}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="text-lg font-semibold text-green-600">{stats.completed}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Failed</div>
            <div className="text-lg font-semibold text-red-600">{stats.failed}</div>
          </div>
        </div>

        {/* Queue Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={processQueue}
            disabled={isProcessing || stats.pending === 0}
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Start Queue'}
          </Button>
          
          {isProcessing && currentOperation && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => pauseOperation(currentOperation.id)}
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
        </div>

        {/* Current Operation Progress */}
        {currentOperation && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {currentOperation.name}
              </span>
              <span className="text-sm text-muted-foreground">
                {currentOperation.progress}%
              </span>
            </div>
            <Progress value={currentOperation.progress} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {currentOperation.status.currentStep}
            </div>
          </div>
        )}
      </div>

      {/* Queue Items */}
      <div className="flex-1 overflow-auto">
        {filteredQueue.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No batch operations in queue</p>
            <p className="text-sm">Add files and create batch operations to get started</p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {filteredQueue.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'border rounded-lg p-4 space-y-3',
                  item.operation.status.state === 'processing' && 'border-blue-500 bg-blue-50',
                  item.operation.status.state === 'failed' && 'border-red-500 bg-red-50'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.operation.status.state)}
                    <div>
                      <div className="font-medium">{item.operation.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.operation.files.length} files • {item.operation.type}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.operation.status.state)}
                    <div className="text-sm text-muted-foreground">
                      {formatDuration(item.operation.startTime, item.operation.endTime)}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {item.operation.status.state === 'processing' && (
                  <div className="space-y-1">
                    <Progress value={item.operation.progress} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {item.operation.status.currentStep}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {item.operation.status.error && (
                  <div className="flex items-start gap-2 p-2 bg-red-100 border border-red-200 rounded text-sm">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700">{item.operation.status.error}</span>
                  </div>
                )}

                {/* Results Summary */}
                {item.operation.results.length > 0 && (
                  <div className="text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-green-600">
                        ✓ {item.operation.results.filter(r => r.success).length} successful
                      </span>
                      {item.operation.results.filter(r => !r.success).length > 0 && (
                        <span className="text-red-600">
                          ✗ {item.operation.results.filter(r => !r.success).length} failed
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {item.operation.status.state === 'paused' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resumeOperation(item.id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  
                  {item.operation.status.state === 'failed' && item.retryCount < item.maxRetries && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => retryOperation(item.id)}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retry ({item.retryCount}/{item.maxRetries})
                    </Button>
                  )}
                  
                  {['pending', 'paused'].includes(item.operation.status.state) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cancelOperation(item.id)}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                  
                  {item.operation.status.state === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log('Download results')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}