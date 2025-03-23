
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GameCard from '@/components/games/GameCard';
import SearchBar from '@/components/ui/SearchBar';
import CategoryFilter from '@/components/ui/CategoryFilter';
import { games, categories, publishers } from '@/lib/data';
import { initializeAnimations } from '@/lib/animations';

const Games = () => {
  const [filteredGames, setFilteredGames] = useState(games);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    // Initialize animations
    initializeAnimations();
    
    // Scroll to top on page load
    window.scrollTo(0, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    filterGames();
  }, [searchQuery, selectedCategories, selectedPublishers]);

  const filterGames = () => {
    let result = [...games];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (game) =>
          game.name.toLowerCase().includes(query) ||
          game.description.toLowerCase().includes(query) ||
          game.publisher.toLowerCase().includes(query)
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter((game) => selectedCategories.includes(game.category));
    }

    // Filter by publishers
    if (selectedPublishers.length > 0) {
      result = result.filter((game) => selectedPublishers.includes(game.publisher));
    }

    setFilteredGames(result);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (selected: string[]) => {
    setSelectedCategories(selected);
  };

  const handlePublisherFilter = (selected: string[]) => {
    setSelectedPublishers(selected);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 animate-fade-up">
              Explorez les jeux
            </h1>
            <p className="mt-2 text-lg text-gray-600 max-w-3xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Découvrez notre collection complète de jeux de société et votez pour vos favoris lors des concours.
            </p>
          </div>
          
          {/* Filters and Search */}
          <div className="mb-10 space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <SearchBar 
              placeholder="Rechercher un jeu..." 
              onSearch={handleSearch}
              className="md:col-span-1"
            />
            <CategoryFilter 
              categories={categories} 
              onFilterChange={handleCategoryFilter}
              className="md:col-span-1"
            />
            <CategoryFilter 
              categories={publishers} 
              onFilterChange={handlePublisherFilter}
              className="md:col-span-1"
            />
          </div>
          
          {/* Results */}
          {isLoading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-5">
                    <div className="h-6 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded" />
                    </div>
                    <div className="h-10 bg-gray-200 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredGames.map((game, index) => (
                  <div
                    key={game.id}
                    className="staggered-item"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <GameCard game={game} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 animate-fade-in">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Aucun jeu trouvé</h3>
                <p className="text-gray-600">
                  Essayez de modifier vos filtres ou votre recherche pour trouver des jeux.
                </p>
              </div>
            )
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Games;
