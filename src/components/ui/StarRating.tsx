
import React from 'react';
import { Star } from 'lucide-react';

export interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  onChange,
  readOnly = false,
  size = 'md',
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleClick = (selectedRating: number) => {
    if (readOnly) return;
    onChange?.(selectedRating);
  };

  const handleMouseEnter = (hoveredRating: number) => {
    if (readOnly) return;
    setHoverRating(hoveredRating);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      starSize: 14,
      gap: 1,
    },
    md: {
      starSize: 20,
      gap: 2,
    },
    lg: {
      starSize: 24,
      gap: 3,
    },
  };

  const { starSize, gap } = sizeConfig[size];

  return (
    <div 
      className="flex items-center" 
      style={{ gap: `${gap}px` }}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = (hoverRating || rating) >= star;
        
        return (
          <Star
            key={star}
            size={starSize}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            className={`${
              isActive ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } ${!readOnly ? 'cursor-pointer' : ''} transition-colors`}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
