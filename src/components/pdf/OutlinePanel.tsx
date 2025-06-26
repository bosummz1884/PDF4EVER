import { useState } from 'react';
import { ChevronRight, ChevronDown, FileText } from 'lucide-react';
import { usePDFStore } from '../../stores/pdfStore';
import { Button } from '../ui/button';
import { cn } from '../../utils/cn';

interface OutlineItem {
  title: string;
  page: number;
  level: number;
  children?: OutlineItem[];
}

export function OutlinePanel() {
  const { currentDocument, setCurrentPage } = usePDFStore();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Mock outline data - in a real implementation, this would come from PDF parsing
  const outlineItems: OutlineItem[] = [
    {
      title: "Introduction",
      page: 1,
      level: 0,
      children: [
        { title: "Overview", page: 2, level: 1 },
        { title: "Getting Started", page: 3, level: 1 }
      ]
    },
    {
      title: "Chapter 1: Basics",
      page: 5,
      level: 0,
      children: [
        { title: "Understanding PDFs", page: 6, level: 1 },
        { title: "File Structure", page: 8, level: 1 }
      ]
    },
    {
      title: "Chapter 2: Advanced Features",
      page: 12,
      level: 0,
      children: [
        { title: "Annotations", page: 13, level: 1 },
        { title: "Forms", page: 16, level: 1 },
        { title: "Security", page: 19, level: 1 }
      ]
    }
  ];

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (page: number) => {
    setCurrentPage(page);
  };

  const renderOutlineItem = (item: OutlineItem, index: number, parentId = '') => {
    const itemId = `${parentId}-${index}`;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(itemId);

    return (
      <div key={itemId} className="outline-item">
        <div
          className={cn(
            'flex items-center gap-1 py-1 px-2 hover:bg-accent rounded text-sm cursor-pointer',
            `ml-${item.level * 4}`
          )}
          onClick={() => handleItemClick(item.page)}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(itemId);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          ) : (
            <FileText className="h-3 w-3 ml-4" />
          )}
          
          <span className="flex-1 truncate" title={item.title}>
            {item.title}
          </span>
          
          <span className="text-xs text-muted-foreground">
            {item.page}
          </span>
        </div>

        {hasChildren && isExpanded && item.children && (
          <div className="ml-2">
            {item.children.map((child, childIndex) =>
              renderOutlineItem(child, childIndex, itemId)
            )}
          </div>
        )}
      </div>
    );
  };

  if (!currentDocument) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No document loaded</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <h3 className="text-sm font-medium">Outline</h3>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        {outlineItems.length > 0 ? (
          <div className="p-2">
            {outlineItems.map((item, index) => renderOutlineItem(item, index))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No outline available</p>
            <p className="text-xs">This document doesn't contain bookmarks</p>
          </div>
        )}
      </div>
    </div>
  );
}