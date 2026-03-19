'use client'

import Image from 'next/image'
import { useState } from 'react'
import { HockeyPuck } from '@/components/DecorativeIcons'

function Logo({
  src,
  alt,
  width,
  height,
  fallback,
}: {
  src: string
  alt: string
  width: number
  height: number
  fallback: React.ReactNode
}) {
  const [error, setError] = useState(false)

  if (error) return <>{fallback}</>

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="object-contain"
      onError={() => setError(true)}
    />
  )
}

export function LogoBar() {
  return (
    <section className="relative z-10 pt-8 pb-2 overflow-hidden">
      <HockeyPuck className="w-20 opacity-40 rotate-12 right-8 top-2 hidden md:block" />

      <div className="max-w-md mx-auto px-6 flex flex-col items-center gap-3">

        {/* Pořadatel */}
        <p className="text-[9px] text-white/25 uppercase tracking-[0.3em] font-medium">
          Pořadatel
        </p>
        <Logo
          src="/images/logos/logo-cnn-prima.png"
          alt="CNN Prima NEWS"
          width={110}
          height={50}
          fallback={
            <span className="text-white font-bold text-xs">CNN Prima NEWS</span>
          }
        />

        <div className="w-8 h-px bg-white/10" />

        {/* Partneři */}
        <p className="text-[9px] text-white/25 uppercase tracking-[0.3em] font-medium">
          Partneři
        </p>
        <div className="flex items-center gap-5">
          <Logo
            src="/images/logos/logo-kaufland-nove.jpg"
            alt="Kaufland"
            width={44}
            height={22}
            fallback={
              <span className="text-white font-bold text-[10px]">Kaufland</span>
            }
          />
          <Logo
            src="/images/logos/logo-prima-plus.png"
            alt="Prima+"
            width={52}
            height={18}
            fallback={
              <span className="text-white font-bold text-[10px]">Prima+</span>
            }
          />
        </div>

      </div>
    </section>
  )
}
