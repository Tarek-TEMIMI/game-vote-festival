import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2, Trophy, Sparkles } from 'lucide-react';

interface Contest {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

interface Winner {
  id: string;
  name: string;
  email: string;
}

interface LotteryDrawerProps {
  isAdmin: boolean;
}

const LotteryDrawer = ({ isAdmin }: LotteryDrawerProps) => {
  const { user } = useAuth();
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContest, setSelectedContest] = useState<string>('');
  const [numberOfWinners, setNumberOfWinners] = useState<number>(1);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        let query = supabase
          .from('contests')
          .select('id, name, start_date, end_date')
          .order('start_date', { ascending: false });

        // If not admin, only show contests created by this user
        if (!isAdmin && user) {
          query = query.eq('user_id', user.id);
        }

        const { data, error } = await query;

        if (error) throw error;
        setContests(data || []);
      } catch (error) {
        console.error('Error fetching contests:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les concours.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [isAdmin, user]);

  const performDraw = async () => {
    if (!selectedContest) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un concours.',
        variant: 'destructive',
      });
      return;
    }

    setIsDrawing(true);
    setWinners([]);

    try {
      // Get all votes for the selected contest
      const { data: votes, error: votesError } = await supabase
        .from('votes')
        .select('user_id')
        .eq('contest_id', selectedContest);

      if (votesError) throw votesError;

      if (!votes || votes.length === 0) {
        toast({
          title: 'Aucun participant',
          description: 'Ce concours n\'a pas encore de votes.',
          variant: 'destructive',
        });
        setIsDrawing(false);
        return;
      }

      // Get unique user IDs
      const uniqueUserIds = Array.from(new Set(votes.map(v => v.user_id)));

      // Fetch user details for these IDs
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, email')
        .in('id', uniqueUserIds);

      if (usersError) throw usersError;

      if (!usersData || usersData.length < numberOfWinners) {
        toast({
          title: 'Pas assez de participants',
          description: `Il n'y a que ${usersData?.length || 0} participant(s), vous ne pouvez pas tirer ${numberOfWinners} gagnant(s).`,
          variant: 'destructive',
        });
        setIsDrawing(false);
        return;
      }

      // Simulate animation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Randomly select winners
      const shuffled = [...usersData].sort(() => Math.random() - 0.5);
      const selectedWinners = shuffled.slice(0, numberOfWinners).map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
      }));

      setWinners(selectedWinners);

      toast({
        title: '🎉 Tirage effectué !',
        description: `${selectedWinners.length} gagnant(s) ont été tirés au sort.`,
      });
    } catch (error) {
      console.error('Error performing draw:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors du tirage.',
        variant: 'destructive',
      });
    } finally {
      setIsDrawing(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Tirage au sort</h3>
            <p className="text-sm text-muted-foreground">
              Sélectionnez un concours et tirez au sort les gagnants
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Concours</label>
            <Select value={selectedContest} onValueChange={setSelectedContest}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un concours" />
              </SelectTrigger>
              <SelectContent>
                {contests.map((contest) => (
                  <SelectItem key={contest.id} value={contest.id}>
                    {contest.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre de gagnants</label>
            <Select
              value={numberOfWinners.toString()}
              onValueChange={(v) => setNumberOfWinners(parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} gagnant{num > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={performDraw}
          disabled={!selectedContest || isDrawing}
          className="w-full"
          size="lg"
        >
          {isDrawing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Tirage en cours...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Effectuer le tirage
            </>
          )}
        </Button>

        {winners.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Gagnants du tirage
            </h4>
            <div className="space-y-2">
              {winners.map((winner, index) => (
                <div
                  key={winner.id}
                  className="flex items-center gap-3 p-3 bg-white rounded-md"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center font-bold text-amber-700">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{winner.name}</p>
                    <p className="text-sm text-muted-foreground">{winner.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LotteryDrawer;
