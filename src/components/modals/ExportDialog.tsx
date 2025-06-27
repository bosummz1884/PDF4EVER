import { useState, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Download, 
  Settings, 
  FileImage, 
  FileText, 
  Shield,
  Loader2
} from 'lucide-react';
import { ExportOptions, ExportFormat, CompressionSettings, SecuritySettings } from '../../types/advanced';
import { usePDFOperations } from '../../hooks/usePDFOperations';
import { usePDFStore } from '../../stores/pdfStore';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileIds?: string[];
}

// @ts-expect-error - fileIds will be used in future implementation
export function ExportDialog({ open, onOpenChange, fileIds = [] }: ExportDialogProps) {
  const { currentDocument } = usePDFStore();
  const { exportDocument, isProcessing } = usePDFOperations();
  
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: { type: 'pdf', quality: 95, dpi: 300 },
    pageRange: { type: 'all' },  // This is already defined, which is good
    includeAnnotations: true,
    includeBookmarks: true,
    includeForms: true,
    compression: {
      images: {
        enabled: true,
        quality: 85,
        downsampling: true,
        targetDPI: 150,
      },
      text: {
        enabled: true,
        fontSubsetting: true,
        removeUnusedFonts: true,
      },
      structure: {
        removeMetadata: false,
        removeComments: false,
        optimizeStructure: true,
      },
    },
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    encryption: {
      enabled: false,
      level: 'standard',
    },
    permissions: {
      printing: 'highres',
      copying: true,
      editing: 'all',
      extracting: true,
      accessibility: true,
    },
  });

  const [customPageRange, setCustomPageRange] = useState('');
  const [outputFileName, setOutputFileName] = useState('');

  const handleFormatChange = useCallback((format: string) => {
    const formatMap: Record<string, ExportFormat> = {
      'pdf': { type: 'pdf', quality: 95 },
      'pdf-a': { type: 'pdf-a', version: '1b', quality: 95 },
      'png': { type: 'png', quality: 95, dpi: 300 },
      'jpg': { type: 'jpg', quality: 85, dpi: 300 },
      'docx': { type: 'docx' },
      'xlsx': { type: 'xlsx' },
      'html': { type: 'html' },
      'txt': { type: 'txt' },
    };

    setExportOptions(prev => ({
      ...prev,
      format: formatMap[format] || formatMap.pdf,
    }));
  }, []);

  const handlePageRangeChange = useCallback((type: string) => {
    setExportOptions(prev => ({
      ...prev,
      pageRange: { 
        ...prev.pageRange, 
        type: type as any,
        ...(type === 'range' && {
          start: 1,
          end: currentDocument?.metadata.pageCount || 1,
        }),
      },
    }));
  }, [currentDocument]);

  const handleCompressionChange = useCallback((
    category: keyof CompressionSettings,
    setting: string,
    value: any
  ) => {
    setExportOptions(prev => ({
      ...prev,
      compression: {
        ...prev.compression,
        [category]: {
          ...prev.compression[category],
          [setting]: value,
        },
      },
    }));
  }, []);

  const handleSecurityChange = useCallback((
    category: keyof SecuritySettings,
    setting: string,
    value: any
  ) => {
    setSecuritySettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  }, []);

  const handleExport = useCallback(async () => {
    if (!currentDocument) return;

    try {
      const finalOptions: ExportOptions = {
        ...exportOptions,
        ...(securitySettings.encryption.enabled && { security: securitySettings }),
      };

      // Handle custom page range
      if (exportOptions.pageRange!.type === 'range' && customPageRange) {
        const ranges = customPageRange.split(',').map(range => {
          const parts = range.trim().split('-');
          if (parts.length === 1) {
            const page = parseInt(parts[0]);
            return { start: page, end: page };
          } else {
            return {
              start: parseInt(parts[0]),
              end: parseInt(parts[1]),
            };
          }
        });

        finalOptions.pageRange = {
          type: 'range',
          pages: ranges.flatMap(r => 
            Array.from({ length: r.end - r.start + 1 }, (_, i) => r.start + i)
          ),
        };
      }

      const exportedBlob = await exportDocument(finalOptions);
      
      // Download the file
      const url = URL.createObjectURL(exportedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = outputFileName || `exported.${finalOptions.format.type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onOpenChange(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [currentDocument, exportOptions, securitySettings, customPageRange, outputFileName, exportDocument, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Document
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="format" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="format">Format</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="compression">Quality</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select value={exportOptions.format.type} onValueChange={handleFormatChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="pdf-a">PDF/A (Archive)</SelectItem>
                    <SelectItem value="png">PNG Images</SelectItem>
                    <SelectItem value="jpg">JPEG Images</SelectItem>
                    <SelectItem value="docx">Microsoft Word</SelectItem>
                    <SelectItem value="xlsx">Microsoft Excel</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="txt">Plain Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Output Filename</Label>
                <Input
                  value={outputFileName}
                  onChange={(e) => setOutputFileName(e.target.value)}
                  placeholder={`document.${exportOptions.format.type}`}
                />
              </div>
            </div>

            {['png', 'jpg'].includes(exportOptions.format.type) && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quality: {exportOptions.format.quality}%</Label>
                  <Slider
                    value={[exportOptions.format.quality || 95]}
                    onValueChange={([value]) => 
                      setExportOptions(prev => ({
                        ...prev,
                        format: { ...prev.format, quality: value },
                      }))
                    }
                    min={1}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>DPI: {exportOptions.format.dpi}</Label>
                  <Slider
                    value={[exportOptions.format.dpi || 300]}
                    onValueChange={([value]) => 
                      setExportOptions(prev => ({
                        ...prev,
                        format: { ...prev.format, dpi: value },
                      }))
                    }
                    min={72}
                    max={600}
                    step={24}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label>Include Content</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="annotations"
                    checked={exportOptions.includeAnnotations}
                    onCheckedChange={(checked) =>
                      setExportOptions(prev => ({ ...prev, includeAnnotations: !!checked }))
                    }
                  />
                  <Label htmlFor="annotations">Annotations</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bookmarks"
                    checked={exportOptions.includeBookmarks}
                    onCheckedChange={(checked) =>
                      setExportOptions(prev => ({ ...prev, includeBookmarks: !!checked }))
                    }
                  />
                  <Label htmlFor="bookmarks">Bookmarks</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="forms"
                    checked={exportOptions.includeForms}
                    onCheckedChange={(checked) =>
                      setExportOptions(prev => ({ ...prev, includeForms: !!checked }))
                    }
                  />
                  <Label htmlFor="forms">Form Fields</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pages" className="space-y-4">
            <div className="space-y-3">
              <Label>Page Range</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="all-pages"
                    name="pageRange"
                    checked={exportOptions.pageRange!.type === 'all'}
                    onChange={() => handlePageRangeChange('all')}
                  />
                  <Label htmlFor="all-pages">All Pages</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="current-page"
                    name="pageRange"
                    checked={exportOptions.pageRange!.type === 'current'}
                    onChange={() => handlePageRangeChange('current')}
                  />
                  <Label htmlFor="current-page">Current Page Only</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="page-range"
                    name="pageRange"
                    checked={exportOptions.pageRange!.type === 'range'}
                    onChange={() => handlePageRangeChange('range')}
                  />
                  <Label htmlFor="page-range">Custom Range</Label>
                </div>

                {exportOptions.pageRange!.type === 'range' && (
                  <div className="ml-6 space-y-2">
                    <Label>Page Numbers (e.g., 1-5, 8, 10-12)</Label>
                    <Input
                      value={customPageRange}
                      onChange={(e) => setCustomPageRange(e.target.value)}
                      placeholder="1-5, 8, 10-12"
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compression" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileImage className="h-4 w-4" />
                <Label className="text-base font-medium">Image Compression</Label>
              </div>

              <div className="ml-6 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="compress-images"
                    checked={exportOptions.compression.images.enabled}
                    onCheckedChange={(checked) =>
                      handleCompressionChange('images', 'enabled', !!checked)
                    }
                  />
                  <Label htmlFor="compress-images">Enable Image Compression</Label>
                </div>

                {exportOptions.compression.images.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Quality: {exportOptions.compression.images.quality}%</Label>
                      <Slider
                        value={[exportOptions.compression.images.quality]}
                        onValueChange={([value]) =>
                          handleCompressionChange('images', 'quality', value)
                        }
                        min={1}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Target DPI: {exportOptions.compression.images.targetDPI}</Label>
                      <Slider
                        value={[exportOptions.compression.images.targetDPI]}
                        onValueChange={([value]) =>
                          handleCompressionChange('images', 'targetDPI', value)
                        }
                        min={72}
                        max={300}
                        step={24}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <Label className="text-base font-medium">Text Optimization</Label>
              </div>

              <div className="ml-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="font-subsetting"
                    checked={exportOptions.compression.text.fontSubsetting}
                    onCheckedChange={(checked) =>
                      handleCompressionChange('text', 'fontSubsetting', !!checked)
                    }
                  />
                  <Label htmlFor="font-subsetting">Font Subsetting</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remove-unused-fonts"
                    checked={exportOptions.compression.text.removeUnusedFonts}
                    onCheckedChange={(checked) =>
                      handleCompressionChange('text', 'removeUnusedFonts', !!checked)
                    }
                  />
                  <Label htmlFor="remove-unused-fonts">Remove Unused Fonts</Label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <Label className="text-base font-medium">Structure Optimization</Label>
              </div>

              <div className="ml-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="optimize-structure"
                    checked={exportOptions.compression.structure.optimizeStructure}
                    onCheckedChange={(checked) =>
                      handleCompressionChange('structure', 'optimizeStructure', !!checked)
                    }
                  />
                  <Label htmlFor="optimize-structure">Optimize PDF Structure</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remove-metadata"
                    checked={exportOptions.compression.structure.removeMetadata}
                    onCheckedChange={(checked) =>
                      handleCompressionChange('structure', 'removeMetadata', !!checked)
                    }
                  />
                  <Label htmlFor="remove-metadata">Remove Metadata</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remove-comments"
                    checked={exportOptions.compression.structure.removeComments}
                    onCheckedChange={(checked) =>
                      handleCompressionChange('structure', 'removeComments', !!checked)
                    }
                  />
                  <Label htmlFor="remove-comments">Remove Comments</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <Label className="text-base font-medium">Document Security</Label>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enable-encryption"
                    checked={securitySettings.encryption.enabled}
                    onCheckedChange={(checked) =>
                      handleSecurityChange('encryption', 'enabled', !!checked)
                    }
                  />
                  <Label htmlFor="enable-encryption">Enable Password Protection</Label>
                </div>

                {securitySettings.encryption.enabled && (
                  <div className="ml-6 space-y-3">
                    <div className="space-y-2">
                      <Label>User Password (for opening)</Label>
                      <Input
                        type="password"
                        placeholder="Enter user password"
                        onChange={(e) =>
                          handleSecurityChange('encryption', 'userPassword', e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Owner Password (for permissions)</Label>
                      <Input
                        type="password"
                        placeholder="Enter owner password"
                        onChange={(e) =>
                          handleSecurityChange('encryption', 'ownerPassword', e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Encryption Level</Label>
                      <Select
                        value={securitySettings.encryption.level}
                        onValueChange={(value) =>
                          handleSecurityChange('encryption', 'level', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard (40-bit)</SelectItem>
                          <SelectItem value="high">High (128-bit)</SelectItem>
                          <SelectItem value="aes128">AES 128-bit</SelectItem>
                          <SelectItem value="aes256">AES 256-bit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Document Permissions</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Printing</Label>
                      <Select
                        value={securitySettings.permissions.printing}
                        onValueChange={(value) =>
                          handleSecurityChange('permissions', 'printing', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Not Allowed</SelectItem>
                          <SelectItem value="lowres">Low Resolution</SelectItem>
                          <SelectItem value="highres">High Resolution</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Editing</Label>
                      <Select
                        value={securitySettings.permissions.editing}
                        onValueChange={(value) =>
                          handleSecurityChange('permissions', 'editing', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Not Allowed</SelectItem>
                          <SelectItem value="inserting">Inserting Pages</SelectItem>
                          <SelectItem value="form-filling">Form Filling</SelectItem>
                          <SelectItem value="commenting">Commenting</SelectItem>
                          <SelectItem value="page-assembly">Page Assembly</SelectItem>
                          <SelectItem value="all">All Changes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow-copying"
                      checked={securitySettings.permissions.copying}
                      onCheckedChange={(checked) =>
                        handleSecurityChange('permissions', 'copying', !!checked)
                      }
                    />
                    <Label htmlFor="allow-copying">Allow Text/Graphics Copying</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow-extracting"
                      checked={securitySettings.permissions.extracting}
                      onCheckedChange={(checked) =>
                        handleSecurityChange('permissions', 'extracting', !!checked)
                      }
                    />
                    <Label htmlFor="allow-extracting">Allow Content Extraction</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow-accessibility"
                      checked={securitySettings.permissions.accessibility}
                      onCheckedChange={(checked) =>
                        handleSecurityChange('permissions', 'accessibility', !!checked)
                      }
                    />
                    <Label htmlFor="allow-accessibility">Enable Accessibility</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}