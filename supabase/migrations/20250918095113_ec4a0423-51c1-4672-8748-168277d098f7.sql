-- Fix security issue: Restrict votes table visibility
-- Remove the overly permissive "Users can view all votes" policy
DROP POLICY IF EXISTS "Users can view all votes" ON public.votes;

-- Create more restrictive policies that maintain functionality while protecting user privacy

-- 1. Users can view their own votes (for UserVotesList component)
CREATE POLICY "Users can view their own votes" 
ON public.votes 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Contest owners can view votes for their contests (for ContestResults component)
CREATE POLICY "Contest owners can view votes for their contests" 
ON public.votes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.contests 
    WHERE contests.id = votes.contest_id 
    AND contests.user_id = auth.uid()
  )
);

-- 3. Game owners can view votes for their games (for GameManagement component)
CREATE POLICY "Game owners can view votes for their games" 
ON public.votes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.games 
    WHERE games.id = votes.game_id 
    AND games.user_id = auth.uid()
  )
);

-- Note: These policies will work with the existing multi-tenant setup
-- since contests and games already have organization_id filtering through their own RLS policies