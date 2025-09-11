
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/ui/StarRating';
import { Game, getContestsByGame } from '@/lib/data';

interface GameCardProps {
  game: Game;
  showCategory?: boolean;
}

const GameCard = ({ game, showCategory = true }: GameCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const contests = getContestsByGame(game.id);
  
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-elevated transition-all duration-medium h-full flex flex-col">
      {/* Image container */}
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gray-200 ${imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          <div className="h-full w-full animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        </div>
        <img 
          src={game.image} 
          alt={game.name}
          className={`w-full h-full object-cover transition-transform duration-500 ease-apple group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {showCategory && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm">
              {game.category}
            </span>
          </div>
        )}
        
        {contests.length > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/90 backdrop-blur-sm text-white shadow-sm">
              <Award className="w-3 h-3 mr-1" />
              <span>{contests.length} concours</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2 flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-1">{game.name}</h3>
        </div>
        
        <div className="text-sm text-gray-600 mb-2">{game.publisher}</div>
        
        {/* Voting section */}
        {game.voting_enabled && (
          <div className="mt-2 mb-4 flex items-center">
            <StarRating 
              readOnly 
              rating={4} 
              size="sm" 
            />
            <span className="ml-2 text-sm text-gray-600">4.0 (125 votes)</span>
          </div>
        )}
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
          {game.description}
        </p>
        
        <Button 
          className="w-full mt-auto"
          asChild
        >
          <Link to={`/games/${game.id}`}>Voir et voter</Link>
        </Button>
      </div>
    </div>
  );
};

export default GameCard;
