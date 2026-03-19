'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface PhotoBreakProps {
  src: string
  alt: string
  heading?: string
  subtitle?: React.ReactNode
}

export function PhotoBreak({ src, alt, heading, subtitle }: PhotoBreakProps) {
  return (
    <section className="relative z-10 w-full overflow-hidden" style={{ height: 'clamp(280px, 50vh, 520px)' }}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Top + bottom gradient fades into surrounding dark blue */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #010D5D 0%, transparent 30%, transparent 70%, #010D5D 100%)',
        }}
      />

      {/* Optional text overlay */}
      {heading && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <h2 className="text-2xl md:text-4xl font-black text-white drop-shadow-lg">
            {heading}
          </h2>
          {subtitle && (
            <p className="text-sm md:text-base text-white/70 mt-2 max-w-md drop-shadow">
              {subtitle}
            </p>
          )}
        </motion.div>
      )}
    </section>
  )
}
