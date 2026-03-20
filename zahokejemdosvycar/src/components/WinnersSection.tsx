'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Plane, HelpCircle } from 'lucide-react'
import { HockeyStick, IceSkate } from '@/components/DecorativeIcons'
import type { Winner } from '@/lib/types'
import { WINNERS_TOTAL_SLOTS } from '@/lib/types'

function WinnerCard({ slot, winner, index }: { slot: number; winner: Winner | null; index: number }) {
  const revealed = winner !== null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className={`relative rounded-2xl border overflow-hidden transition-all duration-300 ${
        revealed
          ? 'border-[#FFD700]/30 bg-gradient-to-br from-[#1A1A2E] to-[#0d1018] shadow-lg shadow-[#FFD700]/5 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FFD700]/10'
          : 'border-white/10 bg-white/[0.04] border-dashed'
      }`}
    >
      <div className={`px-4 py-5 flex items-center gap-3.5 ${revealed ? '' : 'opacity-40'}`}>
        {/* Slot number */}
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-black ${
            revealed
              ? 'bg-[#FFD700]/15 text-[#FFD700]'
              : 'bg-white/8 text-white/30'
          }`}
        >
          {slot}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {revealed ? (
            <>
              <p className="font-bold text-white text-sm truncate">
                {winner.first_name} {winner.last_name}
              </p>
              <p className="text-[#FFD700]/60 text-xs mt-0.5 flex items-center gap-1">
                <Plane className="w-3 h-3" />
                Letí do Švýcar
              </p>
            </>
          ) : (
            <>
              <p className="text-white/30 text-sm font-medium">Čeká na odhalení</p>
              <p className="text-white/15 text-xs mt-0.5">Slot #{slot}</p>
            </>
          )}
        </div>

        {/* Status icon */}
        <div className="shrink-0">
          {revealed ? (
            <div className="w-7 h-7 rounded-full bg-[#FFD700]/15 flex items-center justify-center">
              <Plane className="w-3.5 h-3.5 text-[#FFD700]" />
            </div>
          ) : (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center"
            >
              <HelpCircle className="w-3.5 h-3.5 text-white/20" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Subtle gold accent line for revealed */}
      {revealed && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />
      )}
    </motion.div>
  )
}

export function WinnersSection() {
  const [winners, setWinners] = useState<Winner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/winners')
        const data = await res.json()
        setWinners(data.winners || [])
      } catch {
        /* silent fail — section just shows empty slots */
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const revealedCount = winners.length
  const progress = (revealedCount / WINNERS_TOTAL_SLOTS) * 100

  // Build slot map: slot_number -> winner
  const slotMap = new Map<number, Winner>()
  for (const w of winners) {
    slotMap.set(w.slot_number, w)
  }

  if (loading) return null // Don't show section while loading

  return (
    <section className="relative z-10 py-16 md:py-24 overflow-hidden">
      {/* Decorative icons */}
      <HockeyStick className="w-24 md:w-32 opacity-50 -rotate-12 -left-4 top-16 hidden md:block" />
      <IceSkate className="w-20 md:w-28 opacity-50 rotate-6 right-4 bottom-16 hidden md:block" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-white/50 mb-3">
            Výherní listina
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Kdo letí do Švýcar?
          </h2>
          <p className="text-white/60 max-w-md mx-auto">
            Každý týden zveřejňujeme nové výherce soutěže o letenky na hokej.
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-semibold text-white/70">
              Zveřejněno výherců
            </span>
            <span className="text-sm font-black text-white">
              {revealedCount}
              <span className="text-white/40 font-semibold"> / {WINNERS_TOTAL_SLOTS}</span>
            </span>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#D10A10] via-[#FFD700] to-[#FFD700]"
            />
          </div>
        </motion.div>

        {/* Grid of 16 slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: WINNERS_TOTAL_SLOTS }, (_, i) => {
            const slotNum = i + 1
            return (
              <WinnerCard
                key={slotNum}
                slot={slotNum}
                winner={slotMap.get(slotNum) ?? null}
                index={i}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
