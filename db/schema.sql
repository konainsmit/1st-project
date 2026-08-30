create extension if not exists "pgcrypto";

create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  external_ref text unique not null,
  display_name text,
  phone text,
  email text,
  consent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists doctors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  specialty text not null,
  timezone text not null default 'UTC',
  accepting_patients boolean not null default true
);

create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id),
  channel text not null check (channel in ('web', 'whatsapp', 'messenger')),
  status text not null default 'active',
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists triage_assessments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references chat_sessions(id),
  level text not null check (level in ('mild', 'urgent', 'critical')),
  risk_score integer not null check (risk_score between 0 and 100),
  confidence numeric(5,4) not null,
  red_flags jsonb not null default '[]',
  model_payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id),
  doctor_id uuid not null references doctors(id),
  triage_assessment_id uuid references triage_assessments(id),
  slot_time timestamptz not null,
  status text not null default 'held' check (status in ('held', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists triage_session_idx on triage_assessments(session_id);
create index if not exists appointment_slot_idx on appointments(slot_time, status);
