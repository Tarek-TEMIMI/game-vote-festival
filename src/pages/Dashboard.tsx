
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

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
                Bienvenue, {user?.email}
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
              <TabsTrigger value="games">Mes Jeux</TabsTrigger>
              <TabsTrigger value="contests">Mes Concours</TabsTrigger>
              <TabsTrigger value="votes">Mes Votes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Informations du profil</h2>
              <p className="text-gray-600 mb-4">
                Cette section vous permet de gérer vos informations personnelles.
              </p>
              {/* Afficher les informations du profil ici */}
            </TabsContent>
            
            <TabsContent value="games" className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Mes Jeux</h2>
              <p className="text-gray-600 mb-4">
                Gérez vos jeux et consultez leurs statistiques.
              </p>
              {/* Liste des jeux ici */}
            </TabsContent>
            
            <TabsContent value="contests" className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Mes Concours</h2>
              <p className="text-gray-600 mb-4">
                Gérez vos concours et consultez les résultats.
              </p>
              {/* Liste des concours ici */}
            </TabsContent>
            
            <TabsContent value="votes" className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Mes Votes</h2>
              <p className="text-gray-600 mb-4">
                Consultez l'historique de vos votes.
              </p>
              {/* Liste des votes ici */}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
