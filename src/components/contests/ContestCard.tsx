
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Contest, Event, Game, getEventById, getGamesByContest } from '@/lib/data';

interface ContestCardProps {
  contest: Contest;
}

const ContestCard = ({ contest }: ContestCardProps) => {
  // Try to get event from Supabase, fall back to mock data
  const { data: event } = useQuery({
    queryKey: ['event', contest.event_id],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        return getEventById(contest.event_id);
      }
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', contest.event_id)
        .single();
      
      if (error || !data) {
        // Fallback to mock data
        return getEventById(contest.event_id);
      }
      
      return data as Event;
    },
    // Only fetch if we have an event_id
    enabled: !!contest.event_id,
  });
  
  // Try to get games from Supabase, fall back to mock data
  const { data: games = [] } = useQuery({
    queryKey: ['contestGames', contest.id],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        return getGamesByContest(contest.id);
      }
      
      if (!contest.associated_games || contest.associated_games.length === 0) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .in('id', contest.associated_games);
      
      if (error || !data || data.length === 0) {
        // Fallback to mock data
        return getGamesByContest(contest.id);
      }
      
      return data as Game[];
    },
  });
  
  const startDate = new Date(contest.start_date);
  const endDate = new Date(contest.end_date);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };
  
  const isActive = () => {
    const now = new Date();
    return now >= startDate && now <= endDate;
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-elevated transition-all duration-medium flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event?.images ? (Array.isArray(event.images) ? event.images[0] : event.images) : "https://images.unsplash.com/photo-1529480653439-b16be867b796?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
          alt={contest.name}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        
        {isActive() && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
              En cours
            </span>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white">{contest.name}</h3>
          
          <div className="flex items-center mt-2">
            <Calendar className="h-4 w-4 text-white/80 mr-1.5" />
            <span className="text-sm text-white/80">
              {formatDate(startDate)} - {formatDate(endDate)} {endDate.getFullYear()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="space-y-4 mb-4">
          {event && (
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{event.name}</p>
                <p className="text-xs text-gray-600">{event.address}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-start">
            <Users className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium">{games.length} jeux en compétition</p>
              <p className="text-xs text-gray-600">Votez pour vos favoris</p>
            </div>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="flex -space-x-2 overflow-hidden mb-4">
            {games.slice(0, 5).map((game) => (
              <img
                key={game.id}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                src={game.image}
                alt={game.name}
              />
            ))}
            {games.length > 5 && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 text-xs font-medium text-gray-500">
                +{games.length - 5}
              </div>
            )}
          </div>
          
          <Button 
            className="w-full"
            asChild
          >
            <Link to={`/contests/${contest.id}`}>
              Voir les détails
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
