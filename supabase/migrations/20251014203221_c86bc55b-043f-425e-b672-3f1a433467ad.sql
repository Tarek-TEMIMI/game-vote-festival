-- Helper functions to avoid RLS recursion
create or replace function public.is_org_member(_org_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = _org_id and user_id = _user_id
  );
$$;

create or replace function public.has_org_role(_org_id uuid, _user_id uuid, _roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = _org_id and user_id = _user_id and role = any(_roles)
  );
$$;

-- Ensure RLS is enabled
alter table public.organization_members enable row level security;

-- Replace self-referential policies on organization_members
drop policy if exists "Members can view organization members" on public.organization_members;
drop policy if exists "Owners and admins can add members" on public.organization_members;
drop policy if exists "Owners and admins can update member roles" on public.organization_members;
drop policy if exists "Owners and admins can remove members" on public.organization_members;

create policy "Members can view organization members"
on public.organization_members
for select
using (public.is_org_member(organization_id, auth.uid()));

create policy "Owners and admins can add members"
on public.organization_members
for insert
with check (public.has_org_role(organization_id, auth.uid(), array['owner','admin']));

create policy "Owners and admins can update member roles"
on public.organization_members
for update
using (public.has_org_role(organization_id, auth.uid(), array['owner','admin']))
with check (public.has_org_role(organization_id, auth.uid(), array['owner','admin']));

create policy "Owners and admins can remove members"
on public.organization_members
for delete
using (public.has_org_role(organization_id, auth.uid(), array['owner','admin']));

-- Update other tables to use helper functions instead of subselects
-- contests
alter table public.contests enable row level security;
drop policy if exists "Organization members can create contests" on public.contests;
drop policy if exists "Organization members can update contests" on public.contests;
drop policy if exists "Organization admins can delete contests" on public.contests;

create policy "Organization members can create contests"
on public.contests
for insert
with check (
  auth.uid() = user_id
  and public.has_org_role(organization_id, auth.uid(), array['owner','admin','editor'])
);

create policy "Organization members can update contests"
on public.contests
for update
using (public.has_org_role(organization_id, auth.uid(), array['owner','admin','editor']))
with check (public.has_org_role(organization_id, auth.uid(), array['owner','admin','editor']));

create policy "Organization admins can delete contests"
on public.contests
for delete
using (public.has_org_role(organization_id, auth.uid(), array['owner','admin']));

-- events
alter table public.events enable row level security;
drop policy if exists "Organization members can create events" on public.events;
drop policy if exists "Organization members can update events" on public.events;
drop policy if exists "Organization admins can delete events" on public.events;

create policy "Organization members can create events"
on public.events
for insert
with check (
  auth.uid() = user_id
  and public.has_org_role(organization_id, auth.uid(), array['owner','admin','editor'])
);

create policy "Organization members can update events"
on public.events
for update
using (public.has_org_role(organization_id, auth.uid(), array['owner','admin','editor']))
with check (public.has_org_role(organization_id, auth.uid(), array['owner','admin','editor']));

create policy "Organization admins can delete events"
on public.events
for delete
using (public.has_org_role(organization_id, auth.uid(), array['owner','admin']));

-- games
alter table public.games enable row level security;
drop policy if exists "Organization members can create games" on public.games;
drop policy if exists "Organization members can update their games" on public.games;
drop policy if exists "Organization admins can delete games" on public.games;

create policy "Organization members can create games"
on public.games
for insert
with check (
  auth.uid() = user_id
  and public.has_org_role(organization_id, auth.uid(), array['owner','admin','editor'])
);

create policy "Organization members can update their games"
on public.games
for update
using (public.has_org_role(organization_id, auth.uid(), array['owner','admin','editor']))
with check (public.has_org_role(organization_id, auth.uid(), array['owner','admin','editor']));

create policy "Organization admins can delete games"
on public.games
for delete
using (public.has_org_role(organization_id, auth.uid(), array['owner','admin']));

-- contest_games
alter table public.contest_games enable row level security;
drop policy if exists "Organization members can manage contest games" on public.contest_games;
create policy "Organization members can manage contest games"
on public.contest_games
for all
using (public.has_org_role(organization_id, auth.uid(), array['owner','admin','editor']))
with check (public.has_org_role(organization_id, auth.uid(), array['owner','admin','editor']));

-- votes: replace org admin viewer policy
alter table public.votes enable row level security;
drop policy if exists "Organization admins can view org votes" on public.votes;
create policy "Organization admins can view org votes"
on public.votes
for select
using (public.has_org_role(organization_id, auth.uid(), array['owner','admin']));