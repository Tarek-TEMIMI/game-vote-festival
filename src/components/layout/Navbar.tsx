
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-white/80 backdrop-blur-lg shadow-sm'
          : 'py-5 bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-semibold transition-opacity hover:opacity-80"
            >
              <span className="bg-primary text-primary-foreground py-1 px-2 rounded-lg">MJ</span>
              <span>MonJeu.vote</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/games"
              className={`transition-all hover:text-primary ${
                location.pathname === '/games' ? 'text-primary font-medium' : 'text-foreground'
              }`}
            >
              Jeux
            </Link>
            <Link
              to="/contests"
              className={`transition-all hover:text-primary ${
                location.pathname === '/contests' ? 'text-primary font-medium' : 'text-foreground'
              }`}
            >
              Concours
            </Link>
            <Link
              to="/events"
              className={`transition-all hover:text-primary ${
                location.pathname === '/events' ? 'text-primary font-medium' : 'text-foreground'
              }`}
            >
              Événements
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/auth?mode=signin">Connexion</Link>
            </Button>
            <Button asChild>
              <Link to="/auth?mode=signup">Inscription</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/games"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/games'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-gray-100'
              }`}
            >
              Jeux
            </Link>
            <Link
              to="/contests"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/contests'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-gray-100'
              }`}
            >
              Concours
            </Link>
            <Link
              to="/events"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/events'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-gray-100'
              }`}
            >
              Événements
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center justify-between px-5">
              <div className="flex flex-col space-y-3">
                <Link
                  to="/auth?mode=signin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-gray-100"
                >
                  Connexion
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Inscription
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
