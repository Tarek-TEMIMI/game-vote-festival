-- Assigner les rôles aux utilisateurs créés
INSERT INTO public.user_roles (user_id, role) VALUES
  -- Super Admin
  ('d4344f11-bb20-4e19-8e42-22d2e0252e43', 'super_admin'),
  -- Editor
  ('bdd851a3-7c3f-4e65-8601-1555f701b4d9', 'editor'),
  -- Player
  ('9c8e9dd1-c6c0-4642-aba9-224158b2d53a', 'player')
ON CONFLICT (user_id, role) DO NOTHING;