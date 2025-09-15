-- Créer des jeux d'exemple
INSERT INTO games (id, name, category, publisher, description, image, user_id) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Catan', 'Stratégie', 'Kosmos', 'Jeu de placement et de commerce sur une île mystérieuse', '/src/assets/games/catan.jpg', 'fcd2247f-3b3a-4f87-b899-21c131d891d3'),
('550e8400-e29b-41d4-a716-446655440001', 'Azul', 'Familial', 'Plan B Games', 'Jeu de pose de carrelage aux règles simples mais aux choix tactiques', '/src/assets/games/azul.jpg', 'fcd2247f-3b3a-4f87-b899-21c131d891d3'),
('550e8400-e29b-41d4-a716-446655440002', 'Pandemic', 'Coopératif', 'Z-Man Games', 'Sauvez le monde des épidémies dans ce jeu coopératif', '/src/assets/games/pandemic.jpg', 'fcd2247f-3b3a-4f87-b899-21c131d891d3'),
('550e8400-e29b-41d4-a716-446655440003', '7 Wonders', 'Civilisation', 'Repos Production', 'Développez votre civilisation à travers les âges', '/src/assets/games/7-wonders.jpg', 'fcd2247f-3b3a-4f87-b899-21c131d891d3'),
('550e8400-e29b-41d4-a716-446655440004', 'Aventuriers du Rail', 'Famille', 'Days of Wonder', 'Construisez des lignes de train à travers l''Amérique', '/src/assets/games/aventuriers-du-rail.jpg', 'fcd2247f-3b3a-4f87-b899-21c131d891d3'),
('550e8400-e29b-41d4-a716-446655440005', 'Dixit', 'Créatif', 'Libellud', 'Jeu d''imagination et de créativité avec de magnifiques illustrations', '/src/assets/games/dixit.jpg', 'fcd2247f-3b3a-4f87-b899-21c131d891d3');

-- Créer des événements d'exemple
INSERT INTO events (id, name, start_date, end_date, address, logo, images, user_id) VALUES 
('660e8400-e29b-41d4-a716-446655440000', 'Festival des Jeux Paris 2024', '2024-10-15 09:00:00+02', '2024-10-17 18:00:00+02', 'Porte de Versailles, 1 Place de la Porte de Versailles, 75015 Paris', '/src/assets/events/festival-paris-logo.jpg', ARRAY['/src/assets/events/festival-paris-1.jpg', '/src/assets/events/festival-paris-2.jpg'], 'fcd2247f-3b3a-4f87-b899-21c131d891d3'),
('660e8400-e29b-41d4-a716-446655440001', 'Game Week Marseille', '2024-11-20 10:00:00+01', '2024-11-24 20:00:00+01', 'Parc Chanot, Rond-Point du Prado, 13008 Marseille', '/src/assets/events/game-week-marseille-logo.jpg', ARRAY['/src/assets/events/game-week-marseille-1.jpg', '/src/assets/events/game-week-marseille-2.jpg'], 'fcd2247f-3b3a-4f87-b899-21c131d891d3'),
('660e8400-e29b-41d4-a716-446655440002', 'Salon du Jeu Lyon', '2024-12-05 09:30:00+01', '2024-12-08 19:00:00+01', 'Eurexpo Lyon, Boulevard de l''Europe, 69680 Chassieu', '/src/assets/events/salon-lyon-logo.jpg', ARRAY['/src/assets/events/salon-lyon-1.jpg', '/src/assets/events/salon-lyon-2.jpg'], 'fcd2247f-3b3a-4f87-b899-21c131d891d3');

-- Créer des concours d'exemple
INSERT INTO contests (id, name, start_date, end_date, user_id, event_id, voting_enabled) VALUES 
('770e8400-e29b-41d4-a716-446655440000', 'Meilleur Jeu de Stratégie 2024', '2024-10-01 00:00:00+02', '2024-10-31 23:59:59+01', 'fcd2247f-3b3a-4f87-b899-21c131d891d3', '660e8400-e29b-41d4-a716-446655440000', true),
('770e8400-e29b-41d4-a716-446655440001', 'Prix du Public Festival Paris', '2024-10-15 09:00:00+02', '2024-10-17 18:00:00+02', 'fcd2247f-3b3a-4f87-b899-21c131d891d3', '660e8400-e29b-41d4-a716-446655440000', true),
('770e8400-e29b-41d4-a716-446655440002', 'Concours Jeu Familial Marseille', '2024-11-20 10:00:00+01', '2024-11-24 20:00:00+01', 'fcd2247f-3b3a-4f87-b899-21c131d891d3', '660e8400-e29b-41d4-a716-446655440001', true),
('770e8400-e29b-41d4-a716-446655440003', 'Coup de Cœur Lyon 2024', '2024-12-05 09:30:00+01', '2024-12-08 19:00:00+01', 'fcd2247f-3b3a-4f87-b899-21c131d891d3', '660e8400-e29b-41d4-a716-446655440002', true);

-- Associer des jeux aux concours
INSERT INTO contest_games (contest_id, game_id) VALUES 
('770e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'), -- Catan dans concours stratégie
('770e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003'), -- 7 Wonders dans concours stratégie
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'), -- Azul dans prix du public
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005'), -- Dixit dans prix du public
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004'), -- Aventuriers du Rail dans familial
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001'), -- Azul dans familial
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002'), -- Pandemic dans coup de cœur
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005'); -- Dixit dans coup de cœur

-- Créer quelques votes d'exemple
INSERT INTO votes (user_id, contest_id, game_id, rating, comment) VALUES 
('fcd2247f-3b3a-4f87-b899-21c131d891d3', '770e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 5, 'Excellent jeu de stratégie, très équilibré!'),
('fcd2247f-3b3a-4f87-b899-21c131d891d3', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 4, 'Jeu magnifique avec des illustrations sublimes');