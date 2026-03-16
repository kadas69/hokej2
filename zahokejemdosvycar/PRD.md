# PRD — zahokejemdosvycar.cz

## 1. Přehled projektu

| Položka | Detail |
|---------|--------|
| **Název** | Zahokejemdosvycar.cz |
| **Typ** | Soutěžní microsite (Prima NATIVE) |
| **Partner** | Kaufland |
| **Média** | CNN Prima NEWS, Prima+ |
| **Doména** | www.zahokejemdosvycar.cz |
| **Cíl** | Budování databáze, engagement, brand recall Kaufland |

## 2. User flow

```
TV výzva → zahokejemdosvycar.cz → Registrace (fáze 1) → E-mail s kódem → Zadání kódu (fáze 2) → Výběr sedadla → Odhalení výhry
```

### Fáze 1 — Registrace
1. Uživatel přijde na web (z TV zmínky, sociálních sítí, QR kódu)
2. Vidí hero sekci s letadlem a CTA „Zaregistrujte se"
3. Odpoví na soutěžní otázku (mění se podle epizody/týdne)
4. Vyplní kontaktní údaje
5. Odsouhlasí podmínky soutěže + GDPR
6. Odeslání → potvrzovací zpráva na stránce

### Fáze 2 — Letadlo (gamifikace)
1. Uživatel obdrží e-mail s unikátním kódem
2. Vrátí se na web → /letadlo
3. Zadá kód
4. Systém ověří kód → zobrazí seat map letadla
5. Uživatel si vybere libovolné sedadlo
6. Animace otevření sedadla
7. Odhalení výhry (výhra je určena kódem, NE sedadlem)
8. Sedadlo se vizuálně označí jako obsazené pro další návštěvníky

## 3. Registrační formulář

### Pole

| Pole | Typ | Validace | Povinné |
|------|-----|----------|---------|
| Jméno | text | min 2 znaky | ✅ |
| Příjmení | text | min 2 znaky | ✅ |
| E-mail | email | validní formát, unikátní | ✅ |
| Telefon | tel | český formát (+420...) | ✅ |
| Datum narození | date | 18+ (musí být plnoletý) | ✅ |
| Soutěžní otázka | radio/select | výběr z možností | ✅ |
| Souhlas s podmínkami | checkbox | musí být zaškrtnutý | ✅ |
| Souhlas se zpracováním OÚ | checkbox | musí být zaškrtnutý | ✅ |

### Soutěžní otázka
- Admin může vytvářet/měnit otázky přes admin panel
- Každá otázka má text + 2–4 možnosti odpovědí + označení správné odpovědi
- Na stránce se zobrazuje vždy jen jedna aktivní otázka
- Nesprávná odpověď = registrace se neprovede, zobrazí se hláška „Zkuste to znovu"

## 4. Seat map — specifikace

### Layout
- **10 řad × 4 sedadla** (2 + ulička + 2) = **40 sedadel celkem**
- Vizuálně připomíná pohled shora na interiér letadla
- Řady číslovány 1–20, sedadla A–D (A, B | C, D)

### Stavy sedadla

| Stav | Barva | Interakce |
|------|-------|-----------|
| Volné | Šedá/neutrální | Hover efekt, klikatelné |
| Obsazené (někdo jiný) | Tmavší, s ikonou | Neklikatelné, tooltip „Obsazeno" |
| Moje volba | Zlatá/zvýrazněná | Po kliknutí → animace → výhra |

### Mechanika výher
- **Výhra je určena kódem**, ne sedadlem
- Uživatel si vybírá sedadlo = čistě vizuální/UX prvek
- Po kliknutí se spustí animace otevření → odhalí se typ výhry přiřazený ke kódu
- Sedadlo se po použití označí jako „obsazené" (vizuální efekt pro ostatní)

### Rozdělení výher (40 kódů)

| Typ výhry | Počet | Vizuální styl |
|-----------|-------|---------------|
| 🏆 Zájezd na MS v hokeji | 10 | Zlatá animace, konfety |
| 🎬 Prima+ voucher (1 měsíc) | 10 | Fialová animace |
| 🛒 Kaufland poukázka | 10 | Červená animace (Kaufland brand) |
| 🧢 Hokejový merch balíček | 10 | Modrá animace |

> Poznámka: Přesné počty se mohou změnit — admin panel umožňuje konfiguraci.

## 5. Datový model (Supabase)

