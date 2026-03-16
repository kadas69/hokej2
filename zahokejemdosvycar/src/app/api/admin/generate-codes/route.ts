import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/admin-auth'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const part = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `HOKEJ-${part()}-${part()}`
}

export async function POST(request: NextRequest) {
  const authError = verifyAdmin(request)
  if (authError) return authError

  const body = await request.json()
  const { main_trip = 0, prima_voucher = 0, kaufland_voucher = 0, merch = 0, no_prize = 0 } = body

  const codes: { code: string; prize_type: string }[] = []

  const addCodes = (count: number, prizeType: string) => {
    for (let i = 0; i < count; i++) {
      codes.push({ code: generateCode(), prize_type: prizeType })
    }
  }

  addCodes(main_trip, 'main_trip')
  addCodes(prima_voucher, 'prima_voucher')
  addCodes(kaufland_voucher, 'kaufland_voucher')
  addCodes(merch, 'merch')
  addCodes(no_prize, 'no_prize')

  // Shuffle to avoid prize blocks by generation order.
  for (let i = codes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[codes[i], codes[j]] = [codes[j], codes[i]]
  }

  if (codes.length === 0) {
    return NextResponse.json({ error: 'Zadejte alespoň jeden kód k vygenerování.' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin.from('codes').insert(codes).select()

  if (error) {
    console.error('[admin/generate-codes] POST error:', error)
    return NextResponse.json({ error: 'Chyba při generování kódů.' }, { status: 500 })
  }

  return NextResponse.json({ codes: data, count: data?.length })
}

export async function GET(request: NextRequest) {
  const authError = verifyAdmin(request)
  if (authError) return authError

  const { data, error } = await supabaseAdmin
    .from('codes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[admin/generate-codes] GET error:', error)
    return NextResponse.json({ error: 'Chyba při načítání kódů.' }, { status: 500 })
  }

  return NextResponse.json({ codes: data })
}
