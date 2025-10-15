import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Trophy, Gamepad2, Calendar, TrendingUp } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import LotteryDrawer from './LotteryDrawer';

interface Stats {
  totalUsers: number;
  totalGames: number;
  totalContests: number;
  totalVotes: number;
  activeContests: number;
}

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalGames: 0,
    totalContests: 0,
    totalVotes: 0,
    activeContests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all statistics in parallel
        const [usersRes, gamesRes, contestsRes, votesRes] = await Promise.all([
          supabase.from('users').select('id', { count: 'exact', head: true }),
          supabase.from('games').select('id', { count: 'exact', head: true }),
          supabase.from('contests').select('id, start_date, end_date', { count: 'exact' }),
          supabase.from('votes').select('id', { count: 'exact', head: true }),
        ]);

        const now = new Date().toISOString();
        const activeContests = contestsRes.data?.filter(
          (c) => c.start_date <= now && c.end_date >= now
        ).length || 0;

        setStats({
          totalUsers: usersRes.count || 0,
          totalGames: gamesRes.count || 0,
          totalContests: contestsRes.count || 0,
          totalVotes: votesRes.count || 0,
          activeContests,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Utilisateurs',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Jeux',
      value: stats.totalGames,
      icon: Gamepad2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Concours',
      value: stats.totalContests,
      icon: Trophy,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Votes totaux',
      value: stats.totalVotes,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Concours actifs',
      value: stats.activeContests,
      icon: Calendar,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Vue d'ensemble</h2>
        <p className="text-muted-foreground">Statistiques globales de la plateforme</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="lottery" className="w-full">
        <TabsList>
          <TabsTrigger value="lottery">Tirage au sort</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="lottery" className="space-y-4">
          <LotteryDrawer isAdmin={true} />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Gestion des utilisateurs</h3>
            <p className="text-muted-foreground">
              Liste complète des utilisateurs à venir...
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Analyses détaillées</h3>
            <p className="text-muted-foreground">
              Graphiques et statistiques détaillées à venir...
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDashboard;
