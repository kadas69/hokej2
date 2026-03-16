import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Plane } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Podmínky soutěže | Za hokejem do Švýcar',
}

export default function PravidlaPage() {
  return (
    <main className="min-h-screen bg-bg-light">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-text-primary font-bold text-lg">
            <Plane className="w-5 h-5 text-kaufland" />
            Za hokejem do Švýcar
          </Link>
          <Link href="/" className="text-sm text-hockey-blue hover:underline">
            Zpět na hlavní stránku
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-8">
          Podmínky soutěže
        </h1>

        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6 text-text-secondary leading-relaxed">
          <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 text-center text-text-primary font-medium">
            Úplné znění pravidel soutěže bude doplněno právním oddělením.
          </div>

          <h2 className="text-xl font-semibold text-text-primary">1. Pořadatel soutěže</h2>
          <p>
            Pořadatelem soutěže „Za hokejem do Švýcar" je [DOPLNIT], IČO: [DOPLNIT],
            se sídlem [DOPLNIT] (dále jen „Pořadatel").
          </p>

          <h2 className="text-xl font-semibold text-text-primary">2. Doba trvání soutěže</h2>
          <p>
            Soutěž probíhá od [DOPLNIT] do [DOPLNIT] včetně.
          </p>

          <h2 className="text-xl font-semibold text-text-primary">3. Účastníci soutěže</h2>
          <p>
            Soutěže se může zúčastnit fyzická osoba starší 18 let s trvalým pobytem na území České
            republiky, která splní podmínky soutěže.
          </p>

          <h2 className="text-xl font-semibold text-text-primary">4. Mechanika soutěže</h2>
          <p>
            Účastník se zaregistruje na webu zahokejemdosvycar.cz, správně odpoví na soutěžní otázku
            a následně obdrží unikátní kód, se kterým si může vybrat sedadlo v letadle a odhalit
            svou výhru.
          </p>

          <h2 className="text-xl font-semibold text-text-primary">5. Výhry</h2>
          <p>
            Výhry budou upřesněny. Typ výhry je předurčen unikátním kódem, nikoliv výběrem sedadla.
          </p>

          <h2 className="text-xl font-semibold text-text-primary">6. Ochrana osobních údajů</h2>
          <p>
            Správcem osobních údajů je [DOPLNIT]. Osobní údaje budou zpracovány za účelem realizace
            soutěže a předání výher. Podrobnosti o zpracování budou doplněny.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  )
}
