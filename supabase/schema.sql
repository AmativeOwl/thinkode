create table problems (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  url         text,
  difficulty  text check (difficulty in ('easy', 'medium', 'hard')) default 'medium',
  created_at  timestamptz default now()
);

create table attempts (
  id          uuid primary key default gen_random_uuid(),
  problem_id  uuid references problems(id) on delete cascade not null,
  steps       text not null,
  feedback    text,
  created_at  timestamptz default now()
);

create index attempts_problem_id_idx on attempts(problem_id);

alter table problems enable row level security;
alter table attempts enable row level security;

create policy "allow all" on problems for all using (true);
create policy "allow all" on attempts for all using (true);
