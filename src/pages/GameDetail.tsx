
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StarRating from '@/components/ui/StarRating';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Award, Calendar, Info, Share2, Loader2 } from 'lucide-react';
import { initializeAnimations } from '@/lib/animations';
import { toast } from "@/components/ui/use-toast";

interface Game {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  publisher: string;
  voting_enabled: boolean;
}

interface Contest {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

interface VoteStats {
  average_rating: number;
  total_votes: number;
  user_vote?: {
    rating: number;
    comment?: string;
  };
}

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();
  const [game, setGame] = useState<Game | null>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [similarGames, setSimilarGames] = useState<Game[]>([]);
  const [voteStats, setVoteStats] = useState<VoteStats>({ average_rating: 0, total_votes: 0 });
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    const fetchGameData = async () => {
      if (!id) return;

      // Check if ID is a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        console.error('Invalid UUID format:', id);
        toast({
          title: "Jeu introuvable",
          description: "L'identifiant du jeu n'est pas valide.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch game details
        const { data: gameData, error: gameError } = await supabase
          .from('games')
          .select('*')
          .eq('id', id)
          .single();

        if (gameError) {
          console.error('Error fetching game:', gameError);
          toast({
            title: "Jeu introuvable",
            description: "Ce jeu n'existe pas ou n'est plus disponible.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        setGame(gameData);

        // Fetch contests that include this game
        const { data: contestGames, error: contestError } = await supabase
          .from('contest_games')
          .select(`
            contests!inner(
              id,
              name,
              start_date,
              end_date
            )
          `)
          .eq('game_id', id);

        if (contestError) {
          console.error('Error fetching contests:', contestError);
        } else {
          setContests(contestGames.map((cg: any) => cg.contests));
        }

        // Fetch similar games (same category)
        const { data: similarGamesData, error: similarError } = await supabase
          .from('games')
          .select('*')
          .eq('category', gameData.category)
          .neq('id', id)
          .limit(3);

        if (similarError) {
          console.error('Error fetching similar games:', similarError);
        } else {
          setSimilarGames(similarGamesData || []);
        }

        // Fetch vote statistics
        await fetchVoteStats();

      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du jeu.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameData();
    initializeAnimations();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchVoteStats = async () => {
    if (!id) return;

    try {
      // Get all votes for this game
      const { data: votes, error: votesError } = await supabase
        .from('votes')
        .select('rating, comment, user_id')
        .eq('game_id', id);

      if (votesError) {
        console.error('Error fetching votes:', votesError);
        return;
      }

      const totalVotes = votes.length;
      const averageRating = totalVotes > 0 
        ? votes.reduce((sum, vote) => sum + vote.rating, 0) / totalVotes 
        : 0;

      // Check if user has voted
      const userVote = user ? votes.find(vote => vote.user_id === user.id) : null;
      
      if (userVote) {
        setUserRating(userVote.rating);
        setUserComment(userVote.comment || '');
      }

      setVoteStats({
        average_rating: averageRating,
        total_votes: totalVotes,
        user_vote: userVote ? { rating: userVote.rating, comment: userVote.comment || undefined } : undefined
      });

    } catch (error) {
      console.error('Error fetching vote stats:', error);
    }
  };

  const handleVoteSubmit = async () => {
    if (!user || !id || userRating === 0) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté et attribuer une note.",
        variant: "destructive",
      });
      return;
    }

    if (!contests || contests.length === 0) {
      toast({
        title: "Erreur",
        description: "Ce jeu n'est pas associé à un concours actif.",
        variant: "destructive",
      });
      return;
    }

    if (!currentOrganization?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être associé à une organisation pour voter.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsVoting(true);

      // Check if user already voted
      const { data: existingVote, error: checkError } = await supabase
        .from('votes')
        .select('id')
        .eq('game_id', id)
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      const voteData = {
        game_id: id,
        user_id: user.id,
        rating: userRating,
        comment: userComment || null,
        contest_id: contests[0].id,
        organization_id: currentOrganization.id
      };

      if (existingVote) {
        // Update existing vote
        const { error: updateError } = await supabase
          .from('votes')
          .update(voteData)
          .eq('id', existingVote.id);

        if (updateError) throw updateError;

        toast({
          title: "Vote mis à jour !",
          description: `Votre évaluation de ${game?.name} a été mise à jour.`,
        });
      } else {
        // Create new vote
        const { error: insertError } = await supabase
          .from('votes')
          .insert(voteData);

        if (insertError) throw insertError;

        toast({
          title: "Vote enregistré !",
          description: `Merci d'avoir évalué ${game?.name}.`,
        });
      }

      // Refresh vote stats
      await fetchVoteStats();

    } catch (error) {
      console.error('Error submitting vote:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
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
                        <div className="text-3xl font-bold text-gray-900">
                          {voteStats.average_rating > 0 ? voteStats.average_rating.toFixed(1) : '--'}
                        </div>
                        <div className="flex items-center mt-1">
                          <StarRating readOnly rating={Math.round(voteStats.average_rating)} size="sm" />
                          <span className="ml-2 text-sm text-gray-600">
                            basé sur {voteStats.total_votes} vote{voteStats.total_votes !== 1 ? 's' : ''}
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
                    
                    {game?.voting_enabled ? (
                      <div>
                        <p className="text-sm font-medium mb-3">
                          {voteStats.user_vote ? 'Modifier votre évaluation' : 'Évaluer ce jeu'}
                        </p>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <StarRating 
                              rating={userRating} 
                              size="lg"
                              onChange={setUserRating}
                            />
                            <Button 
                              onClick={handleVoteSubmit}
                              disabled={!user || userRating === 0 || isVoting}
                            >
                              {isVoting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                              {voteStats.user_vote ? 'Modifier' : 'Soumettre'}
                            </Button>
                          </div>
                          
                          {user && (
                            <textarea
                              value={userComment}
                              onChange={(e) => setUserComment(e.target.value)}
                              placeholder="Commentaire optionnel..."
                              className="w-full p-3 border border-gray-200 rounded-lg resize-none h-20 text-sm"
                              maxLength={500}
                            />
                          )}
                          
                          {!user && (
                            <div className="mt-3 flex items-start text-sm text-amber-600">
                              <Info className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                              <span>
                                Vous devez être <Link to="/auth?mode=signin" className="underline font-medium">connecté</Link> pour voter.
                              </span>
                            </div>
                          )}
                        </div>
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
                          <p className="text-xs text-gray-500 mt-1">{similarGame.publisher}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                  {similarGames.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      Aucun jeu similaire trouvé
                    </p>
                  )}
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
