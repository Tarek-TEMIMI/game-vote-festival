
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import StarRating from '@/components/ui/StarRating';

interface UserVote {
  id: string;
  game_name: string;
  game_image: string;
  contest_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

const UserVotesList = () => {
  const { user } = useAuth();
  const [votes, setVotes] = useState<UserVote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVotes = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Fetch user votes with game and contest details
        const { data, error } = await supabase
          .from('votes')
          .select(`
            id,
            rating,
            comment,
            created_at,
            games!inner(id, name, image),
            contests!inner(id, name)
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching votes:', error);
          return;
        }

        // Transform the data to a flatter structure
        const formattedVotes = data.map((vote: any) => ({
          id: vote.id,
          game_name: vote.games.name,
          game_image: vote.games.image,
          contest_name: vote.contests.name,
          rating: vote.rating,
          comment: vote.comment,
          created_at: vote.created_at,
        }));

        setVotes(formattedVotes);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVotes();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Chargement de vos votes...</span>
      </div>
    );
  }

  if (votes.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="text-4xl mb-4">🎮</div>
        <h3 className="text-lg font-medium mb-2">Vous n'avez pas encore voté</h3>
        <p className="text-gray-600">
          Parcourez les concours et votez pour vos jeux préférés pour les voir apparaître ici.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {votes.map((vote) => (
        <Card key={vote.id} className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-shrink-0">
            <img 
              src={vote.game_image} 
              alt={vote.game_name} 
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
          
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{vote.game_name}</h4>
                <p className="text-sm text-gray-600">Concours: {vote.contest_name}</p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(vote.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
            
            <div className="mb-2">
              <StarRating rating={vote.rating} readOnly />
            </div>
            
            {vote.comment && (
              <p className="text-sm text-gray-700 italic">
                "{vote.comment}"
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default UserVotesList;
