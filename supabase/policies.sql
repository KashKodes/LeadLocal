alter table public.leads enable row level security;
alter table public.providers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.lead_events enable row level security;

create policy "public can create leads"
on public.leads
for insert
to anon, authenticated
with check (true);

create policy "public can create provider applications"
on public.providers
for insert
to anon, authenticated
with check (true);

create policy "providers can read own provider row"
on public.providers
for select
to authenticated
using (email = auth.email());
