-- Migration 003: Dynamic code generation at registration time
-- Replaces the pre-generated code pool with on-demand code creation
-- during registration. Prize type is assigned atomically with limits.

-- Prize limits (hardcoded to match campaign spec):
--   main_trip:         20  (zájezd + vstupenky 1+1)
--   prima_voucher:    100  (Prima+ voucher)
--   kaufland_voucher: 100  (Kaufland kartička)
--   merch:             10  (merch balíček)
--   no_prize:          everyone after limits are exhausted

CREATE OR REPLACE FUNCTION assign_prize_and_create_code(
  p_registration_id UUID,
  p_code            TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_prize_type           TEXT;
  v_available_prizes     TEXT[];
  v_main_trip_count      INT;
  v_prima_voucher_count  INT;
  v_kaufland_count       INT;
  v_merch_count          INT;

  c_main_trip_limit      CONSTANT INT := 20;
  c_prima_voucher_limit  CONSTANT INT := 100;
  c_kaufland_limit       CONSTANT INT := 100;
  c_merch_limit          CONSTANT INT := 10;
BEGIN
  -- Acquire a transaction-level advisory lock so only one registration
  -- can run this function at a time, preventing prize limit overruns.
  PERFORM pg_advisory_xact_lock(hashtext('assign_prize_and_create_code'));

  -- Count already-assigned prizes (codes that belong to a registration)
  SELECT
    COUNT(*) FILTER (WHERE prize_type = 'main_trip'),
    COUNT(*) FILTER (WHERE prize_type = 'prima_voucher'),
    COUNT(*) FILTER (WHERE prize_type = 'kaufland_voucher'),
    COUNT(*) FILTER (WHERE prize_type = 'merch')
  INTO
    v_main_trip_count,
    v_prima_voucher_count,
    v_kaufland_count,
    v_merch_count
  FROM codes
  WHERE registration_id IS NOT NULL;

  -- Build the pool of prize types that still have remaining inventory
  v_available_prizes := ARRAY[]::TEXT[];

  IF v_main_trip_count     < c_main_trip_limit     THEN
    v_available_prizes := v_available_prizes || ARRAY['main_trip'];
  END IF;
  IF v_prima_voucher_count < c_prima_voucher_limit  THEN
    v_available_prizes := v_available_prizes || ARRAY['prima_voucher'];
  END IF;
  IF v_kaufland_count      < c_kaufland_limit       THEN
    v_available_prizes := v_available_prizes || ARRAY['kaufland_voucher'];
  END IF;
  IF v_merch_count         < c_merch_limit          THEN
    v_available_prizes := v_available_prizes || ARRAY['merch'];
  END IF;

  -- Randomly pick one prize type from the pool, or no_prize if empty
  IF array_length(v_available_prizes, 1) > 0 THEN
    v_prize_type := v_available_prizes[
      1 + floor(random() * array_length(v_available_prizes, 1))::INT
    ];
  ELSE
    v_prize_type := 'no_prize';
  END IF;

  -- Insert the newly generated code tied to this registration
  INSERT INTO codes (code, registration_id, prize_type)
  VALUES (p_code, p_registration_id, v_prize_type);

  RETURN v_prize_type;
END;
$$;
