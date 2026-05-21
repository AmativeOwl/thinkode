create table problems (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')) default 'medium',
  created_at timestamptz default now()
);

create table attempts (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid references problems(id) on delete cascade not null,
  steps text not null,
  feedback text,
  examples jsonb,
  created_at timestamptz default now()
);

create table problem_examples (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid references problems(id) on delete cascade not null,
  input text,
  output text,
  created_at timestamptz default now()
);

-- creating indexes to improve query performance
create index attempts_problem_id_idx on attempts(problem_id);
create index problem_examples_problem_id_idx on problem_examples(problem_id);

-- enforcing rls on database tables to prevent unauthorised access
alter table problems enable row level security;
alter table attempts enable row level security;

-- initially allowing all access to the tables; need to be modified in production
create policy "allow all" on problems for all using (true);
create policy "allow all" on attempts for all using (true);
alter table problem_examples enable row level security;
create policy "allow all" on problem_examples for all using (true);
