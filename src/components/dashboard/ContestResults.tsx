
import { useState, useEffect } from 'react';
import { Loader2, Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import StarRating from '@/components/ui/StarRating';

interface ContestResult {
  contest_id: string;
  contest_name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_completed: boolean;
  games: {
    id: string;
    name: string;
    image: string;
    average_rating: number;
    votes_count: number;
    rank: number;
  }[];
}

const ContestResults = () => {
  const [contestResults, setContestResults] = useState<ContestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContestResults = async () => {
      try {
        setIsLoading(true);
        
        // Fetch contests with vote data
        const { data: contests, error: contestsError } = await supabase
          .from('contests')
          .select('id, name, start_date, end_date');

        if (contestsError) {
          console.error('Error fetching contests:', contestsError);
          return;
        }

        if (!contests || contests.length === 0) {
          setIsLoading(false);
          return;
        }

        const results = await Promise.all(
          contests.map(async (contest) => {
            // For each contest, get the games and their votes
            const { data: gameVotes, error: gameVotesError } = await supabase
              .from('contest_games')
              .select(`
                games!inner(
                  id, 
                  name, 
                  image
                )
              `)
              .eq('contest_id', contest.id);

            if (gameVotesError) {
              console.error('Error fetching game votes:', gameVotesError);
              return null;
            }

            // Get vote data for each game in this contest
            const gamesWithRatings = await Promise.all(
              gameVotes.map(async (gv: any) => {
                const gameId = gv.games.id;
                
                const { data: votes, error: votesError } = await supabase
                  .from('votes')
                  .select('rating')
                  .eq('game_id', gameId)
                  .eq('contest_id', contest.id);

                if (votesError) {
                  console.error('Error fetching votes:', votesError);
                  return {
                    ...gv.games,
                    average_rating: 0,
                    votes_count: 0,
                    rank: 0
                  };
                }

                // Calculate average rating
                const ratingsSum = votes.reduce((sum: number, vote: any) => sum + vote.rating, 0);
                const avgRating = votes.length > 0 ? ratingsSum / votes.length : 0;

                return {
                  ...gv.games,
                  average_rating: parseFloat(avgRating.toFixed(1)),
                  votes_count: votes.length,
                  rank: 0 // Will be set after sorting
                };
              })
            );

            // Sort games by average rating (descending)
            const sortedGames = gamesWithRatings
              .filter(Boolean)
              .sort((a, b) => b.average_rating - a.average_rating);

            // Assign ranks
            sortedGames.forEach((game, index) => {
              game.rank = index + 1;
            });

            const now = new Date();
            const startDate = new Date(contest.start_date);
            const endDate = new Date(contest.end_date);

            return {
              contest_id: contest.id,
              contest_name: contest.name,
              start_date: contest.start_date,
              end_date: contest.end_date,
              is_active: now >= startDate && now <= endDate,
              is_completed: now > endDate,
              games: sortedGames
            };
          })
        );

        // Filter out any null results and sort by end date (most recent first)
        const validResults = results
          .filter(Boolean)
          .sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());

        setContestResults(validResults);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContestResults();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Chargement des résultats...</span>
      </div>
    );
  }

  if (contestResults.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="text-4xl mb-4">🏆</div>
        <h3 className="text-lg font-medium mb-2">Aucun résultat disponible</h3>
        <p className="text-gray-600">
          Les résultats des concours apparaîtront ici une fois qu'ils seront terminés.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {contestResults.map((contest) => (
        <Card key={contest.contest_id} className="overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{contest.contest_name}</h3>
              <div className="text-sm text-gray-600">
                {new Date(contest.start_date).toLocaleDateString('fr-FR')} - {new Date(contest.end_date).toLocaleDateString('fr-FR')}
              </div>
            </div>
            <div className="text-sm mt-1">
              {contest.is_active && <span className="text-green-600 font-medium">En cours</span>}
              {contest.is_completed && <span className="text-blue-600 font-medium">Terminé</span>}
              {!contest.is_active && !contest.is_completed && <span className="text-orange-600 font-medium">À venir</span>}
            </div>
          </div>
          
          <div className="p-4">
            {contest.games.slice(0, 3).map((game) => (
              <div key={game.id} className="flex items-center mb-4 last:mb-0">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  {game.rank === 1 && <Trophy className="h-6 w-6 text-yellow-500" />}
                  {game.rank === 2 && <Trophy className="h-6 w-6 text-gray-400" />}
                  {game.rank === 3 && <Trophy className="h-6 w-6 text-amber-700" />}
                  {game.rank > 3 && <div className="text-gray-500 font-medium">{game.rank}</div>}
                </div>
                
                <div className="flex-shrink-0 ml-2">
                  <img 
                    src={game.image} 
                    alt={game.name} 
                    className="w-12 h-12 object-cover rounded"
                  />
                </div>
                
                <div className="ml-4 flex-grow">
                  <div className="font-medium">{game.name}</div>
                  <div className="flex items-center">
                    <StarRating value={game.average_rating} readOnly size="sm" />
                    <span className="text-sm text-gray-600 ml-2">
                      ({game.average_rating.toFixed(1)}/5 · {game.votes_count} votes)
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {contest.games.length > 3 && (
              <div className="text-sm text-center text-gray-600 mt-2">
                + {contest.games.length - 3} autres jeux
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ContestResults;
