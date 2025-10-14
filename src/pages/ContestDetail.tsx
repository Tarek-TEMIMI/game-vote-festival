import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GameCard from '@/components/games/GameCard';
import { Calendar, MapPin, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Contest {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  event_id: string | null;
  voting_enabled: boolean;
}

interface Event {
  id: string;
  name: string;
  address: string;
  logo: string;
  images: string[];
}

interface Game {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  publisher: string;
  voting_enabled: boolean;
}

export default function ContestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);

  const { data: contest, isLoading: contestLoading, error: contestError } = useQuery({
    queryKey: ['contest', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Contest;
    },
    enabled: !!id,
  });

  const { data: games, isLoading: gamesLoading } = useQuery({
    queryKey: ['contest-games', id],
    queryFn: async () => {
      const { data: contestGames, error: cgError } = await supabase
        .from('contest_games')
        .select('game_id')
        .eq('contest_id', id);
      
      if (cgError) throw cgError;
      
      const gameIds = contestGames.map(cg => cg.game_id);
      
      if (gameIds.length === 0) return [];
      
      const { data: gamesData, error: gError } = await supabase
        .from('games')
        .select('*')
        .in('id', gameIds);
      
      if (gError) throw gError;
      return gamesData as Game[];
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (contest?.event_id) {
      supabase
        .from('events')
        .select('*')
        .eq('id', contest.event_id)
        .single()
        .then(({ data }) => {
          if (data) setEvent(data as Event);
        });
    }
  }, [contest]);

  useEffect(() => {
    if (contestError) {
      console.error('Contest not found:', contestError);
      navigate('/contests');
    }
  }, [contestError, navigate]);

  const isActive = contest && new Date(contest.start_date) <= new Date() && new Date(contest.end_date) >= new Date();

  if (contestLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full mb-8 rounded-lg" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-96" />)}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!contest) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <div 
          className="relative h-64 bg-cover bg-center"
          style={{
            backgroundImage: event?.images?.[0] 
              ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${event.images[0]})`
              : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-dark)))'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{contest.name}</h1>
              {isActive && (
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Trophy className="w-4 h-4 mr-2 inline" />
                  En cours
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Contest Info */}
          <div className="bg-card rounded-lg p-6 mb-8 shadow-md">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Dates</p>
                  <p className="font-medium">
                    {format(new Date(contest.start_date), 'dd MMM yyyy', { locale: fr })} - {format(new Date(contest.end_date), 'dd MMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>
              
              {event && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Événement</p>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-muted-foreground">{event.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Games Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Jeux du concours</h2>
            
            {gamesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-96" />)}
              </div>
            ) : games && games.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                Aucun jeu n'est encore inscrit à ce concours.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
