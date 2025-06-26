import { ChevronLeft, ChevronRight, RotateCcw, RotateCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState } from 'react';

interface PageControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PageControls({ currentPage, totalPages, onPageChange }: PageControlsProps) {
  const [inputValue, setInputValue] = useState(currentPage.toString());

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleInputSubmit = () => {
    const page = parseInt(inputValue);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      setInputValue(currentPage.toString());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      setInputValue((currentPage - 1).toString());
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      setInputValue((currentPage + 1).toString());
    }
  };

  return (
    <div className="flex items-center justify-between p-2 border-b bg-background">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousPage}
          disabled={currentPage <= 1}
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleInputSubmit}
            onKeyPress={handleKeyPress}
            className="w-16 h-8 text-center text-sm"
          />
          <span className="text-sm text-muted-foreground">
            of {totalPages}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {}}
          title="Rotate counterclockwise"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {}}
          title="Rotate clockwise"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}