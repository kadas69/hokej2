# 🚀 Jak použít tento balíček v Cursoru

## Předpoklady

1. **Cursor IDE** nainstalovaný (https://cursor.sh)
2. **Node.js 18+** nainstalovaný
3. **Supabase účet** (https://supabase.com — zdarma)
4. **Vercel účet** pro hosting (https://vercel.com — zdarma)

---

## Krok za krokem

### 1. Založ Supabase projekt
- Jdi na https://supabase.com → New Project
- Poznamenej si:
  - `Project URL` (= NEXT_PUBLIC_SUPABASE_URL)
  - `anon public key` (= NEXT_PUBLIC_SUPABASE_ANON_KEY)
  - `service_role key` (= SUPABASE_SERVICE_ROLE_KEY) — pro admin operace

### 2. Spusť SQL migraci
- V Supabase Dashboard → SQL Editor → New query
- Vlož obsah souboru `supabase/migrations/001_initial_schema.sql`
- Klikni Run
- Tím se vytvoří tabulky, indexy, RLS politiky a 40 sedadel

### 3. Připrav složku projektu
```bash
mkdir zahokejemdosvycar
cd zahokejemdosvycar
```
- Zkopíruj do ní tyto soubory:
  - `.cursor/rules/project-core.mdc`
  - `.cursor/rules/supabase.mdc`
  - `.cursor/rules/components.mdc`
  - `PRD.md`
  - `MASTER_PROMPT.md`
  - `supabase/migrations/001_initial_schema.sql`

### 4. Otevři v Cursoru
```bash
cursor .
```

### 5. Spusť Master Prompt
- Otevři Cursor Agent: **Cmd+I** (Mac) nebo **Ctrl+I** (Windows)
- Přepni na **Agent mode** (ne Normal mode)
- Vlož celý obsah souboru `MASTER_PROMPT.md`
- Stiskni Enter

### 6. Po vytvoření projektu
- Cursor vytvoří Next.js projekt a začne stavět komponenty
- Vytvoř `.env.local` s Supabase klíči:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_PASSWORD=tvoje-admin-heslo
```

### 7. Spusť lokálně
```bash
npm run dev
```
→ Otevři http://localhost:3000

---

## Tips pro práci s Cursorem

### Jeden úkol = jeden chat
Dlouhé konverzace zhoršují kvalitu. Pro každý nový úkol otevři nový chat (Cmd+I).

### Buď konkrétní
❌ "Oprav ten formulář"
✅ "V RegistrationForm.tsx nefunguje validace telefonu — přidej regex pro český formát +420XXXXXXXXX"

### Odkazuj na soubory
Použij @filename pro kontext:
"@SeatMap.tsx — přidej loading skeleton, který se zobrazí, než se načtou data sedadel z API"

### Když se Cursor ztrácí
Napiš: "Přečti si znovu .cursor/rules/project-core.mdc a PRD.md, pak pokračuj."

### YOLO mode (volitelné)
Settings → zapni YOLO mode → přidej prompt:
"Testy jsou vždy povolené. Po každé změně ověř, že `npm run build` projde bez chyb."

---

## Iterace a vylepšení

Po MVP můžeš přidávat:
- [ ] Konfety animace pro hlavní výhru (canvas-confetti)
- [ ] E-mailové notifikace (Resend / SendGrid)
- [ ] OG image generátor pro sdílení výhry
- [ ] Analytics (Plausible / Vercel Analytics)
- [ ] Rate limiting na API routes
- [ ] Export registrací do Google Sheets
- [ ] A/B testování CTA textu

---

## Nasazení na Vercel
1. Pushni kód na GitHub
2. Na vercel.com → Import Repository
3. Nastav environment variables (stejné jako .env.local)
4. Deploy
5. V nastavení domény přidej zahokejemdosvycar.cz → nasměruj DNS
