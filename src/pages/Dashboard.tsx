
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import UserProfile from "@/components/dashboard/UserProfile";
import UserVotesList from "@/components/dashboard/UserVotesList";
import ContestResults from "@/components/dashboard/ContestResults";
import ContestManagement from "@/components/dashboard/ContestManagement";
import GameManagement from "@/components/dashboard/GameManagement";

// Define possible user roles
type UserRole = 'player' | 'publisher' | 'admin';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [userRole, setUserRole] = useState<UserRole>('player');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserRole = async () => {
      if (!user) return;
      
      try {
        // Try to get user data from Supabase
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user role:', error);
          // Default to player if there's an error
          setUserRole('player');
        } else if (data) {
          setUserRole(data.role as UserRole);
        }
      } catch (error) {
        console.error('Error:', error);
        // Default to player if there's an error
        setUserRole('player');
      } finally {
        setLoading(false);
      }
    };
    
    getUserRole();
  }, [user]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Tableau de bord
              </h1>
              <p className="text-gray-600">
                Bienvenue, {user?.user_metadata?.name || user?.email}
                {userRole !== 'player' && (
                  <span className="ml-2 inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                    {userRole === 'publisher' ? 'Organisateur' : 'Administrateur'}
                  </span>
                )}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="mt-4 md:mt-0"
            >
              Déconnexion
            </Button>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="profile">Mon Profil</TabsTrigger>
              
              {/* Tabs for regular players */}
              {userRole === 'player' && (
                <>
                  <TabsTrigger value="votes">Mes Votes</TabsTrigger>
                  <TabsTrigger value="results">Résultats</TabsTrigger>
                </>
              )}
              
              {/* Tabs for publishers and admins */}
              {(userRole === 'publisher' || userRole === 'admin') && (
                <>
                  <TabsTrigger value="contests">Mes Concours</TabsTrigger>
                  <TabsTrigger value="games">Mes Jeux</TabsTrigger>
                </>
              )}
            </TabsList>
            
            {/* Profile section for all users */}
            <TabsContent value="profile" className="animate-fade-in">
              <UserProfile />
            </TabsContent>
            
            {/* Regular player tabs */}
            {userRole === 'player' && (
              <>
                <TabsContent value="votes" className="animate-fade-in">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-6">Mes Votes</h2>
                    <UserVotesList />
                  </div>
                </TabsContent>
                
                <TabsContent value="results" className="animate-fade-in">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-6">Résultats des concours</h2>
                    <ContestResults />
                  </div>
                </TabsContent>
              </>
            )}
            
            {/* Publisher and admin tabs */}
            {(userRole === 'publisher' || userRole === 'admin') && (
              <>
                <TabsContent value="contests" className="animate-fade-in">
                  <div className="bg-white rounded-lg shadow p-6">
                    <ContestManagement />
                  </div>
                </TabsContent>
                
                <TabsContent value="games" className="animate-fade-in">
                  <div className="bg-white rounded-lg shadow p-6">
                    <GameManagement />
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
