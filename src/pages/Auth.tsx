
import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, User, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "@/components/ui/use-toast";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { initializeAnimations } from '@/lib/animations';
import { useAuth } from '@/context/AuthContext';

type AuthMode = 'signin' | 'signup';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    if (user) {
      navigate('/dashboard');
    }

    // Get mode from URL query params
    const queryParams = new URLSearchParams(location.search);
    const modeParam = queryParams.get('mode');
    if (modeParam === 'signin' || modeParam === 'signup') {
      setMode(modeParam);
    }
    
    // Initialize animations
    initializeAnimations();
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [location, user, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont obligatoires",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (mode === 'signup') {
      if (!name) {
        toast({
          title: "Erreur",
          description: "Le nom est obligatoire",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      if (password !== confirmPassword) {
        toast({
          title: "Erreur",
          description: "Les mots de passe ne correspondent pas",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        navigate('/dashboard');
      } else {
        await signUp(email, password, name);
        // After signup, let's redirect to signin
        setMode('signin');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    // Update URL without reloading the page
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('mode', mode === 'signin' ? 'signup' : 'signin');
    window.history.pushState({}, '', newUrl);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Left side: Image and text */}
          <div className="w-full lg:w-1/2 max-w-md animate-fade-up">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="pl-0 hover:bg-transparent mb-6"
            >
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
            
            <h1 className="text-3xl font-bold tracking-tight mb-4">
              {mode === 'signin' ? 'Bienvenue à nouveau !' : 'Créer un compte'}
            </h1>
            <p className="text-gray-600 mb-8">
              {mode === 'signin' 
                ? 'Connectez-vous pour voter pour vos jeux préférés et participer aux concours.'
                : 'Rejoignez notre communauté pour découvrir, voter et partager votre passion pour les jeux.'}
            </p>
            
            <div className="hidden lg:block">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Game contest" 
                  className="rounded-xl object-cover h-96"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent rounded-xl mix-blend-overlay" />
                
                <div className="absolute bottom-6 left-6 right-6 p-5 glass-card rounded-xl">
                  <p className="text-gray-800 font-medium">
                    {mode === 'signin' 
                      ? "Connectez-vous pour voter pour vos jeux préférés et avoir une chance de gagner des prix exclusifs."
                      : "Inscrivez-vous dès maintenant et commencez à voter pour vos jeux préférés lors des concours officiels."}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side: Auth form */}
          <div className="w-full lg:w-1/2 max-w-md animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        placeholder="Votre nom complet"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    {mode === 'signin' && (
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        Mot de passe oublié ?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      placeholder={mode === 'signin' ? "Votre mot de passe" : "Choisir un mot de passe"}
                    />
                    <div 
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" 
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </div>
                  </div>
                </div>
                
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10"
                        placeholder="Répéter le mot de passe"
                      />
                    </div>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {mode === 'signin' ? 'Connexion en cours...' : 'Inscription en cours...'}
                    </span>
                  ) : (
                    mode === 'signin' ? 'Se connecter' : "S'inscrire"
                  )}
                </Button>
                
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    {mode === 'signin' ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="ml-1 text-primary hover:underline focus:outline-none"
                    >
                      {mode === 'signin' ? "Créer un compte" : "Se connecter"}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
