
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedContests from "@/components/home/FeaturedContests";
import GameCard from "@/components/games/GameCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { games } from "@/lib/data";
import { initializeAnimations } from "@/lib/animations";

const Index = () => {
  useEffect(() => {
    // Initialize animations when component mounts
    initializeAnimations();
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const featuredGames = games.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <FeaturedContests />
        
        {/* Featured Games Section */}
        <section className="py-16 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div className="contest-animate mb-6 md:mb-0">
                <h2 className="text-3xl font-bold tracking-tight">Jeux à découvrir</h2>
                <p className="mt-2 text-lg text-gray-600 max-w-2xl">
                  Explorez notre sélection de jeux populaires et trouvez votre prochain coup de cœur.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="contest-animate"
                asChild
              >
                <Link to="/games" className="flex items-center">
                  <span>Voir tous les jeux</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredGames.map((game, index) => (
                <div 
                  key={game.id} 
                  className="animate-on-scroll"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <h2 className="text-3xl font-bold tracking-tight">Comment ça marche ?</h2>
              <p className="mt-4 text-lg text-gray-600">
                Participer aux concours de jeux n'a jamais été aussi simple et transparent.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  icon: "👀",
                  title: "Découvrez",
                  description: "Explorez les concours en cours et les événements à venir dans le monde du jeu de société."
                },
                {
                  icon: "🎮",
                  title: "Votez",
                  description: "Donnez votre avis en votant pour vos jeux préférés et aidez-les à remporter les concours."
                },
                {
                  icon: "🏆",
                  title: "Gagnez",
                  description: "Participez à des tirages au sort pour gagner des jeux et des invitations à des événements exclusifs."
                }
              ].map((step, index) => (
                <div 
                  key={index} 
                  className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 animate-on-scroll"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-2xl bg-primary/10 rounded-full">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-primary/5" />
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/10 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-6 animate-on-scroll">
                Prêt à découvrir et voter pour les meilleurs jeux ?
              </h2>
              <p className="text-lg text-gray-600 mb-8 animate-on-scroll">
                Rejoignez notre communauté de passionnés de jeux et faites entendre votre voix dans les concours officiels.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 animate-on-scroll">
                <Button size="lg" asChild>
                  <Link to="/auth?mode=signup">Créer un compte</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/games">Explorer les jeux</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
