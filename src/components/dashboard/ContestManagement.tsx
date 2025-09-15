
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, BarChart, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface Contest {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  games_count: number;
  votes_count: number;
}

const ContestManagement = () => {
  const { user } = useAuth();
  const [contests, setContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Get user role to determine what contests to show
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('Error fetching user role:', userError);
          return;
        }

        // Fetch contests - admins see all, others see only their own
        let query = supabase
          .from('contests')
          .select('id, name, start_date, end_date, user_id, event_id');
        
        if (userData?.role !== 'admin') {
          query = query.eq('user_id', user.id);
        }
        
        const { data, error } = await query;

        if (error) {
          console.error('Error fetching contests:', error);
          return;
        }

        // For each contest, get the number of games and votes
        const contestsWithStats = await Promise.all(
          data.map(async (contest) => {
            // Get number of games in this contest
            const { count: gamesCount, error: gamesError } = await supabase
              .from('contest_games')
              .select('*', { count: 'exact', head: true })
              .eq('contest_id', contest.id);

            if (gamesError) {
              console.error('Error counting games:', gamesError);
            }

            // Get number of votes for this contest
            const { count: votesCount, error: votesError } = await supabase
              .from('votes')
              .select('*', { count: 'exact', head: true })
              .eq('contest_id', contest.id);

            if (votesError) {
              console.error('Error counting votes:', votesError);
            }

            return {
              ...contest,
              games_count: gamesCount || 0,
              votes_count: votesCount || 0
            };
          })
        );

        setContests(contestsWithStats);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContests();
  }, [user]);

  const handleDelete = async (contestId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce concours ? Cette action est irréversible.')) {
      return;
    }

    try {
      // Delete the contest
      const { error } = await supabase
        .from('contests')
        .delete()
        .eq('id', contestId);

      if (error) {
        throw error;
      }

      // Update UI
      setContests(contests.filter(contest => contest.id !== contestId));
      
      toast({
        title: "Concours supprimé",
        description: "Le concours a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Error deleting contest:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du concours.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Chargement de vos concours...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestion des concours</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Créer un concours
        </Button>
      </div>

      {contests.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-lg font-medium mb-2">Vous n'avez pas encore créé de concours</h3>
          <p className="text-gray-600 mb-6">
            Commencez par créer votre premier concours pour permettre aux joueurs de voter pour leurs jeux préférés.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Créer un concours
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {contests.map((contest) => {
            const startDate = new Date(contest.start_date);
            const endDate = new Date(contest.end_date);
            const now = new Date();
            const isActive = now >= startDate && now <= endDate;
            const isPast = now > endDate;
            const isFuture = now < startDate;

            return (
              <Card key={contest.id} className="p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-semibold text-lg">{contest.name}</h3>
                      {isActive && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                          En cours
                        </span>
                      )}
                      {isPast && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                          Terminé
                        </span>
                      )}
                      {isFuture && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                          À venir
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 mt-1">
                      Du {startDate.toLocaleDateString('fr-FR')} au {endDate.toLocaleDateString('fr-FR')}
                    </div>

                    <div className="flex mt-2">
                      <div className="mr-4">
                        <span className="text-sm font-medium">{contest.games_count}</span>{' '}
                        <span className="text-sm text-gray-600">jeux</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">{contest.votes_count}</span>{' '}
                        <span className="text-sm text-gray-600">votes</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4 md:mt-0">
                    <Button variant="outline" size="sm">
                      <BarChart className="h-4 w-4 mr-1" />
                      Statistiques
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Éditer
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:bg-red-50" 
                      onClick={() => handleDelete(contest.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContestManagement;
