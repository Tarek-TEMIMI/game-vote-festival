
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import SuperAdminDashboard from "@/components/dashboard/SuperAdminDashboard";
import EditorDashboard from "@/components/dashboard/EditorDashboard";
import PlayerDashboard from "@/components/dashboard/PlayerDashboard";
import UserProfile from "@/components/dashboard/UserProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { role, loading } = useUserRole();
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Chargement du tableau de bord...</span>
        </main>
        <Footer />
      </div>
    );
  }

  const getRoleBadge = () => {
    if (role === 'super_admin') return 'Super Administrateur';
    if (role === 'editor') return 'Éditeur';
    return 'Joueur';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Tableau de bord
              </h1>
              <p className="text-gray-600">
                Bienvenue, {user?.user_metadata?.name || user?.email}
                {role && role !== 'player' && (
                  <span className="ml-2 inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                    {getRoleBadge()}
                  </span>
                )}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
            >
              Déconnexion
            </Button>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
              <TabsTrigger value="profile">Mon Profil</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="animate-fade-in">
              {role === 'super_admin' && <SuperAdminDashboard />}
              {role === 'editor' && <EditorDashboard />}
              {role === 'player' && <PlayerDashboard />}
            </TabsContent>
            
            <TabsContent value="profile" className="animate-fade-in">
              <UserProfile />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
