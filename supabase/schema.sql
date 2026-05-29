-- OUTBOUND.AI Supabase Schema -- Run in SQL editor
create extension if not exists "uuid-ossp";
create table leads (id uuid primary key default uuid_generate_v4(), created_at timestamptz default now(), updated_at timestamptz default now(), first_name text not null, last_name text, email text unique not null, status text default 'new', source text default 'website', icp_score integer default 0);
