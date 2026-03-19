'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { PrizeReveal } from '@/components/PrizeReveal'
import type { PrizeType } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const VALID_PRIZE_TYPES: PrizeType[] = ['main_trip', 'prima_voucher', 'kaufland_voucher', 'merch', 'no_prize']

function isValidPrizeType(value: string | null): value is PrizeType {
  return value !== null && VALID_PRIZE_TYPES.includes(value as PrizeType)
}

function VyhraContent() {
  const searchParams = useSearchParams()
  const prizeParam = searchParams.get('prize')
  const prize = isValidPrizeType(prizeParam) ? prizeParam : null
  const seat = searchParams.get('seat')
  const referralCode = searchParams.get('referralCode')

  if (!prize || !seat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#010D5D] px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Stránka nebyla nalezena</h1>
          <p className="text-white/60 mb-6">
            Pro odhalení výhry nejdříve zadejte kód a vyberte sedadlo.
          </p>
          <Button asChild className="bg-[#D10A10] hover:bg-[#D10A10]/90 text-white">
            <Link href="/letadlo">Zadat kód</Link>
          </Button>
        </div>
      </div>
    )
  }

  return <PrizeReveal prizeType={prize} seatLabel={seat} referralCode={referralCode} />
}

export default function VyhraPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#010D5D]">
          <div className="w-10 h-10 border-4 border-[#D10A10] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VyhraContent />
    </Suspense>
  )
}
