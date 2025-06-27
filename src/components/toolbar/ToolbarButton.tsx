import { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../utils/cn';

interface ToolbarButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  tooltip?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'icon';
  className?: string;
}

export function ToolbarButton({
  icon: Icon,
  onClick,
  disabled = false,
  active = false,
  tooltip,
  variant = 'ghost',
  size = 'icon',
  className
}: ToolbarButtonProps) {
  return (
    <Button
      variant={active ? 'default' : variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={cn(
        'h-8 w-8',
        active && 'bg-primary/10 text-primary',
        className
      )}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}