
import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = document.querySelectorAll('.hero-animate');
    elements.forEach((el) => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden"
    >
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-blue-300/10 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-8">
            <div>
              <h1 className="hero-animate text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                <span className="block">Votez pour vos</span>
                <span className="block text-primary">jeux préférés</span>
              </h1>
              <p className="hero-animate mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
                Découvrez, votez et célébrez les meilleurs jeux de société lors de concours officiels organisés par des éditeurs et des événements prestigieux.
              </p>
            </div>
            
            <div className="hero-animate flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" asChild>
                <Link to="/games" className="flex items-center justify-center space-x-2">
                  <span>Explorer les jeux</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contests">Voir les concours</Link>
              </Button>
            </div>
            
            <div className="hero-animate flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-900">100+</span>
                <span>Jeux</span>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-900">25+</span>
                <span>Concours</span>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-900">10K+</span>
                <span>Votes</span>
              </div>
            </div>
          </div>
          
          <div className="hero-animate relative">
            <div className="relative w-full aspect-[5/4] rounded-2xl overflow-hidden bg-white shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
              <img 
                src="https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2048&q=80" 
                alt="Jeux de société" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent mix-blend-overlay" />
              
              <div className="absolute bottom-6 left-6 right-6 p-5 glass-card rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Grand Prix du Jeu 2025</h3>
                    <p className="text-sm text-gray-600">Vote ouvert jusqu'au 12 juin</p>
                  </div>
                  <Button size="sm" variant="secondary" asChild>
                    <Link to="/contests/1">Voter</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-1/4 -right-10 p-4 glass-card rounded-lg animate-floating shadow-lg hidden md:block">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  🏆
                </div>
                <div>
                  <p className="text-sm font-medium">Festival du Jeu Paris</p>
                  <p className="text-xs text-gray-500">10 - 12 juin 2025</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 p-4 glass-card rounded-lg shadow-xl hidden md:block" style={{animationDelay: '0.5s'}}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1611996575749-79a3f2bc6a93?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80" 
                    alt="Jeu" 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          className="w-4 h-4 text-yellow-400 fill-yellow-400" 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs ml-1 text-gray-500">+2458 votes</span>
                  </div>
                  <p className="text-sm font-medium">Les Aventuriers du Rail</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
