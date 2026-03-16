# 🏒 MASTER PROMPT — zahokejemdosvycar.cz

> **Tento soubor vlož jako první prompt do Cursor Agenta (Cmd+I → Agent mode).**
> Po vložení řekni: "Přečti všechny .mdc soubory v .cursor/rules/ a PRD.md, pak začni stavět projekt podle instrukcí."

---

## Co stavíš

Soutěžní microsite **zahokejemdosvycar.cz** — interaktivní landing page k MS v hokeji 2025.
Partneři: **Kaufland** (hlavní partner), **CNN Prima NEWS + Prima+** (mediální podpora).

Claim: „Nastupte na palubu a leťte na MS v hokeji!"

## Tech stack (povinný)

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **UI komponenty:** shadcn/ui
- **Backend/DB:** Supabase (PostgreSQL + Auth + Realtime)
- **Hosting:** Vercel (zatím)
- **Animace:** Framer Motion
- **Ikony:** Lucide React

## Struktura projektu

```
zahokejemdosvycar/
├── .cursor/rules/          ← Cursor rules (.mdc)
├── .env.local              ← Supabase keys (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
├── public/
│   ├── images/
│   │   ├── hero-plane.jpg  ← Hero obrázek letadla (dodáme)
│   │   ├── logo-kaufland.svg
│   │   ├── logo-prima.svg
│   │   └── logo-hockey.svg
│   └── fonts/
├── src/
│   ├── app/
│   │   ├── layout.tsx      ← Root layout, metadata, fonty
│   │   ├── page.tsx        ← Homepage (hero + registrace)
│   │   ├── letadlo/
│   │   │   └── page.tsx    ← Fáze 2: zadání kódu + seat map
│   │   ├── vyhra/
│   │   │   └── page.tsx    ← Výsledek po kliknutí na sedadlo
│   │   ├── pravidla/
│   │   │   └── page.tsx    ← Podmínky soutěže (placeholder)
│   │   ├── admin/
│   │   │   └── page.tsx    ← Admin panel pro správu otázek a kódů
│   │   └── api/
│   │       ├── register/route.ts
│   │       ├── verify-code/route.ts
│   │       └── claim-seat/route.ts
│   ├── components/
│   │   ├── HeroSection.tsx
│   │   ├── RegistrationForm.tsx
│   │   ├── SeatMap.tsx
│   │   ├── SeatMapSeat.tsx
│   │   ├── CodeInput.tsx
│   │   ├── PrizeReveal.tsx
│   │   ├── LogoBar.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   └── styles/
│       └── globals.css
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── PRD.md                  ← Product Requirements Document
├── MASTER_PROMPT.md        ← Tento soubor
└── package.json
```

## Postup stavby (DODRŽUJ POŘADÍ)

### Krok 1: Inicializace projektu
```bash
npx create-next-app@latest zahokejemdosvycar --typescript --tailwind --eslint --app --src-dir
cd zahokejemdosvycar
npx shadcn@latest init
npm install @supabase/supabase-js @supabase/ssr framer-motion lucide-react
```

### Krok 2: Supabase schema
Vytvoř soubor `supabase/migrations/001_initial_schema.sql` podle datového modelu v PRD.md.

### Krok 3: Homepage (Fáze 1 — registrace)
1. `HeroSection.tsx` — fullscreen hero s obrázkem letadla, claim, CTA
2. `RegistrationForm.tsx` — jméno, příjmení, email, telefon, datum narození, soutěžní otázka, GDPR checkbox
3. `LogoBar.tsx` — loga partnerů
4. `Footer.tsx` — odkaz na pravidla, copyright
5. API route `register/route.ts` — validace + uložení do Supabase

### Krok 4: Fáze 2 — Letadlo (seat map)
1. `CodeInput.tsx` — input pro zadání unikátního kódu
2. `SeatMap.tsx` — 2D mapa letadla (10 řad × 4 sedadla = 40 míst)
3. `SeatMapSeat.tsx` — jednotlivé sedadlo s hover/click animací
4. `PrizeReveal.tsx` — modální okno s odhalením výhry + animace
5. API routes pro ověření kódu a claim sedadla

### Krok 5: Admin panel
Jednoduchý admin (stačí basic auth) pro:
- Správu soutěžních otázek (CRUD)
- Nahrání/generování kódů
- Přehled registrací a výher

### Krok 6: Polish
- Responsive design (mobile first!)
- Loading states, error handling
- Meta tagy, OG image
- Favicon

## Design guidelines

### Barevná paleta
- **Primární:** #C8102E (červená Kaufland) 
- **Sekundární:** #003DA5 (hokejová modrá)
- **Accent:** #FFD700 (zlatá — hlavní výhra)
- **Pozadí:** #E8ECF0 (světle šedá) → #FFFFFF (bílá) — čistý, vzdušný look
- **Text hlavní:** #1A1A2E (tmavý) na světlém pozadí
- **Text sekundární:** #6B7280 (šedý)

### Typografie
- Nadpisy: bold, velké, uppercase kde to dává smysl
- Tělo: čisté, čitelné, min 16px

### Vizuální styl
- **Čistý, ilustrativní, vzdušný** — inspirovaný hero obrázkem (letadlo v mracích s horami)
- Světlé pozadí, dekorativní mraky/hory jako SVG nebo CSS elementy
- Flat / semi-flat design, žádný tmavý techy look
- CTA tlačítka: výrazná červená (#C8102E) nebo modrá (#003DA5) na světlém pozadí
- Animace: subtilní, rychlé, nesmí zpomalovat UX
- Seat map: čisté 2D sedadla na světlém pozadí, barevně odlišená (volná / obsazená / moje výhra)

## Důležitá pravidla

1. **Mobile first** — většina traffic přijde z mobilu (odkaz z TV)
2. **Rychlost** — stránka musí být pod 3s load time
3. **Jednoduchost** — žádné over-engineering, žádné zbytečné závislosti
4. **Čeština** — veškerý UI text v češtině
5. **Přístupnost** — základní a11y (labels, contrast, keyboard nav)
6. **Kód = výhra** — uživatel si vybere sedadlo, ale výhra je určena kódem, ne sedadlem
7. **Seat map vizuál** — obsazená sedadla (kde už někdo kód použil) se zobrazují jako zabraná

## Don't do anything else
Drž se PRD.md a tohoto promptu. Neopravuj soubory, které nesouvisí s aktuálním krokem. Neptej se — stavěj.
