-- ============================================
-- zahokejemdosvycar.cz — Supabase Schema
-- ============================================
-- Spusť v Supabase SQL Editoru (Dashboard → SQL Editor → New query)

-- 1. Soutěžní otázky
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,                -- ["Odpověď A", "Odpověď B", "Odpověď C"]
  correct_option_index INTEGER NOT NULL, -- index správné odpovědi (0, 1, 2...)
  is_active BOOLEAN DEFAULT false,       -- jen 1 může být aktivní
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Registrace soutěžících
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  birth_date DATE NOT NULL,
  question_id UUID REFERENCES questions(id),
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  gdpr_consent BOOLEAN NOT NULL DEFAULT true,
  terms_consent BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Unikátní kódy s výhrami
CREATE TABLE codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  registration_id UUID REFERENCES registrations(id),
  prize_type TEXT NOT NULL CHECK (prize_type IN ('main_trip', 'prima_voucher', 'kaufland_voucher', 'merch')),
  is_used BOOLEAN DEFAULT false,
  seat_number TEXT,                      -- vyplní se po výběru sedadla, např. "12A"
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Sedadla (vizuální stav)
CREATE TABLE seats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seat_label TEXT NOT NULL UNIQUE,       -- "1A", "1B", ... "20D"
  is_occupied BOOLEAN DEFAULT false,
  occupied_at TIMESTAMPTZ,
  code_id UUID REFERENCES codes(id)
);

-- ============================================
-- Indexy
-- ============================================
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_codes_code ON codes(code);
CREATE INDEX idx_codes_registration ON codes(registration_id);
CREATE INDEX idx_seats_label ON seats(seat_label);
CREATE INDEX idx_questions_active ON questions(is_active) WHERE is_active = true;

-- ============================================
-- Row Level Security
-- ============================================

-- Registrace: veřejný INSERT, žádný SELECT
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert_registrations" ON registrations
  FOR INSERT WITH CHECK (true);

-- Kódy: žádný veřejný přístup (jen přes API s service role)
ALTER TABLE codes ENABLE ROW LEVEL SECURITY;

-- Sedadla: veřejné čtení (pro zobrazení obsazenosti)
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_seats" ON seats
  FOR SELECT USING (true);

-- Otázky: veřejné čtení aktivní otázky
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_active_question" ON questions
  FOR SELECT USING (is_active = true);

-- ============================================
-- Seed: Vygenerovat 40 sedadel (1A–10D)
-- ============================================
INSERT INTO seats (seat_label)
SELECT row_num || seat_letter
FROM generate_series(1, 10) AS row_num,
     unnest(ARRAY['A', 'B', 'C', 'D']) AS seat_letter
ORDER BY row_num, seat_letter;

-- ============================================
-- Trigger: Zajistit max 1 aktivní otázku
-- ============================================
CREATE OR REPLACE FUNCTION ensure_single_active_question()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE questions SET is_active = false WHERE id != NEW.id AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_single_active_question
  BEFORE INSERT OR UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_active_question();
