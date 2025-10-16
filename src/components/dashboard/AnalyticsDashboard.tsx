import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, TrendingUp, Users, Trophy, Star } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface VotesByGame {
  game_name: string;
  vote_count: number;
  average_rating: number;
}

interface VotesByContest {
  contest_name: string;
  vote_count: number;
  participant_count: number;
}

interface VotesTrend {
  date: string;
  count: number;
}

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [votesByGame, setVotesByGame] = useState<VotesByGame[]>([]);
  const [votesByContest, setVotesByContest] = useState<VotesByContest[]>([]);
  const [votesTrend, setVotesTrend] = useState<VotesTrend[]>([]);
  const [ratingDistribution, setRatingDistribution] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch votes with game and contest info
      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select(`
          id,
          rating,
          created_at,
          game_id,
          contest_id,
          games(name),
          contests(name)
        `);

      if (votesError) throw votesError;

      // Process votes by game
      const gameStats = votesData?.reduce((acc: any, vote: any) => {
        const gameName = vote.games?.name || 'Inconnu';
        if (!acc[gameName]) {
          acc[gameName] = { total: 0, count: 0 };
        }
        acc[gameName].total += vote.rating;
        acc[gameName].count += 1;
        return acc;
      }, {});

      const gameAnalytics = Object.entries(gameStats || {}).map(([name, stats]: [string, any]) => ({
        game_name: name,
        vote_count: stats.count,
        average_rating: Number((stats.total / stats.count).toFixed(2)),
      })).sort((a, b) => b.vote_count - a.vote_count);

      setVotesByGame(gameAnalytics);

      // Process votes by contest
      const contestStats = votesData?.reduce((acc: any, vote: any) => {
        const contestName = vote.contests?.name || 'Inconnu';
        if (!acc[contestName]) {
          acc[contestName] = { voters: new Set(), count: 0 };
        }
        acc[contestName].voters.add(vote.id);
        acc[contestName].count += 1;
        return acc;
      }, {});

      const contestAnalytics = Object.entries(contestStats || {}).map(([name, stats]: [string, any]) => ({
        contest_name: name,
        vote_count: stats.count,
        participant_count: stats.voters.size,
      })).sort((a, b) => b.vote_count - a.vote_count);

      setVotesByContest(contestAnalytics);

      // Process votes trend (last 30 days)
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split('T')[0];
      });

      const trendData = last30Days.map(date => {
        const count = votesData?.filter(v => 
          v.created_at.startsWith(date)
        ).length || 0;
        return {
          date: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
          count,
        };
      });

      setVotesTrend(trendData);

      // Process rating distribution
      const distribution = [1, 2, 3, 4, 5].map(rating => ({
        rating: `${rating} ⭐`,
        count: votesData?.filter(v => v.rating === rating).length || 0,
      }));

      setRatingDistribution(distribution);

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les analyses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="games" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="games">Jeux</TabsTrigger>
          <TabsTrigger value="contests">Concours</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="ratings">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="games" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Votes par Jeu
              </CardTitle>
              <CardDescription>
                Nombre de votes et note moyenne par jeu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={votesByGame}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="game_name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="vote_count" name="Nombre de votes" fill="#8b5cf6" />
                  <Bar dataKey="average_rating" name="Note moyenne" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {votesByGame.slice(0, 6).map((game, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    {game.game_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-2xl font-bold">{game.vote_count}</span>
                      <span className="text-sm text-muted-foreground">votes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-2xl font-bold">{game.average_rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Participation par Concours
              </CardTitle>
              <CardDescription>
                Nombre de votes et participants uniques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={votesByContest}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="contest_name" angle={-45} textAnchor="end" height={120} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="vote_count" name="Votes" fill="#3b82f6" />
                  <Bar dataKey="participant_count" name="Participants" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Évolution des Votes (30 derniers jours)
              </CardTitle>
              <CardDescription>
                Tendance de participation au fil du temps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={votesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="Nombre de votes" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Distribution des Notes
              </CardTitle>
              <CardDescription>
                Répartition des notes attribuées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ratingDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ rating, count, percent }) => 
                        `${rating}: ${count} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {ratingDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ratingDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Nombre de votes">
                      {ratingDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
