import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Palette, Type, Square } from 'lucide-react';
import { useAnnotationStore } from '../stores/annotationStore';
import { usePDFStore } from '../stores/pdfStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Slider } from './ui/slider';

export function PropertiesPanel() {
  const { selectedAnnotations, annotations, updateAnnotation, currentProperties, updateCurrentProperty } = useAnnotationStore();
  const { currentDocument } = usePDFStore();
  const [activeTab, setActiveTab] = useState('appearance');

  const selectedAnnotation = selectedAnnotations.length === 1 
    ? annotations.find(ann => ann.id === selectedAnnotations[0])
    : null;

  const handlePropertyChange = (property: string, value: any) => {
    updateCurrentProperty(property as any, value);
    
    if (selectedAnnotation) {
      updateAnnotation(selectedAnnotation.id, {
        properties: {
          ...selectedAnnotation.properties,
          [property]: value,
        }
      });
    }
  };

  const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (color: string) => void }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-xs h-8"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  if (!currentDocument) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No document loaded</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-3 border-b">
        <h3 className="text-sm font-medium">Properties</h3>
        {selectedAnnotation && (
          <p className="text-xs text-muted-foreground">
            {selectedAnnotation.type} annotation selected
          </p>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
          <TabsTrigger value="appearance" className="flex flex-col items-center gap-1 py-2 text-xs">
            <Palette className="h-4 w-4" />
            Style
          </TabsTrigger>
          <TabsTrigger value="text" className="flex flex-col items-center gap-1 py-2 text-xs">
            <Type className="h-4 w-4" />
            Text
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex flex-col items-center gap-1 py-2 text-xs">
            <Square className="h-4 w-4" />
            Layout
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <TabsContent value="appearance" className="m-0 p-4 space-y-4">
            <ColorPicker
              label="Color"
              value={selectedAnnotation?.properties.color || currentProperties.color}
              onChange={(color) => handlePropertyChange('color', color)}
            />

            {selectedAnnotation?.type !== 'text' && (
              <ColorPicker
                label="Background"
                value={selectedAnnotation?.properties.backgroundColor || currentProperties.backgroundColor || '#ffffff'}
                onChange={(color) => handlePropertyChange('backgroundColor', color)}
              />
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Opacity</label>
              <Slider
                value={[selectedAnnotation?.properties.opacity || currentProperties.opacity || 1]}
                onValueChange={([value]) => handlePropertyChange('opacity', value)}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground text-center">
                {Math.round((selectedAnnotation?.properties.opacity || currentProperties.opacity || 1) * 100)}%
              </div>
            </div>

            {['rectangle', 'circle', 'line', 'arrow', 'freehand'].includes(selectedAnnotation?.type || '') && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Stroke Width</label>
                <Slider
                  value={[selectedAnnotation?.properties.strokeWidth || currentProperties.strokeWidth || 2]}
                  onValueChange={([value]) => handlePropertyChange('strokeWidth', value)}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-center">
                  {selectedAnnotation?.properties.strokeWidth || currentProperties.strokeWidth || 2}px
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="text" className="m-0 p-4 space-y-4">
            {(['text', 'note'].includes(selectedAnnotation?.type || '') || selectedAnnotation?.properties.text) && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Text Content</label>
                  <textarea
                    value={selectedAnnotation?.properties.text || ''}
                    onChange={(e) => handlePropertyChange('text', e.target.value)}
                    className="w-full h-20 p-2 text-sm border rounded resize-none"
                    placeholder="Enter text..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Size</label>
                  <Slider
                    value={[selectedAnnotation?.properties.fontSize || currentProperties.fontSize || 14]}
                    onValueChange={([value]) => handlePropertyChange('fontSize', value)}
                    max={72}
                    min={8}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground text-center">
                    {selectedAnnotation?.properties.fontSize || currentProperties.fontSize || 14}px
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Family</label>
                  <select
                    value={selectedAnnotation?.properties.fontFamily || currentProperties.fontFamily || 'Arial'}
                    onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                    className="w-full p-2 text-sm border rounded"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Weight</label>
                  <select
                    value={selectedAnnotation?.properties.fontWeight || currentProperties.fontWeight || 'normal'}
                    onChange={(e) => handlePropertyChange('fontWeight', e.target.value)}
                    className="w-full p-2 text-sm border rounded"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="lighter">Light</option>
                  </select>
                </div>
              </>
            )}

            {!selectedAnnotation && (
              <div className="text-center text-muted-foreground">
                <Type className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a text annotation</p>
                <p className="text-xs">to edit text properties</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="layout" className="m-0 p-4 space-y-4">
            {selectedAnnotation ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">X Position</label>
                    <Input
                      type="number"
                      value={Math.round(selectedAnnotation.x)}
                      onChange={(e) => updateAnnotation(selectedAnnotation.id, { x: Number(e.target.value) })}
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Y Position</label>
                    <Input
                      type="number"
                      value={Math.round(selectedAnnotation.y)}
                      onChange={(e) => updateAnnotation(selectedAnnotation.id, { y: Number(e.target.value) })}
                      className="text-xs h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Width</label>
                    <Input
                      type="number"
                      value={Math.round(selectedAnnotation.width)}
                      onChange={(e) => updateAnnotation(selectedAnnotation.id, { width: Number(e.target.value) })}
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Height</label>
                    <Input
                      type="number"
                      value={Math.round(selectedAnnotation.height)}
                      onChange={(e) => updateAnnotation(selectedAnnotation.id, { height: Number(e.target.value) })}
                      className="text-xs h-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rotation</label>
                  <Slider
                    value={[selectedAnnotation.rotation || 0]}
                    onValueChange={([value]) => updateAnnotation(selectedAnnotation.id, { rotation: value })}
                    max={360}
                    min={-360}
                    step={15}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground text-center">
                    {selectedAnnotation.rotation || 0}°
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Implement bring to front
                      console.log('Bring to front');
                    }}
                    className="w-full"
                  >
                    Bring to Front
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Implement send to back
                      console.log('Send to back');
                    }}
                    className="w-full"
                  >
                    Send to Back
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <Square className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select an annotation</p>
                <p className="text-xs">to edit layout properties</p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}