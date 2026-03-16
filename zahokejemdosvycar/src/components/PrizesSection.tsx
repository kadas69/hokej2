'use client'

import { motion } from 'framer-motion'
import { Trophy, Tv, ShoppingCart, Award } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { PRIZE_CONFIG, type PrizeType } from '@/lib/types'
import { StadiumLight, LocationPin } from '@/components/DecorativeIcons'

const PRIZE_DETAILS: Record<Exclude<PrizeType, 'no_prize'>, { Icon: React.ElementType; detail: string; image: string }> = {
  main_trip: {
    Icon: Trophy,
    detail: 'Letenky + vstupenky pro 2 osoby na MS v hokeji ve Švýcarsku',
    image: '/images/prizes/prize-flight.png',
  },
  kaufland_voucher: {
    Icon: ShoppingCart,
    detail: 'Poukázka na nákup v prodejnách Kaufland po celé České republice',
    image: '/images/prizes/prize-match.png',
  },
  prima_voucher: {
    Icon: Tv,
    detail: 'Měsíc plného přístupu ke streamovací platformě Prima+ zdarma',
    image: '/images/prizes/prize-vip.png',
  },
  merch: {
    Icon: Award,
    detail: 'Exkluzivní hokejový merch balíček — dres, čepice, šála a další',
    image: '/images/prizes/prize-jersey.png',
  },
}

type DisplayPrizeType = Exclude<PrizeType, 'no_prize'>
const PRIZE_ORDER: DisplayPrizeType[] = ['main_trip', 'kaufland_voucher', 'prima_voucher', 'merch']

function PrizeCard({ prizeType, index }: { prizeType: DisplayPrizeType; index: number }) {
  const config = PRIZE_CONFIG[prizeType]
  const details = PRIZE_DETAILS[prizeType]
  const { Icon } = details
  const isMain = prizeType === 'main_trip'
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group ${
        isMain
          ? 'border-[#FFD700]/40 bg-gradient-to-br from-[#1A1A2E] to-[#0d1018] shadow-lg shadow-black/20 md:col-span-2 lg:col-span-1'
          : 'border-white/15 bg-white/10 backdrop-blur-sm shadow-md shadow-black/10'
      }`}
    >
      {isMain && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-[#FFD700] text-[#1A1A2E] text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full">
            Hlavní výhra
          </span>
        </div>
      )}

      {/* Prize image — shown when available, hidden on error */}
      {!imgError && (
        <div className={`relative w-full overflow-hidden ${isMain ? 'h-40' : 'h-32'}`}>
          <Image
            src={details.image}
            alt={config.label}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className={`absolute inset-0 ${isMain ? 'bg-gradient-to-b from-transparent to-[#1A1A2E]/60' : 'bg-gradient-to-b from-transparent to-[#010D5D]/40'}`} />
        </div>
      )}

      {/* Content */}
      <div className={`p-6 ${!imgError ? '' : isMain ? 'pt-10' : ''}`}>
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${imgError ? '' : '-mt-8 relative z-10'}`}
          style={{ backgroundColor: `${config.color}22`, color: config.color }}
        >
          <Icon className="w-6 h-6" />
        </div>

        <h3 className="font-bold text-lg mb-2 leading-tight text-white">
          {config.label}
        </h3>
        <p className="text-sm leading-relaxed text-white/60">
          {details.detail}
        </p>
      </div>
    </motion.div>
  )
}

export function PrizesSection() {
  return (
    <section className="relative z-10 py-16 md:py-24 overflow-hidden">
      {/* Decorative icons */}
      <StadiumLight className="w-20 md:w-28 opacity-50 -left-2 top-20 hidden md:block" />
      <LocationPin className="w-24 md:w-32 opacity-50 -rotate-6 right-6 bottom-8 hidden md:block" />

      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-white/50 mb-3">
            Soutěžní výhry
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Co můžete vyhrát?
          </h2>
          <p className="text-white/60 max-w-md mx-auto">
            Zaregistrujte se, správně odpovězte na soutěžní otázku a získejte kód k odhalení vaší výhry.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {PRIZE_ORDER.map((prizeType, i) => (
            <PrizeCard key={prizeType} prizeType={prizeType} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
