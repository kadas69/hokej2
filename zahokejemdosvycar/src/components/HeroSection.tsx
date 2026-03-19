'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  const scrollToForm = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[600px] max-h-[1100px] flex flex-col overflow-hidden bg-[#010D5D]">
      {/* Full-width hero image */}
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] min-h-[300px] max-h-[700px]">
        <Image
          src="/images/letadlonove2.jpg"
          alt="CNN Prima NEWS letadlo — Za hokejem do Švýcar"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Bottom gradient fade into content area */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#010D5D] to-transparent" />
      </div>

      {/* Content area below/over the image */}
      <div className="relative z-10 flex-1 flex items-center -mt-20 md:-mt-24 pb-12 md:pb-16">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-xl lg:max-w-2xl mx-auto text-center lg:text-left lg:mx-0">

            {/* Partner line */}
            <div className="mb-6">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="text-white/40 text-xs uppercase tracking-[0.3em] font-semibold"
              >
                Pořadatelem soutěže je CNN Prima NEWS
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.15 }}
                className="text-white/35 text-xs uppercase tracking-[0.3em] font-semibold mt-1"
              >
                Hrdým partnerem soutěže je <span className="text-[#FF4D4D] font-bold">Kaufland</span>
              </motion.p>
            </div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-black text-white leading-[1.0] tracking-tight mb-6"
            >
              Za hokejem
              <br />
              <span style={{ color: '#D10A10' }}>do Švýcarska</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg md:text-xl text-white/60 max-w-sm mb-10 leading-relaxed mx-auto lg:mx-0"
            >
              Zaregistrujte se, získejte kód a zažijte naživo atraktivní hokejový souboj Česka se Slovenskem!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <Button
                onClick={scrollToForm}
                size="lg"
                className="bg-cnn-red hover:bg-cnn-red/90 text-white text-base font-semibold px-9 py-6 rounded-full shadow-lg shadow-cnn-red/40 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-cnn-red/50"
              >
                Zaregistrovat se
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white hover:border-white/30 text-base px-8 py-6 rounded-full backdrop-blur-sm cursor-pointer transition-all duration-200"
              >
                <Link href="/letadlo">Mám kód →</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-5 h-9 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}
