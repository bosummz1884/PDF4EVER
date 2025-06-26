import { Annotation } from '../../types';
import { cn } from '../../utils/cn';

interface AnnotationRendererProps {
  annotation: Annotation;
  scale: number;
  isSelected: boolean;
  onClick: (event: React.MouseEvent) => void;
}

export function AnnotationRenderer({ 
  annotation, 
  scale, 
  isSelected, 
  onClick 
}: AnnotationRendererProps) {
  const style = {
    position: 'absolute' as const,
    left: annotation.x * scale,
    top: annotation.y * scale,
    width: annotation.width * scale,
    height: annotation.height * scale,
    transform: annotation.rotation ? `rotate(${annotation.rotation}deg)` : undefined,
  };

  const baseClasses = cn(
    'cursor-pointer transition-all duration-200',
    isSelected && 'ring-2 ring-primary ring-offset-1'
  );

  switch (annotation.type) {
    case 'text':
      return (
        <div
          style={style}
          className={cn(baseClasses, 'flex items-center justify-center')}
          onClick={onClick}
        >
          <span
            style={{
              color: annotation.properties.color,
              fontSize: (annotation.properties.fontSize || 14) * scale,
              fontFamily: annotation.properties.fontFamily || 'Arial',
              fontWeight: annotation.properties.fontWeight || 'normal',
            }}
          >
            {annotation.properties.text}
          </span>
        </div>
      );

    case 'highlight':
      return (
        <div
          style={{
            ...style,
            backgroundColor: annotation.properties.color,
            opacity: annotation.properties.opacity || 0.3,
          }}
          className={cn(baseClasses)}
          onClick={onClick}
        />
      );

    case 'rectangle':
      return (
        <div
          style={{
            ...style,
            border: `${annotation.properties.borderWidth || 1}px solid ${annotation.properties.borderColor || annotation.properties.color}`,
            backgroundColor: annotation.properties.backgroundColor || 'transparent',
          }}
          className={cn(baseClasses)}
          onClick={onClick}
        />
      );

    case 'circle':
      return (
        <div
          style={{
            ...style,
            border: `${annotation.properties.borderWidth || 1}px solid ${annotation.properties.borderColor || annotation.properties.color}`,
            backgroundColor: annotation.properties.backgroundColor || 'transparent',
            borderRadius: '50%',
          }}
          className={cn(baseClasses)}
          onClick={onClick}
        />
      );

    case 'line':
      return (
        <svg
          style={style}
          className={cn(baseClasses)}
          onClick={onClick}
        >
          <line
            x1={0}
            y1={annotation.height * scale / 2}
            x2={annotation.width * scale}
            y2={annotation.height * scale / 2}
            stroke={annotation.properties.color}
            strokeWidth={(annotation.properties.strokeWidth || 2) * scale}
          />
        </svg>
      );

    case 'arrow':
      return (
        <svg
          style={style}
          className={cn(baseClasses)}
          onClick={onClick}
        >
          <defs>
            <marker
              id={`arrowhead-${annotation.id}`}
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill={annotation.properties.color}
              />
            </marker>
          </defs>
          <line
            x1={0}
            y1={annotation.height * scale / 2}
            x2={annotation.width * scale}
            y2={annotation.height * scale / 2}
            stroke={annotation.properties.color}
            strokeWidth={(annotation.properties.strokeWidth || 2) * scale}
            markerEnd={`url(#arrowhead-${annotation.id})`}
          />
        </svg>
      );

    case 'freehand':
      if (!annotation.properties.points) return null;
      
      const pathData = annotation.properties.points
        .map((point, index) => 
          `${index === 0 ? 'M' : 'L'} ${point.x * scale} ${point.y * scale}`
        )
        .join(' ');

      return (
        <svg
          style={style}
          className={cn(baseClasses)}
          onClick={onClick}
        >
          <path
            d={pathData}
            stroke={annotation.properties.color}
            strokeWidth={(annotation.properties.strokeWidth || 2) * scale}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'image':
      return (
        <div
          style={style}
          className={cn(baseClasses)}
          onClick={onClick}
        >
          {annotation.properties.imageData && (
            <img
              src={annotation.properties.imageData}
              alt="Annotation"
              className="w-full h-full object-contain"
            />
          )}
        </div>
      );

    case 'note':
      return (
        <div
          style={style}
          className={cn(
            baseClasses,
            'bg-yellow-100 border-2 border-yellow-300 rounded p-2 text-xs'
          )}
          onClick={onClick}
        >
          <div className="font-bold mb-1">Note</div>
          <div>{annotation.properties.text}</div>
        </div>
      );

    default:
      return (
        <div
          style={style}
          className={cn(baseClasses, 'bg-gray-200 border border-gray-400')}
          onClick={onClick}
        />
      );
  }
}