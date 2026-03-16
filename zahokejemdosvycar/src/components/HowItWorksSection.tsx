'use client'

import { motion } from 'framer-motion'
import { ClipboardList, Mail, Plane } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { BoardingPass, HockeyPuck } from '@/components/DecorativeIcons'

const STEPS = [
  {
    number: '01',
    Icon: ClipboardList,
    title: 'Zaregistrujte se',
    description: 'Vyplňte registrační formulář a správně odpovězte na soutěžní otázku.',
    color: '#D10A10',
  },
  {
    number: '02',
    Icon: Mail,
    title: 'Získejte kód',
    description: 'Na váš e-mail zašleme unikátní kód — každý registrovaný jej dostane.',
    color: '#010D5D',
  },
  {
    number: '03',
    Icon: Plane,
    title: 'Odhalte výhru',
    description: 'Zadejte kód, vyberte sedadlo v letadle a zjistěte, co jste vyhráli!',
    color: '#FFD700',
  },
]

function SwitzerlandImage() {
  const [imgError, setImgError] = useState(false)

  if (imgError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#003DA5]/20 to-[#1A1A2E]/30 flex items-center justify-center">
        <svg viewBox="0 0 200 120" className="w-48 opacity-20 fill-[#003DA5]">
          <polygon points="100,5 140,80 60,80" />
          <polygon points="60,40 100,110 20,110" />
          <polygon points="140,35 180,110 100,110" />
        </svg>
      </div>
    )
  }

  return (
    <Image
      src="/images/bg/bg-switzerland.jpg"
      alt="Švýcarské Alpy"
      fill
      className="object-cover object-center"
      onError={() => setImgError(true)}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  )
}

export function HowItWorksSection() {
  return (
    <section className="relative z-10 py-16 md:py-24 overflow-hidden">
      {/* Decorative icons */}
      <BoardingPass className="w-36 md:w-48 opacity-60 -rotate-12 -left-6 top-8 hidden md:block" />
      <HockeyPuck className="w-24 md:w-32 opacity-50 rotate-6 right-4 bottom-12 hidden md:block" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — steps */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <p className="text-xs uppercase tracking-[0.3em] font-semibold text-white/50 mb-3">
                Jak se zapojit
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white">
                Tři kroky k výhře
              </h2>
            </motion.div>

            <div className="space-y-8">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="flex gap-5 items-start"
                >
                  {/* Number + connector */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm text-white shadow-md"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.number}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="w-px flex-1 min-h-8 mt-2 bg-gradient-to-b from-white/20 to-transparent" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pt-2 pb-8">
                    <div className="flex items-center gap-2 mb-1.5">
                      <step.Icon className="w-4 h-4 text-white/50" />
                      <h3 className="font-bold text-white text-lg">{step.title}</h3>
                    </div>
                    <p className="text-white/60 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — Switzerland image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/15 aspect-[4/3]"
          >
            <SwitzerlandImage />

            {/* Overlay badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 px-5 py-4">
                <p className="text-white/50 text-xs uppercase tracking-widest font-medium mb-1">Zápas</p>
                <p className="text-white font-bold text-xl">Česko – Slovensko</p>
                <p className="text-white/60 text-sm mt-1">23. 5. 2026 · Fribourg, Švýcarsko</p>
              </div>
            </div>

            {/* Corner flag */}
            <div className="absolute top-5 right-5 w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
              <div className="w-full h-full bg-[#FF0000] flex items-center justify-center">
                <svg viewBox="0 0 20 20" className="w-5 h-5 fill-white">
                  <rect x="8.5" y="2" width="3" height="16" />
                  <rect x="2" y="8.5" width="16" height="3" />
                </svg>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
