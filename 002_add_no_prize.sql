-- ============================================
-- Migrace: přidání no_prize do prize_type
-- Spusť v Supabase: Dashboard → SQL Editor → New query
-- ============================================

-- 1. Odstraň starý CHECK constraint
ALTER TABLE codes DROP CONSTRAINT IF EXISTS codes_prize_type_check;

-- 2. Přidej nový s no_prize
ALTER TABLE codes
  ADD CONSTRAINT codes_prize_type_check
  CHECK (prize_type IN ('main_trip', 'prima_voucher', 'kaufland_voucher', 'merch', 'no_prize'));
