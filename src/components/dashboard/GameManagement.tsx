
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useOrganizationGames } from '@/hooks/useOrganizationData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface Game {
  id: string;
  name: string;
  category: string;
  image: string;
  contest_count: number;
  vote_count: number;
}

const GameManagement = () => {
  const { user } = useAuth();
  const { data: organizationGames = [], isLoading: gamesLoading, refetch } = useOrganizationGames();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const addStatsToGames = async () => {
      if (!organizationGames.length) {
        setGames([]);
        setIsLoading(false);
        return;
      }

      try {
        // For each game, get the number of contests and votes
        const gamesWithStats = await Promise.all(
          organizationGames.map(async (game) => {
            // Get number of contests this game is in
            const { count: contestCount, error: contestsError } = await supabase
              .from('contest_games')
              .select('*', { count: 'exact', head: true })
              .eq('game_id', game.id);

            if (contestsError) {
              console.error('Error counting contests:', contestsError);
            }

            // Get number of votes for this game
            const { count: voteCount, error: votesError } = await supabase
              .from('votes')
              .select('*', { count: 'exact', head: true })
              .eq('game_id', game.id);

            if (votesError) {
              console.error('Error counting votes:', votesError);
            }

            return {
              id: game.id,
              name: game.name,
              category: game.category,
              image: game.image,
              contest_count: contestCount || 0,
              vote_count: voteCount || 0
            };
          })
        );

        setGames(gamesWithStats);
      } catch (error) {
        console.error('Error adding stats to games:', error);
      } finally {
        setIsLoading(false);
      }
    };

    addStatsToGames();
  }, [organizationGames]);

  const handleDelete = async (gameId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce jeu ? Cette action est irréversible.')) {
      return;
    }

    try {
      // Delete the game
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId);

      if (error) {
        throw error;
      }

      // Update UI
      setGames(games.filter(game => game.id !== gameId));
      refetch(); // Refetch organization games
      
      toast({
        title: "Jeu supprimé",
        description: "Le jeu a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Error deleting game:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du jeu.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || gamesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Chargement de vos jeux...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Vos jeux</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un jeu
        </Button>
      </div>

      {games.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="text-4xl mb-4">🎮</div>
          <h3 className="text-lg font-medium mb-2">Vous n'avez pas encore ajouté de jeux</h3>
          <p className="text-gray-600 mb-6">
            Ajoutez vos premiers jeux pour pouvoir les inclure dans vos concours.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un jeu
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <Card key={game.id} className="overflow-hidden flex flex-col">
              <img 
                src={game.image} 
                alt={game.name} 
                className="h-40 w-full object-cover"
              />
              
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-medium text-lg mb-1">{game.name}</h3>
                <div className="text-sm text-gray-600 mb-3">
                  Catégorie: {game.category}
                </div>
                
                <div className="flex text-sm text-gray-600 mt-auto mb-4">
                  <div className="mr-4">
                    <span className="font-medium">{game.contest_count}</span> concours
                  </div>
                  <div>
                    <span className="font-medium">{game.vote_count}</span> votes
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Éditer
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:bg-red-50" 
                    onClick={() => handleDelete(game.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameManagement;
