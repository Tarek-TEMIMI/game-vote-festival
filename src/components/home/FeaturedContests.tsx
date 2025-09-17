
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrganizationContests } from '@/hooks/useOrganizationData';

const FeaturedContests = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: contests } = useOrganizationContests();

  // Animation effect on scroll
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

    const elements = document.querySelectorAll('.contest-animate');
    elements.forEach((el) => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const featuredContests = contests?.slice(0, 3) || [];

  // Ne pas afficher la section si aucun concours
  if (!contests || contests.length === 0) {
    return null;
  }

  return (
    <section className="py-20 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10" />
      </div>
      
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div className="contest-animate mb-6 md:mb-0">
            <h2 className="text-3xl font-bold tracking-tight">Concours en vedette</h2>
            <p className="mt-2 text-lg text-gray-600 max-w-2xl">
              Découvrez les concours actuels et faites entendre votre voix en votant pour vos jeux préférés.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="contest-animate"
            asChild
          >
            <Link to="/contests" className="flex items-center">
              <span>Voir tous les concours</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredContests.map((contest, index) => {
            // Données simplifiées pour la démo - dans un vrai cas, ces données viendraient de la base
            const gamesCount = Math.floor(Math.random() * 15) + 5; // Simulation du nombre de jeux
            
            return (
              <div 
                key={contest.id}
                className="contest-animate bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-elevated transition-all duration-medium border border-gray-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt={contest.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white">{contest.name}</h3>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center mb-4 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(contest.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - {new Date(contest.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      {gamesCount} jeux en compétition
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min((gamesCount / 20) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    asChild
                  >
                    <Link to={`/contests/${contest.id}`}>
                      Voter maintenant
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedContests;