### Tabulka: `questions` (soutěžní otázky)
```sql
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,           -- ["Odpověď A", "Odpověď B", "Odpověď C"]
  correct_option_index INTEGER NOT NULL, -- 0, 1, nebo 2
  is_active BOOLEAN DEFAULT false,  -- jen jedna může být aktivní
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Tabulka: `registrations` (registrace soutěžících)
```sql
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
```

### Tabulka: `codes` (unikátní kódy)
```sql
CREATE TABLE codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,         -- např. "HOKEJ-A7X9-B3K2"
  registration_id UUID REFERENCES registrations(id),
  prize_type TEXT NOT NULL,          -- 'main_trip' | 'prima_voucher' | 'kaufland_voucher' | 'merch'
  is_used BOOLEAN DEFAULT false,
  seat_number TEXT,                  -- např. "12A" — vyplní se po výběru sedadla
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Tabulka: `seats` (stav sedadel — vizuální)
```sql
CREATE TABLE seats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seat_label TEXT NOT NULL UNIQUE,   -- "1A", "1B", ... "20D"
  is_occupied BOOLEAN DEFAULT false,
  occupied_at TIMESTAMPTZ,
  code_id UUID REFERENCES codes(id)
);
```

### Row Level Security (RLS)
```sql
-- Registrace: kdokoliv může INSERT, nikdo nemůže SELECT (kromě service role)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON registrations FOR INSERT WITH CHECK (true);

-- Kódy: kdokoliv může SELECT vlastní kód (přes API), UPDATE přes service role
ALTER TABLE codes ENABLE ROW LEVEL SECURITY;

-- Sedadla: kdokoliv může SELECT (pro zobrazení obsazenosti)
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read seats" ON seats FOR SELECT USING (true);

-- Otázky: veřejné čtení aktivní otázky
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read active question" ON questions FOR SELECT USING (is_active = true);
```

## 6. API routes

### POST /api/register
- Přijme formulářová data
- Ověří, že email není duplicitní
- Ověří správnost odpovědi na otázku
- Uloží do `registrations`
- Vrátí success/error

### POST /api/verify-code
- Přijme `{ code: string }`
- Ověří, že kód existuje a nebyl použit
- Vrátí `{ valid: true, codeId: string }` nebo error

### POST /api/claim-seat
- Přijme `{ codeId: string, seatLabel: string }`
- Ověří, že kód je validní a sedadlo je volné
- Označí kód jako použitý, sedadlo jako obsazené
- Vrátí typ výhry: `{ prizeType: string, seatLabel: string }`

### GET /api/seats
- Vrátí seznam všech sedadel s `is_occupied` statusem
- Žádná autentizace (veřejné)

### Admin routes (s auth)
- GET/POST/PUT/DELETE /api/admin/questions
- GET /api/admin/registrations
- POST /api/admin/generate-codes

## 7. Admin panel

Jednoduchý admin na /admin s basic auth (env variable ADMIN_PASSWORD).

### Funkce:
1. **Správa otázek** — CRUD, nastavení aktivní otázky
2. **Generování kódů** — zadej počet pro každý typ výhry → generátor vytvoří kódy
3. **Přehled registrací** — tabulka s filtrováním a exportem do CSV
4. **Přehled kódů/výher** — stav kódů (přiřazené/použité/volné)
5. **Seat map overview** — vizuální přehled obsazenosti

## 8. Stránky

| URL | Obsah |
|-----|-------|
| `/` | Hero + registrace (fáze 1) |
| `/letadlo` | Zadání kódu + seat map (fáze 2) |
| `/vyhra` | Výsledek po kliknutí na sedadlo |
| `/pravidla` | Podmínky soutěže [PLACEHOLDER] |
| `/admin` | Admin panel |

## 9. Požadavky na UX/výkon

- **Mobile first** — primární traffic z mobilů (TV výzva)
- **Load time < 3s** na 4G
- **Registrace < 60s** — formulář musí být rychlý a jednoduchý
- **Seat map** — plynulá animace i na slabších zařízeních
- **Error handling** — jasné české chybové hlášky
- **Potvrzení** — po registraci i po výhře jasná zpětná vazba

## 10. Assets

### Dostupné
- Hero obrázek obrandovaného letadla (dodá zadavatel → `/public/images/hero-plane.jpg`)
- Logo Kaufland (SVG)
- Logo CNN Prima NEWS (SVG)
- Logo MS v hokeji (SVG)

### Placeholder (dotvoří grafik)
- Favicon
- OG image pro sdílení
- Ikonky výher (merch, voucher, letenka)
- Vizuál sedadel (nebo vytvořit v CSS/SVG)

## 11. GDPR & právní

- Podmínky soutěže = **PLACEHOLDER** — dodá právní oddělení
- GDPR souhlas = povinný checkbox v registraci
- Správce osobních údajů: [DOPLNIT]
- Data retention: [DOPLNIT]
