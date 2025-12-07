-- Enable UUID generation function
create extension if not exists "uuid-ossp";

create table if not exists public.resumes (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default now(),
  cv_raw_text text,
  cv_parsed_json jsonb,
  industry text,
  role text,
  jd_text text,
  optimized_resume_html text,
  optimized_cover_letter_html text,
  ats_score integer,
  ats_missing_keywords jsonb,
  ats_matched_keywords jsonb,
  download_token text,
  payment_status text default 'INIT'
);

create index if not exists resumes_token_idx on public.resumes (download_token);
