import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserVotesList from './UserVotesList';
import ContestResults from './ContestResults';
import { Card } from '@/components/ui/card';
import { Trophy, Vote } from 'lucide-react';

const PlayerDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Mon Espace</h2>
        <p className="text-muted-foreground">
          Suivez vos votes et les résultats des concours
        </p>
      </div>

      <Tabs defaultValue="votes" className="w-full">
        <TabsList>
          <TabsTrigger value="votes">
            <Vote className="h-4 w-4 mr-2" />
            Mes Votes
          </TabsTrigger>
          <TabsTrigger value="results">
            <Trophy className="h-4 w-4 mr-2" />
            Résultats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="votes" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Mes Votes</h3>
            <UserVotesList />
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Résultats des concours</h3>
            <ContestResults />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlayerDashboard;
