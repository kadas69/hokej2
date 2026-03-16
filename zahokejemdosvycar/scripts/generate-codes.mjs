/**
 * Generátor 5000 soutěžních kódů pro zahokejemdosvycar.cz
 *
 * Rozložení výher:
 *   40  × main_trip          (zájezd na MS)
 *   40  × prima_voucher      (Prima+ voucher)
 *   30  × kaufland_voucher   (Kaufland poukázka 500 Kč)
 *   10  × merch              (hokejový merch)
 * 4880  × no_prize           (bez výhry)
 * ─────────────────────────
 * 5000  celkem
 *
 * Spuštění:
 *   node scripts/generate-codes.mjs
 *
 * Vyžaduje v .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Načtení .env.local
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env.local')
const envVars = {}
try {
  readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) envVars[key.trim()] = rest.join('=').trim()
  })
} catch {
  console.error('❌  Nenalezen soubor .env.local')
  process.exit(1)
}

const SUPABASE_URL = envVars['NEXT_PUBLIC_SUPABASE_URL']
const SERVICE_KEY  = envVars['SUPABASE_SERVICE_ROLE_KEY']

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Chybí NEXT_PUBLIC_SUPABASE_URL nebo SUPABASE_SERVICE_ROLE_KEY v .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// ─── Konfigurace ─────────────────────────────────────────
const DISTRIBUTION = [
  { prize_type: 'main_trip',        count: 40   },
  { prize_type: 'prima_voucher',    count: 40   },
  { prize_type: 'kaufland_voucher', count: 30   },
  { prize_type: 'merch',            count: 10   },
  { prize_type: 'no_prize',         count: 4880 },
]
const TOTAL        = DISTRIBUTION.reduce((s, d) => s + d.count, 0) // 5000
const CODE_CHARS   = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // bez 0/O, 1/I
const CODE_LENGTH  = 8
const BATCH_SIZE   = 200

// ─── Generování unikátního kódu ──────────────────────────
function randomCode() {
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  }
  return code
}

// ─── Fisher-Yates shuffle ────────────────────────────────
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// ─── Hlavní logika ───────────────────────────────────────
async function main() {
  console.log(`\n🎯  Generuji ${TOTAL} kódů...\n`)

  // Sestavení náhodně promíchaného pole prize_type
  const prizes = []
  for (const { prize_type, count } of DISTRIBUTION) {
    for (let i = 0; i < count; i++) prizes.push(prize_type)
  }
  shuffle(prizes)

  // Generování unikátních kódů
  const usedCodes = new Set()
  const rows = []
  for (let i = 0; i < TOTAL; i++) {
    let code
    do { code = randomCode() } while (usedCodes.has(code))
    usedCodes.add(code)
    rows.push({ code, prize_type: prizes[i], is_used: false })
  }

  // Vkládání po dávkách
  let inserted = 0
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const { error } = await supabase.from('codes').insert(batch)
    if (error) {
      console.error(`❌  Chyba při vkládání dávky ${i}–${i + BATCH_SIZE}:`, error.message)
      process.exit(1)
    }
    inserted += batch.length
    process.stdout.write(`\r   Vloženo: ${inserted} / ${TOTAL}`)
  }

  console.log(`\n\n✅  Hotovo! Vloženo ${inserted} kódů.\n`)
  console.log('Přehled výher:')
  for (const { prize_type, count } of DISTRIBUTION) {
    console.log(`   ${prize_type.padEnd(20)} ${count}×`)
  }
  console.log()
}

main().catch(err => {
  console.error('❌  Neočekávaná chyba:', err)
  process.exit(1)
})
