import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContestManagement from './ContestManagement';
import GameManagement from './GameManagement';
import LotteryDrawer from './LotteryDrawer';

const EditorDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Espace Éditeur</h2>
        <p className="text-muted-foreground">
          Gérez vos concours, jeux et tirages au sort
        </p>
      </div>

      <Tabs defaultValue="contests" className="w-full">
        <TabsList>
          <TabsTrigger value="contests">Mes Concours</TabsTrigger>
          <TabsTrigger value="games">Mes Jeux</TabsTrigger>
          <TabsTrigger value="lottery">Tirage au sort</TabsTrigger>
        </TabsList>

        <TabsContent value="contests" className="space-y-4">
          <ContestManagement />
        </TabsContent>

        <TabsContent value="games" className="space-y-4">
          <GameManagement />
        </TabsContent>

        <TabsContent value="lottery" className="space-y-4">
          <LotteryDrawer isAdmin={false} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditorDashboard;
