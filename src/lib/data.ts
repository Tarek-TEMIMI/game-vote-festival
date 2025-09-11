
// Import local images
import aventuriersImage from '@/assets/games/aventuriers-du-rail.jpg';
import catanImage from '@/assets/games/catan.jpg';
import dixitImage from '@/assets/games/dixit.jpg';
import pandemicImage from '@/assets/games/pandemic.jpg';
import sevenWondersImage from '@/assets/games/7-wonders.jpg';
import azulImage from '@/assets/games/azul.jpg';

import festivalParisLogo from '@/assets/events/festival-paris-logo.jpg';
import festivalParis1 from '@/assets/events/festival-paris-1.jpg';
import festivalParis2 from '@/assets/events/festival-paris-2.jpg';
import salonLyonLogo from '@/assets/events/salon-lyon-logo.jpg';
import salonLyon1 from '@/assets/events/salon-lyon-1.jpg';
import salonLyon2 from '@/assets/events/salon-lyon-2.jpg';
import gameWeekMarseilleLogo from '@/assets/events/game-week-marseille-logo.jpg';
import gameWeekMarseille1 from '@/assets/events/game-week-marseille-1.jpg';
import gameWeekMarseille2 from '@/assets/events/game-week-marseille-2.jpg';

export interface Game {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
  publisher: string;
  voting_enabled: boolean;
}

export interface Contest {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  event_id: number;
  associated_games: number[];
  voting_enabled: boolean;
}

export interface Event {
  id: number;
  name: string;
  logo: string;
  images: string[];
  start_date: string;
  end_date: string;
  address: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'player' | 'publisher' | 'admin';
  votes: number[];
}

// Mock game data
export const games: Game[] = [
  {
    id: 1,
    name: "Les Aventuriers du Rail",
    category: "Stratégie",
    image: aventuriersImage,
    description: "Un jeu de stratégie où vous devez construire des lignes de chemin de fer reliant différentes villes à travers l'Europe. Collectez des cartes, revendiquez des routes et réalisez des objectifs secrets.",
    publisher: "Days of Wonder",
    voting_enabled: true
  },
  {
    id: 2,
    name: "Catan",
    category: "Stratégie",
    image: catanImage,
    description: "Le jeu de société classique où vous construisez des colonies, des villes et des routes sur l'île de Catan. Échangez des ressources et développez votre colonie pour gagner.",
    publisher: "Kosmos",
    voting_enabled: true
  },
  {
    id: 3,
    name: "Dixit",
    category: "Party Game",
    image: dixitImage,
    description: "Un jeu d'imagination et d'intuition où vous devez créer des indices pour que les autres joueurs devinent votre carte illustrée, mais sans être trop évident.",
    publisher: "Libellud",
    voting_enabled: true
  },
  {
    id: 4,
    name: "Pandemic",
    category: "Coopératif",
    image: pandemicImage,
    description: "Un jeu coopératif où les joueurs travaillent ensemble pour arrêter la propagation de quatre maladies mortelles qui menacent le monde.",
    publisher: "Z-Man Games",
    voting_enabled: true
  },
  {
    id: 5,
    name: "7 Wonders",
    category: "Stratégie",
    image: sevenWondersImage,
    description: "Un jeu de développement de civilisation où vous construisez une merveille du monde tout en développant des ressources, des bâtiments commerciaux et militaires.",
    publisher: "Repos Production",
    voting_enabled: true
  },
  {
    id: 6,
    name: "Azul",
    category: "Stratégie Abstraite",
    image: azulImage,
    description: "Un jeu où les joueurs sont des artisans chargés de décorer les murs du palais royal de Evora avec des carreaux de céramique colorés.",
    publisher: "Plan B Games",
    voting_enabled: true
  }
];

// Mock contest data
export const contests: Contest[] = [
  {
    id: 1,
    name: "Grand Prix du Jeu 2025",
    start_date: "2025-06-10",
    end_date: "2025-06-12",
    event_id: 1,
    associated_games: [1, 2, 3],
    voting_enabled: true
  },
  {
    id: 2,
    name: "Festival International des Jeux",
    start_date: "2025-07-15",
    end_date: "2025-07-18",
    event_id: 2,
    associated_games: [3, 4, 5],
    voting_enabled: true
  },
  {
    id: 3,
    name: "Concours des Créateurs",
    start_date: "2025-08-01",
    end_date: "2025-08-05",
    event_id: 3,
    associated_games: [1, 4, 6],
    voting_enabled: true
  }
];

// Mock event data
export const events: Event[] = [
  {
    id: 1,
    name: "Festival du Jeu Paris",
    logo: festivalParisLogo,
    images: [
      festivalParis1,
      festivalParis2
    ],
    start_date: "2025-06-10",
    end_date: "2025-06-12",
    address: "Paris Expo, Porte de Versailles"
  },
  {
    id: 2,
    name: "Salon du Jeu Lyon",
    logo: salonLyonLogo,
    images: [
      salonLyon1,
      salonLyon2
    ],
    start_date: "2025-07-15",
    end_date: "2025-07-18",
    address: "Eurexpo Lyon, Boulevard de l'Europe, Chassieu"
  },
  {
    id: 3,
    name: "Game Week Marseille",
    logo: gameWeekMarseilleLogo,
    images: [
      gameWeekMarseille1,
      gameWeekMarseille2
    ],
    start_date: "2025-08-01",
    end_date: "2025-08-05",
    address: "Parc Chanot, Rond-Point du Prado, Marseille"
  }
];

// Get a game by id
export const getGameById = (id: number): Game | undefined => {
  return games.find(game => game.id === id);
};

// Get a contest by id
export const getContestById = (id: number): Contest | undefined => {
  return contests.find(contest => contest.id === id);
};

// Get an event by id
export const getEventById = (id: number): Event | undefined => {
  return events.find(event => event.id === id);
};

// Get games by contest id
export const getGamesByContest = (contestId: number): Game[] => {
  const contest = getContestById(contestId);
  if (!contest) return [];
  return games.filter(game => contest.associated_games.includes(game.id));
};

// Get contests by game id
export const getContestsByGame = (gameId: number): Contest[] => {
  return contests.filter(contest => contest.associated_games.includes(gameId));
};

// Get contests by event id
export const getContestsByEvent = (eventId: number): Contest[] => {
  return contests.filter(contest => contest.event_id === eventId);
};

// Categories list
export const categories = [
  "Stratégie",
  "Party Game",
  "Coopératif",
  "Stratégie Abstraite",
  "Jeu de Rôle",
  "Jeu de Cartes",
  "Jeu Familial"
];

// Publishers list
export const publishers = [
  "Days of Wonder",
  "Kosmos",
  "Libellud",
  "Z-Man Games",
  "Repos Production",
  "Plan B Games",
  "Asmodee"
];
