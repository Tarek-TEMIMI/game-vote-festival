
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
    image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Un jeu de stratégie où vous devez construire des lignes de chemin de fer reliant différentes villes à travers l'Europe. Collectez des cartes, revendiquez des routes et réalisez des objectifs secrets.",
    publisher: "Days of Wonder",
    voting_enabled: true
  },
  {
    id: 2,
    name: "Catan",
    category: "Stratégie",
    image: "https://images.unsplash.com/photo-1611371805429-8b5c1f0536fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Le jeu de société classique où vous construisez des colonies, des villes et des routes sur l'île de Catan. Échangez des ressources et développez votre colonie pour gagner.",
    publisher: "Kosmos",
    voting_enabled: true
  },
  {
    id: 3,
    name: "Dixit",
    category: "Party Game",
    image: "https://images.unsplash.com/photo-1529488127598-5b1512330375?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Un jeu d'imagination et d'intuition où vous devez créer des indices pour que les autres joueurs devinent votre carte illustrée, mais sans être trop évident.",
    publisher: "Libellud",
    voting_enabled: true
  },
  {
    id: 4,
    name: "Pandemic",
    category: "Coopératif",
    image: "https://images.unsplash.com/photo-1576086135878-de63f102db08?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Un jeu coopératif où les joueurs travaillent ensemble pour arrêter la propagation de quatre maladies mortelles qui menacent le monde.",
    publisher: "Z-Man Games",
    voting_enabled: true
  },
  {
    id: 5,
    name: "7 Wonders",
    category: "Stratégie",
    image: "https://images.unsplash.com/photo-1517519014922-8fc06b814a0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Un jeu de développement de civilisation où vous construisez une merveille du monde tout en développant des ressources, des bâtiments commerciaux et militaires.",
    publisher: "Repos Production",
    voting_enabled: true
  },
  {
    id: 6,
    name: "Azul",
    category: "Stratégie Abstraite",
    image: "https://images.unsplash.com/photo-1581710279297-578c9e7e35c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
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
    logo: "https://images.unsplash.com/photo-1561089489-f13d5e730d72?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1529480653439-b16be867b796?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    start_date: "2025-06-10",
    end_date: "2025-06-12",
    address: "Paris Expo, Porte de Versailles"
  },
  {
    id: 2,
    name: "Salon du Jeu Lyon",
    logo: "https://images.unsplash.com/photo-1606503796858-b144dba3d141?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1611996575749-79a3f2bc6a93?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606503796907-1nhbf3731d52?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    start_date: "2025-07-15",
    end_date: "2025-07-18",
    address: "Eurexpo Lyon, Boulevard de l'Europe, Chassieu"
  },
  {
    id: 3,
    name: "Game Week Marseille",
    logo: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523875194681-bedd468c58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
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
