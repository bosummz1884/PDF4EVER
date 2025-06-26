import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { ThumbnailPanel } from './pdf/ThumbnailPanel';
import { OutlinePanel } from './pdf/OutlinePanel';
import { BookmarkPanel } from './pdf/BookmarkPanel';
import { AnnotationPanel } from './pdf/AnnotationPanel';
import { 
  FileText, 
  List, 
  Bookmark, 
  MessageSquare 
} from 'lucide-react';

export function Sidebar() {
  const [activeTab, setActiveTab] = useState('thumbnails');

  return (
    <div className="h-full flex flex-col bg-card">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
          <TabsTrigger 
            value="thumbnails" 
            className="flex flex-col items-center gap-1 py-2 text-xs"
          >
            <FileText className="h-4 w-4" />
            Pages
          </TabsTrigger>
          <TabsTrigger 
            value="outline" 
            className="flex flex-col items-center gap-1 py-2 text-xs"
          >
            <List className="h-4 w-4" />
            Outline
          </TabsTrigger>
          <TabsTrigger 
            value="bookmarks" 
            className="flex flex-col items-center gap-1 py-2 text-xs"
          >
            <Bookmark className="h-4 w-4" />
            Bookmarks
          </TabsTrigger>
          <TabsTrigger 
            value="annotations" 
            className="flex flex-col items-center gap-1 py-2 text-xs"
          >
            <MessageSquare className="h-4 w-4" />
            Notes
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="thumbnails" className="h-full m-0">
            <ThumbnailPanel />
          </TabsContent>
          
          <TabsContent value="outline" className="h-full m-0">
            <OutlinePanel />
          </TabsContent>
          
          <TabsContent value="bookmarks" className="h-full m-0">
            <BookmarkPanel />
          </TabsContent>
          
          <TabsContent value="annotations" className="h-full m-0">
            <AnnotationPanel />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}