-- Add no_prize to code prize types and referral tracking to registrations

ALTER TABLE codes
  DROP CONSTRAINT IF EXISTS codes_prize_type_check;

ALTER TABLE codes
  ADD CONSTRAINT codes_prize_type_check
  CHECK (prize_type IN ('main_trip', 'prima_voucher', 'kaufland_voucher', 'merch', 'no_prize'));

ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS referral_code TEXT,
  ADD COLUMN IF NOT EXISTS referred_by TEXT;

UPDATE registrations
SET referral_code = UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', '') FROM 1 FOR 8))
WHERE referral_code IS NULL;

ALTER TABLE registrations
  ALTER COLUMN referral_code SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'registrations_referral_code_format'
  ) THEN
    ALTER TABLE registrations
      ADD CONSTRAINT registrations_referral_code_format
      CHECK (referral_code ~ '^[A-Z0-9]{8}$');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'registrations_referred_by_format'
  ) THEN
    ALTER TABLE registrations
      ADD CONSTRAINT registrations_referred_by_format
      CHECK (referred_by IS NULL OR referred_by ~ '^[A-Z0-9]{8}$');
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_referral_code
  ON registrations(referral_code);

CREATE INDEX IF NOT EXISTS idx_registrations_referred_by
  ON registrations(referred_by);
