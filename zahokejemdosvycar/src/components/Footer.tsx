import Link from 'next/link'
import Image from 'next/image'
import { Plane } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative z-10 bg-[#000838] text-white border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-2">
              <Plane className="w-5 h-5 text-[#D10A10]" />
              Za hokejem do Švýcar
            </div>
            <p className="text-white/40 text-sm max-w-xs">
              Soutěž o zájezd na MS v hokeji 2026 do Švýcarska s Kauflandem a CNN Prima NEWS.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 text-sm">
            <Link href="/pravidla" className="text-white/50 hover:text-white transition-colors">
              Podmínky soutěže
            </Link>
            <Link href="/letadlo" className="text-white/50 hover:text-white transition-colors">
              Zadat kód
            </Link>
            <Link href="/" className="text-white/50 hover:text-white transition-colors">
              Registrace
            </Link>
          </div>
        </div>

        {/* Partner logos */}
        <div className="border-t border-white/10 mt-8 pt-6">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-4">Partneři</p>
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex items-center gap-3 text-white/60">
              <Image src="/images/logos/logo-kaufland.png" alt="Kaufland" width={32} height={32} className="object-contain" />
              <span className="text-sm font-medium">Kaufland</span>
            </div>
            <div className="flex items-center gap-3 text-white/60">
              <Image src="/images/logos/logo-prima-plus.png" alt="Prima+" width={48} height={18} className="object-contain" />
              <span className="text-sm font-medium">Prima+</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>&copy; {new Date().getFullYear()} zahokejemdosvycar.cz</p>
          <p>Všechna práva vyhrazena</p>
        </div>
      </div>
    </footer>
  )
}
