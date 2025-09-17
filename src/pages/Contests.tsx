
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/ui/SearchBar';
import ContestCard from '@/components/contests/ContestCard';
import { FilterX, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { initializeAnimations } from '@/lib/animations';
import { useOrganizationContests } from '@/hooks/useOrganizationData';
import OrganizationSwitcher from '@/components/organization/OrganizationSwitcher';
import { useAuth } from '@/context/AuthContext';

const Contests = () => {
  const { user } = useAuth();
  const { data: contests, isLoading, error } = useOrganizationContests();
  const [filteredContests, setFilteredContests] = useState(contests || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Initialize animations
    initializeAnimations();
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (contests) {
      filterContests();
    }
  }, [searchQuery, isActive, contests]);

  const filterContests = () => {
    if (!contests) return;
    
    let result = [...contests];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((contest) =>
        contest.name.toLowerCase().includes(query)
      );
    }

    // Filter by active status
    if (isActive) {
      const now = new Date();
      result = result.filter(
        (contest) =>
          now >= new Date(contest.start_date) && now <= new Date(contest.end_date)
      );
    }

    setFilteredContests(result);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleActiveFilter = () => {
    setIsActive(!isActive);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setIsActive(false);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur lors du chargement des concours</h2>
            <p className="text-gray-600 mb-6">Impossible de récupérer les données des concours.</p>
            <Button asChild><Link to="/">Retour à l'accueil</Link></Button>
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
          {/* Header with Organization Switcher */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 animate-fade-up">
                Concours de jeux
              </h1>
              <p className="mt-2 text-lg text-gray-600 max-w-3xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
                Découvrez les concours en cours et à venir, et votez pour vos jeux préférés.
              </p>
            </div>
            {user && (
              <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <OrganizationSwitcher />
              </div>
            )}
          </div>
          
          {/* Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <SearchBar 
              placeholder="Rechercher un concours..." 
              onSearch={handleSearch}
              className="md:w-72"
            />
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleActiveFilter}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                En cours uniquement
              </button>
              
              {(searchQuery || isActive) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center text-gray-600"
                >
                  <FilterX className="w-4 h-4 mr-1" />
                  Effacer les filtres
                </Button>
              )}
            </div>
          </div>
          
          {/* Results */}
          {isLoading ? (
            // Loading skeleton
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-gray-600">Chargement des concours...</p>
            </div>
          ) : (
            filteredContests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredContests.map((contest, index) => (
                  <div
                    key={contest.id}
                    className="staggered-item"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ContestCard contest={contest} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl animate-fade-in">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold mb-2">Aucun concours trouvé</h3>
                <p className="text-gray-600 mb-6">
                  Aucun concours ne correspond à vos critères de recherche.
                </p>
                <Button onClick={clearFilters}>Réinitialiser les filtres</Button>
              </div>
            )
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contests;
