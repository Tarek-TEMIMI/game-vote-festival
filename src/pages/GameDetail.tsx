
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StarRating from '@/components/ui/StarRating';
import { Button } from '@/components/ui/button';
import { getGameById, getContestsByGame } from '@/lib/data';
import { ArrowLeft, Award, Calendar, Info, Share2 } from 'lucide-react';
import { initializeAnimations } from '@/lib/animations';
import GameCard from '@/components/games/GameCard';
import { toast } from "@/components/ui/use-toast";

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const game = id ? getGameById(parseInt(id, 10)) : undefined;
  const contests = id ? getContestsByGame(parseInt(id, 10)) : [];
  
  // Similar games (for demo purposes - in real app would be based on category or other factors)
  const similarGames = id 
    ? getGameById(parseInt(id, 10))?.category
        ? Array.from({ length: 3 }).map((_, index) => ({
            ...getGameById(((parseInt(id, 10) + index + 1) % 6) + 1)!
          }))
        : []
    : [];
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    // Initialize animations
    initializeAnimations();
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [id]);
  
  const handleRatingChange = (rating: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour voter",
        variant: "destructive",
      });
      return;
    }
    
    setUserRating(rating);
    toast({
      title: "Vote enregistré !",
      description: `Vous avez attribué ${rating} étoiles à ${game?.name}.`,
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: game?.name,
        text: `Découvrez ${game?.name} sur MonJeu.vote !`,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié !",
        description: "L'URL a été copiée dans votre presse-papier.",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-8" />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="h-72 bg-gray-200 rounded-xl mb-6" />
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="h-64 bg-gray-200 rounded-xl mb-6" />
                  <div className="h-10 bg-gray-200 rounded mb-4" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!game) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Jeu non trouvé</h1>
            <p className="text-gray-600 mb-6">Le jeu que vous recherchez n'existe pas.</p>
            <Button asChild>
              <Link to="/games">Retour aux jeux</Link>
            </Button>
          </div>
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
          {/* Breadcrumb */}
          <div className="mb-6 animate-fade-in">
            <Button variant="ghost" size="sm" asChild className="pl-0 hover:bg-transparent">
              <Link to="/games" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux jeux
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left section: Game details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="animate-fade-up">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">{game.name}</h1>
                
                <div className="flex flex-wrap items-center gap-2 text-gray-600 mb-4">
                  <span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium">
                    {game.category}
                  </span>
                  <span className="text-sm">Éditeur: {game.publisher}</span>
                </div>
                
                {/* Main image */}
                <div className="rounded-xl overflow-hidden shadow-sm mb-6">
                  <img 
                    src={game.image} 
                    alt={game.name} 
                    className="w-full h-auto object-cover"
                  />
                </div>
                
                {/* Description */}
                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-gray-700">{game.description}</p>
                </div>
                
                {/* Rating and voting */}
                <div className="mt-8 border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold mb-4">Évaluations et votes</h2>
                  
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-3xl font-bold text-gray-900">4.2</div>
                        <div className="flex items-center mt-1">
                          <StarRating readOnly initialRating={4} size="sm" />
                          <span className="ml-2 text-sm text-gray-600">
                            basé sur 143 votes
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleShare}
                        className="flex items-center"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Partager
                      </Button>
                    </div>
                    
                    {game.voting_enabled ? (
                      <div>
                        <p className="text-sm font-medium mb-3">Voter pour ce jeu</p>
                        <div className="flex items-center gap-4">
                          <StarRating 
                            initialRating={userRating} 
                            size="lg"
                            onChange={handleRatingChange}
                          />
                          <Button 
                            onClick={() => !isAuthenticated && toast({
                              title: "Authentification requise",
                              description: "Vous devez être connecté pour voter",
                              variant: "destructive",
                            })}
                            disabled={isAuthenticated}
                          >
                            Soumettre
                          </Button>
                        </div>
                        {!isAuthenticated && (
                          <div className="mt-3 flex items-start text-sm text-amber-600">
                            <Info className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                            <span>
                              Vous devez être <Link to="/auth?mode=signin" className="underline font-medium">connecté</Link> pour voter.
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 text-sm">
                          Les votes ne sont pas disponibles pour ce jeu actuellement.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right section: Contests and related info */}
            <div className="lg:col-span-1 space-y-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {/* Contests */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-primary" />
                  Concours en cours
                </h2>
                
                {contests.length > 0 ? (
                  <div className="space-y-4">
                    {contests.map(contest => (
                      <div 
                        key={contest.id} 
                        className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-semibold mb-1">{contest.name}</h3>
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>
                            {new Date(contest.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - {new Date(contest.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="w-full"
                          asChild
                        >
                          <Link to={`/contests/${contest.id}`}>Voir le concours</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-gray-50 text-center">
                    <p className="text-gray-600 mb-2">Aucun concours actif pour ce jeu</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <Link to="/contests">Voir tous les concours</Link>
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Similar games */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Jeux similaires</h2>
                
                <div className="space-y-4">
                  {similarGames.map(similarGame => (
                    <div key={similarGame.id} className="block group">
                      <Link to={`/games/${similarGame.id}`} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <img 
                          src={similarGame.image} 
                          alt={similarGame.name} 
                          className="w-16 h-16 object-cover rounded-md mr-3"
                        />
                        <div>
                          <h3 className="font-medium group-hover:text-primary transition-colors">{similarGame.name}</h3>
                          <p className="text-sm text-gray-600">{similarGame.category}</p>
                          <div className="flex items-center mt-1">
                            <StarRating readOnly initialRating={4} size="sm" />
                            <span className="ml-1 text-xs text-gray-500">4.0</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Community reviews section (placeholder) */}
          <div className="mt-16 border-t border-gray-200 pt-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Avis de la communauté</h2>
              <Button asChild>
                <Link to="/auth?mode=signin">
                  Écrire un avis
                </Link>
              </Button>
            </div>
            
            {/* Reviews placeholder */}
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <p className="text-gray-600 mb-4">
                Connectez-vous pour voir les avis de la communauté et partager le vôtre.
              </p>
              <Button variant="outline" asChild>
                <Link to="/auth?mode=signin">Se connecter</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GameDetail;
