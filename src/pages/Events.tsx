import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/ui/SearchBar';
import { FilterX, Loader2, Calendar, MapPin, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { initializeAnimations } from '@/lib/animations';
import { supabase } from '@/integrations/supabase/client';

interface Event {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  address: string;
  logo: string;
  images: string[];
  contests?: Contest[];
}

interface Contest {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  voting_enabled: boolean;
}

const fetchEvents = async (): Promise<Event[]> => {
  // Fetch events with their associated contests
  const { data: eventsData, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: false });
  
  if (eventsError) {
    console.error('Error fetching events:', eventsError);
    throw eventsError;
  }

  // For each event, fetch its contests
  const eventsWithContests = await Promise.all(
    eventsData.map(async (event) => {
      const { data: contestsData, error: contestsError } = await supabase
        .from('contests')
        .select('id, name, start_date, end_date, voting_enabled')
        .eq('event_id', event.id)
        .order('start_date', { ascending: true });

      if (contestsError) {
        console.error('Error fetching contests for event:', contestsError);
      }

      return {
        ...event,
        contests: contestsData || []
      };
    })
  );
  
  return eventsWithContests;
};

const Events = () => {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpcoming, setShowUpcoming] = useState(false);

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  useEffect(() => {
    // Initialize animations
    initializeAnimations();
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (events) {
      filterEvents();
    }
  }, [searchQuery, showUpcoming, events]);

  const filterEvents = () => {
    if (!events) return;
    
    let result = [...events];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((event) =>
        event.name.toLowerCase().includes(query) ||
        event.address.toLowerCase().includes(query)
      );
    }

    // Filter by upcoming status
    if (showUpcoming) {
      const now = new Date();
      result = result.filter(
        (event) => new Date(event.start_date) >= now
      );
    }

    setFilteredEvents(result);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleUpcomingFilter = () => {
    setShowUpcoming(!showUpcoming);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setShowUpcoming(false);
  };

  const getEventStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return { status: 'upcoming', label: 'À venir', color: 'bg-blue-100 text-blue-800' };
    if (now >= start && now <= end) return { status: 'active', label: 'En cours', color: 'bg-green-100 text-green-800' };
    return { status: 'past', label: 'Terminé', color: 'bg-gray-100 text-gray-800' };
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur lors du chargement des événements</h2>
            <p className="text-gray-600 mb-6">Impossible de récupérer les données des événements.</p>
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 animate-fade-up">
              Événements de jeux
            </h1>
            <p className="mt-2 text-lg text-gray-600 max-w-3xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Découvrez les festivals, salons et événements dédiés aux jeux de société.
            </p>
          </div>
          
          {/* Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <SearchBar 
              placeholder="Rechercher un événement..." 
              onSearch={handleSearch}
              className="md:w-72"
            />
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleUpcomingFilter}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  showUpcoming
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                À venir uniquement
              </button>
              
              {(searchQuery || showUpcoming) && (
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
              <p className="text-gray-600">Chargement des événements...</p>
            </div>
          ) : (
            filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {filteredEvents.map((event, index) => {
                  const eventStatus = getEventStatus(event.start_date, event.end_date);
                  
                  return (
                    <div
                      key={event.id}
                      className="staggered-item"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="relative">
                          <img 
                            src={event.logo} 
                            alt={`Logo ${event.name}`}
                            className="w-full h-48 object-cover"
                          />
                          <Badge 
                            className={`absolute top-4 right-4 ${eventStatus.color}`}
                          >
                            {eventStatus.label}
                          </Badge>
                        </div>
                        
                        <CardHeader>
                          <CardTitle className="text-xl">{event.name}</CardTitle>
                          
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              Du {new Date(event.start_date).toLocaleDateString('fr-FR')} au {new Date(event.end_date).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {event.address}
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          {event.contests && event.contests.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center mb-2">
                                <Trophy className="w-4 h-4 mr-2 text-yellow-600" />
                                <span className="font-medium text-sm">Concours associés ({event.contests.length})</span>
                              </div>
                              <div className="space-y-1">
                                {event.contests.slice(0, 3).map((contest) => (
                                  <div key={contest.id} className="text-sm text-gray-600 pl-6">
                                    • {contest.name}
                                  </div>
                                ))}
                                {event.contests.length > 3 && (
                                  <div className="text-sm text-gray-500 pl-6">
                                    ... et {event.contests.length - 3} autres
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm" className="flex-1">
                              Voir les détails
                            </Button>
                            {event.contests && event.contests.length > 0 && (
                              <Button asChild size="sm" className="flex-1">
                                <Link to="/contests">Voir les concours</Link>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl animate-fade-in">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold mb-2">Aucun événement trouvé</h3>
                <p className="text-gray-600 mb-6">
                  Aucun événement ne correspond à vos critères de recherche.
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

export default Events;