import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { codeId, seatLabel } = await request.json()

    if (!codeId || !seatLabel) {
      return NextResponse.json(
        { error: 'Chybí kód nebo sedadlo.' },
        { status: 400 }
      )
    }

    const { data: code, error: codeError } = await supabaseAdmin
      .from('codes')
      .select('id, prize_type, is_used, registration_id')
      .eq('id', codeId)
      .single()

    if (codeError || !code) {
      return NextResponse.json(
        { error: 'Neplatný kód.' },
        { status: 404 }
      )
    }

    if (code.is_used) {
      return NextResponse.json(
        { error: 'Tento kód již byl použit.' },
        { status: 409 }
      )
    }

    const { data: seat, error: seatError } = await supabaseAdmin
      .from('seats')
      .select('id, is_occupied')
      .eq('seat_label', seatLabel)
      .single()

    if (seatError || !seat) {
      return NextResponse.json(
        { error: 'Sedadlo nebylo nalezeno.' },
        { status: 404 }
      )
    }

    if (seat.is_occupied) {
      return NextResponse.json(
        { error: 'Toto sedadlo je již obsazené.' },
        { status: 409 }
      )
    }

    const { error: updateCodeError } = await supabaseAdmin
      .from('codes')
      .update({
        is_used: true,
        seat_number: seatLabel,
        used_at: new Date().toISOString(),
      })
      .eq('id', codeId)

    if (updateCodeError) {
      console.error('[claim-seat] Update code error:', updateCodeError)
      return NextResponse.json(
        { error: 'Nepodařilo se aktualizovat kód.' },
        { status: 500 }
      )
    }

    const { error: updateSeatError } = await supabaseAdmin
      .from('seats')
      .update({
        is_occupied: true,
        occupied_at: new Date().toISOString(),
        code_id: codeId,
      })
      .eq('seat_label', seatLabel)

    if (updateSeatError) {
      console.error('[claim-seat] Update seat error:', updateSeatError)
      return NextResponse.json(
        { error: 'Nepodařilo se obsadit sedadlo.' },
        { status: 500 }
      )
    }

    let referralCode: string | null = null
    if (code.registration_id) {
      const { data: registration } = await supabaseAdmin
        .from('registrations')
        .select('referral_code')
        .eq('id', code.registration_id)
        .maybeSingle()
      referralCode = registration?.referral_code ?? null
    }

    return NextResponse.json({
      prizeType: code.prize_type,
      seatLabel,
      referralCode,
    })
  } catch (err) {
    console.error('[claim-seat] Error:', err)
    return NextResponse.json(
      { error: 'Neočekávaná chyba serveru.' },
      { status: 500 }
    )
  }
}
