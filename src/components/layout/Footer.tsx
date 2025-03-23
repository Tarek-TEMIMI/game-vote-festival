
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 text-xl font-semibold">
              <span className="bg-primary text-primary-foreground py-1 px-2 rounded-lg">MJ</span>
              <span>MonJeu.vote</span>
            </div>
            <p className="mt-4 text-sm text-gray-600 max-w-xs">
              La plateforme qui permet aux joueurs de voter pour leurs jeux préférés lors des concours officiels.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Plateforme</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/games" className="text-gray-600 hover:text-primary">
                  Tous les jeux
                </Link>
              </li>
              <li>
                <Link to="/contests" className="text-gray-600 hover:text-primary">
                  Concours
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-600 hover:text-primary">
                  Événements
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Compte</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/auth?mode=signin" className="text-gray-600 hover:text-primary">
                  Connexion
                </Link>
              </li>
              <li>
                <Link to="/auth?mode=signup" className="text-gray-600 hover:text-primary">
                  Inscription
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-primary">
                  Mon profil
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Légal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} MonJeu.vote. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
