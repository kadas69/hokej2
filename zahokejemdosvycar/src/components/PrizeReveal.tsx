'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Tv, ShoppingCart, Award, Share2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { PrizeType } from '@/lib/types'
import { PRIZE_CONFIG } from '@/lib/types'

interface PrizeRevealProps {
  prizeType: PrizeType
  seatLabel: string
  referralCode: string | null
}

const PRIZE_ICONS: Record<PrizeType, React.ReactNode> = {
  main_trip: <Trophy className="w-16 h-16" />,
  prima_voucher: <Tv className="w-16 h-16" />,
  kaufland_voucher: <ShoppingCart className="w-16 h-16" />,
  merch: <Award className="w-16 h-16" />,
  no_prize: <span className="text-5xl">🍀</span>,
}

// Deterministic confetti — positions fixed, no Math.random() in render
const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  y: (i * 53 + 7) % 60,
  delay: 0.2 + (i * 0.06 % 0.7),
  xMove: ((i * 19 + 5) % 80) - 40,
  yMove: -(60 + (i * 13 % 80)),
  duration: 1.3 + (i * 0.08 % 0.8),
  repeatDelay: 0.4 + (i * 0.21 % 2.2),
  color: ['#FFD700', '#D10A10', '#FFFFFF', '#7C3AED', '#10B981', '#F97316'][i % 6],
  size: 7 + (i % 3) * 4,
  isCircle: i % 3 !== 0,
  rotate: (i * 43) % 360,
}))

export function PrizeReveal({ prizeType, seatLabel, referralCode }: PrizeRevealProps) {
  const config = PRIZE_CONFIG[prizeType]
  const isMainPrize = prizeType === 'main_trip'
  const isNoPrize = prizeType === 'no_prize'
  const [phase, setPhase] = useState<'mystery' | 'reveal'>('mystery')
  const [shareDone, setShareDone] = useState(false)
  const [origin, setOrigin] = useState('')

  // Auto-reveal after 2.4s
  useEffect(() => {
    const t = setTimeout(() => setPhase('reveal'), 2400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  // Stable confetti reference
  const confetti = useMemo(() => CONFETTI, [])
  const referralUrl =
    referralCode && origin ? `${origin}/?ref=${referralCode}` : null

  async function handleShare() {
    if (!referralUrl) return
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Za hokejem do Švýcar',
          text: 'Zkus soutěž i ty, třeba budeš mít štěstí.',
          url: referralUrl,
        })
      } else {
        await navigator.clipboard.writeText(referralUrl)
      }
      setShareDone(true)
    } catch {
      // User can cancel native share dialog; no need to show an error.
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#010D5D] px-6 relative overflow-hidden">

      {/* Background glow — fades in on reveal */}
      <AnimatePresence>
        {phase === 'reveal' && (
          <motion.div
            key="glow"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: isMainPrize ? 0.2 : 0.12 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute w-[800px] h-[800px] rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${config.color} 0%, transparent 65%)` }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* ── Mystery phase ── */}
        {phase === 'mystery' && (
          <motion.div
            key="mystery"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15, filter: 'blur(4px)' }}
            transition={{ duration: 0.35 }}
            className="text-center relative z-10"
          >
            {/* Spinning mystery circle */}
            <div className="relative inline-flex items-center justify-center mb-8">
              {/* Outer spinning ring */}
              <motion.div
                className="absolute w-40 h-40 rounded-full border-4 border-dashed border-white/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
              {/* Inner circle */}
              <motion.div
                className="w-32 h-32 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.span
                  className="text-5xl select-none"
                  animate={{ rotateY: [0, 180, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ?
                </motion.span>
              </motion.div>
            </div>

            <motion.p
              className="text-xl font-bold text-white mb-2"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            >
              Odhaluji vaši výhru…
            </motion.p>
            <p className="text-white/60 text-sm">Sedadlo {seatLabel}</p>
          </motion.div>
        )}

        {/* ── Reveal phase ── */}
        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 text-center max-w-lg w-full"
          >
            {/* Confetti — only for main prize */}
            {isMainPrize && confetti.map((c, i) => (
              <motion.div
                key={i}
                className="absolute pointer-events-none"
                style={{
                  left: `${c.x}%`,
                  top: `${c.y}%`,
                  width: c.size,
                  height: c.size,
                  backgroundColor: c.color,
                  borderRadius: c.isCircle ? '50%' : '2px',
                }}
                initial={{ y: 0, x: 0, opacity: 0, rotate: c.rotate }}
                animate={{
                  y: [0, c.yMove],
                  x: [0, c.xMove],
                  opacity: [0, 1, 1, 0],
                  rotate: [c.rotate, c.rotate + 200],
                }}
                transition={{
                  duration: c.duration,
                  delay: c.delay,
                  repeat: Infinity,
                  repeatDelay: c.repeatDelay,
                  ease: 'easeOut',
                }}
              />
            ))}

            {/* Prize icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14 }}
              className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-8 shadow-lg"
              style={{ backgroundColor: `${config.color}1A`, color: config.color }}
            >
              {PRIZE_ICONS[prizeType]}
            </motion.div>

            {/* Main prize special label */}
            {isMainPrize && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-xs uppercase tracking-[0.35em] font-black mb-3"
                style={{ color: '#FFD700' }}
              >
                ✦ Hlavní výhra ✦
              </motion.p>
            )}

            {/* Seat label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-sm uppercase tracking-wider mb-3 font-medium"
            >
              Sedadlo {seatLabel}
            </motion.p>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 150, damping: 20 }}
              className="text-4xl md:text-5xl font-black mb-4 leading-tight"
              style={{ color: isMainPrize ? '#FFD700' : '#FFFFFF' }}
            >
              {isNoPrize ? 'Tentokrát to nevyšlo' : 'Gratulujeme!'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-xl md:text-2xl font-semibold mb-4"
              style={{ color: config.color }}
            >
              {isNoPrize ? 'Pošlete soutěž dál' : config.label}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/60 mb-10 max-w-sm mx-auto leading-relaxed"
            >
              {isNoPrize
                ? 'Pošlete odkaz kamarádovi. Třeba bude mít štěstí právě on.'
                : isMainPrize
                ? 'Vyhráli jste zájezd na MS v hokeji do Švýcarska! Budeme vás kontaktovat e-mailem.'
                : 'Vaše výhra vám bude zaslána na e-mail, který jste uvedli při registraci.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 items-center justify-center"
            >
              {isNoPrize && referralUrl && (
                <Button
                  size="lg"
                  onClick={handleShare}
                  className="bg-white/15 hover:bg-white/25 text-white rounded-xl px-8 cursor-pointer border border-white/20"
                >
                  {shareDone ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Odkaz připraven
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5 mr-2" />
                      Sdílet soutěž
                    </>
                  )}
                </Button>
              )}

              <Button asChild size="lg" className="bg-[#D10A10] hover:bg-[#D10A10]/90 text-white rounded-xl px-10 shadow-lg shadow-[#D10A10]/20">
                <Link href="/">Zpět na hlavní stránku</Link>
              </Button>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
