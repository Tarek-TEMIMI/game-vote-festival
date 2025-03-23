
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  initialRating?: number;
  totalStars?: number;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const StarRating = ({
  initialRating = 0,
  totalStars = 5,
  size = 'md',
  readOnly = false,
  onChange,
  className
}: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleClick = (index: number) => {
    if (readOnly) return;
    const newRating = index + 1;
    setRating(newRating);
    onChange?.(newRating);
  };

  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const containerClasses = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  };

  return (
    <div 
      className={cn("flex items-center", containerClasses[size], className)}
      onMouseLeave={handleMouseLeave}
    >
      {[...Array(totalStars)].map((_, index) => {
        const currentRating = hoverRating || rating;
        const isFilled = index < currentRating;
        
        return (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              "transition-all duration-100 ease-apple",
              isFilled 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300",
              !readOnly && "cursor-pointer hover:scale-110"
            )}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
