'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CodeInput } from '@/components/CodeInput'
import { SeatMap } from '@/components/SeatMap'
import { Footer } from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Plane, ArrowLeft } from 'lucide-react'

function LetadloContent() {
  const searchParams = useSearchParams()
  const [codeId, setCodeId] = useState<string | null>(searchParams.get('codeId'))
  const router = useRouter()

  function handleSeatClaimed(prizeType: string, seatLabel: string, referralCode: string | null) {
    const params = new URLSearchParams({ prize: prizeType, seat: seatLabel })
    if (referralCode) {
      params.set('referralCode', referralCode)
    }
    router.push(`/vyhra?${params.toString()}`)
  }

  return (
    <>
      {/* Background: zada.png with dark overlay */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/stad_nove.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(1, 13, 93, 0.65)' }} />
      </div>

      <main className="min-h-screen">
        <header className="relative z-10 bg-[#010D5D]/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-4">
          <div className="max-w-5xl mx-auto">
            {/* Main header row */}
            <div className="flex items-center justify-between">
              {/* Left — CNN Prima NEWS logo */}
              <div className="flex-1 flex items-center justify-start">
                <Link href="/" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/60 transition-colors group">
                  <ArrowLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity -mr-1 group-hover:mr-0" />
                  <Image
                    src="/images/logos/logo-cnn-prima.png"
                    alt="CNN Prima NEWS"
                    width={88}
                    height={30}
                    className="object-contain"
                  />
                </Link>
              </div>

              {/* Center — Title */}
              <div className="flex items-center gap-2.5 px-6">
                <Plane className="w-5 h-5 text-[#D10A10] shrink-0" />
                <span className="text-white font-bold text-lg whitespace-nowrap">
                  Za hokejem do Švýcar
                </span>
              </div>

              {/* Right — Kaufland logo */}
              <div className="flex-1 flex items-center justify-end">
                <Image
                  src="/images/logos/logo-kaufland-nove.jpg"
                  alt="Kaufland"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 md:py-20 overflow-x-hidden">
          {!codeId ? (
            <CodeInput onVerified={setCodeId} />
          ) : (
            <SeatMap codeId={codeId} onSeatClaimed={handleSeatClaimed} />
          )}
        </div>

        <Footer />
      </main>
    </>
  )
}

export default function LetadloPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#010D5D]">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LetadloContent />
    </Suspense>
  )
}
