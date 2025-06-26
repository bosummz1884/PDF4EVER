import { useState } from 'react';
import { Bookmark, Plus, Trash2, Edit } from 'lucide-react';
import { usePDFStore } from '../../stores/pdfStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface BookmarkItem {
  id: string;
  title: string;
  page: number;
  createdAt: Date;
}

export function BookmarkPanel() {
  const { currentDocument, currentPage, setCurrentPage } = usePDFStore();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const addBookmark = () => {
    if (!currentDocument) return;

    const newBookmark: BookmarkItem = {
      id: `bookmark_${Date.now()}`,
      title: `Page ${currentPage}`,
      page: currentPage,
      createdAt: new Date(),
    };

    setBookmarks([...bookmarks, newBookmark]);
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  const startEdit = (bookmark: BookmarkItem) => {
    setEditingId(bookmark.id);
    setEditTitle(bookmark.title);
  };

  const saveEdit = () => {
    if (editingId) {
      setBookmarks(bookmarks.map(bookmark =>
        bookmark.id === editingId
          ? { ...bookmark, title: editTitle }
          : bookmark
      ));
      setEditingId(null);
      setEditTitle('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const goToBookmark = (page: number) => {
    setCurrentPage(page);
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
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="text-sm font-medium">Bookmarks</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={addBookmark}
          title="Add bookmark"
          className="h-6 w-6"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        {bookmarks.length > 0 ? (
          <div className="p-2 space-y-1">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex items-center gap-2 p-2 hover:bg-accent rounded group"
              >
                <Bookmark className="h-4 w-4 text-primary flex-shrink-0" />
                
                {editingId === bookmark.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      className="h-6 text-xs"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={saveEdit}
                      className="h-6 w-6"
                    >
                      ✓
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={cancelEdit}
                      className="h-6 w-6"
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  <>
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => goToBookmark(bookmark.page)}
                    >
                      <div className="text-sm truncate" title={bookmark.title}>
                        {bookmark.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Page {bookmark.page} • {bookmark.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(bookmark)}
                        className="h-6 w-6"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteBookmark(bookmark.id)}
                        className="h-6 w-6 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No bookmarks yet</p>
            <p className="text-xs">Click the + button to add a bookmark</p>
          </div>
        )}
      </div>
    </div>
  );
}