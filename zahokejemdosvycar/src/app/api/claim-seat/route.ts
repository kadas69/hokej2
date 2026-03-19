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

    // Atomic update: only mark code as used if not already used
    const { data: code, error: codeError } = await supabaseAdmin
      .from('codes')
      .update({
        is_used: true,
        seat_number: seatLabel,
        used_at: new Date().toISOString(),
      })
      .eq('id', codeId)
      .eq('is_used', false)
      .select('id, prize_type, registration_id')
      .single()

    if (codeError || !code) {
      const { data: existingCode } = await supabaseAdmin
        .from('codes')
        .select('is_used')
        .eq('id', codeId)
        .single()

      if (existingCode?.is_used) {
        return NextResponse.json(
          { error: 'Tento kód již byl použit.' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: 'Neplatný kód.' },
        { status: 404 }
      )
    }

    // Atomic seat claim: only occupy if not already occupied
    const { data: seat, error: seatError } = await supabaseAdmin
      .from('seats')
      .update({
        is_occupied: true,
        occupied_at: new Date().toISOString(),
        code_id: codeId,
      })
      .eq('seat_label', seatLabel)
      .eq('is_occupied', false)
      .select('id')
      .single()

    if (seatError || !seat) {
      // Rollback the code update
      await supabaseAdmin
        .from('codes')
        .update({ is_used: false, seat_number: null, used_at: null })
        .eq('id', codeId)

      return NextResponse.json(
        { error: 'Toto sedadlo je již obsazené.' },
        { status: 409 }
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
