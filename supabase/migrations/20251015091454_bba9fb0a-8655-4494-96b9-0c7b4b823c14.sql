-- Créer l'énumération pour les rôles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'editor', 'player');

-- Créer la table user_roles
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Activer RLS sur user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Fonction de sécurité pour vérifier si un utilisateur a un rôle spécifique
CREATE OR REPLACE FUNCTION public.has_app_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Fonction pour vérifier si un utilisateur a un des rôles spécifiés
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles app_role[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = ANY(_roles)
  )
$$;

-- Policy pour que les utilisateurs puissent voir leurs propres rôles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy pour que les super admins puissent tout voir
CREATE POLICY "Super admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_app_role(auth.uid(), 'super_admin'));

-- Policy pour que les super admins puissent gérer les rôles
CREATE POLICY "Super admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_app_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_app_role(auth.uid(), 'super_admin'));

-- Mettre à jour les RLS policies pour les games (les éditeurs peuvent créer)
DROP POLICY IF EXISTS "Organization members can create games" ON public.games;
CREATE POLICY "Editors and admins can create games"
ON public.games
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_any_role(auth.uid(), ARRAY['super_admin', 'editor']::app_role[])
  AND auth.uid() = user_id
);

DROP POLICY IF EXISTS "Organization members can update their games" ON public.games;
CREATE POLICY "Editors and admins can update games"
ON public.games
FOR UPDATE
TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'editor']::app_role[]))
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin', 'editor']::app_role[]));

DROP POLICY IF EXISTS "Organization admins can delete games" ON public.games;
CREATE POLICY "Editors and admins can delete games"
ON public.games
FOR DELETE
TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'editor']::app_role[]));

-- Mettre à jour les RLS policies pour les contests
DROP POLICY IF EXISTS "Organization members can create contests" ON public.contests;
CREATE POLICY "Editors and admins can create contests"
ON public.contests
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_any_role(auth.uid(), ARRAY['super_admin', 'editor']::app_role[])
  AND auth.uid() = user_id
);

DROP POLICY IF EXISTS "Organization members can update contests" ON public.contests;
CREATE POLICY "Editors and admins can update contests"
ON public.contests
FOR UPDATE
TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'editor']::app_role[]))
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin', 'editor']::app_role[]));

DROP POLICY IF EXISTS "Organization admins can delete contests" ON public.contests;
CREATE POLICY "Admins can delete contests"
ON public.contests
FOR DELETE
TO authenticated
USING (public.has_app_role(auth.uid(), 'super_admin'));

-- Mettre à jour les RLS policies pour les events
DROP POLICY IF EXISTS "Organization members can create events" ON public.events;
CREATE POLICY "Editors and admins can create events"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_any_role(auth.uid(), ARRAY['super_admin', 'editor']::app_role[])
  AND auth.uid() = user_id
);

DROP POLICY IF EXISTS "Organization members can update events" ON public.events;
CREATE POLICY "Editors and admins can update events"
ON public.events
FOR UPDATE
TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'editor']::app_role[]))
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin', 'editor']::app_role[]));

DROP POLICY IF EXISTS "Organization admins can delete events" ON public.events;
CREATE POLICY "Admins can delete events"
ON public.events
FOR DELETE
TO authenticated
USING (public.has_app_role(auth.uid(), 'super_admin'));

-- Mettre à jour les RLS policies pour contest_games
DROP POLICY IF EXISTS "Organization members can manage contest games" ON public.contest_games;
CREATE POLICY "Editors and admins can manage contest games"
ON public.contest_games
FOR ALL
TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'editor']::app_role[]))
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin', 'editor']::app_role[]));

-- Améliorer les policies de votes pour que les super admins puissent tout voir
CREATE POLICY "Super admins can view all votes"
ON public.votes
FOR SELECT
TO authenticated
USING (public.has_app_role(auth.uid(), 'super_admin'));