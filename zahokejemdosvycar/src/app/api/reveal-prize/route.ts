import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { codeId, seatLabel } = await request.json()

    if (!codeId) {
      return NextResponse.json(
        { error: 'Chybí kód.' },
        { status: 400 }
      )
    }

    if (!seatLabel || typeof seatLabel !== 'string') {
      return NextResponse.json(
        { error: 'Chybí sedadlo.' },
        { status: 400 }
      )
    }

    // Atomic update: only mark as used if not already used
    const { data: updatedCode, error: updateError } = await supabaseAdmin
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

    if (updateError || !updatedCode) {
      // Either code doesn't exist or was already used
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

    // Mark the seat as occupied
    await supabaseAdmin
      .from('seats')
      .update({
        is_occupied: true,
        occupied_at: new Date().toISOString(),
        code_id: codeId,
      })
      .eq('seat_label', seatLabel)

    let referralCode: string | null = null
    if (updatedCode.registration_id) {
      const { data: registration } = await supabaseAdmin
        .from('registrations')
        .select('referral_code')
        .eq('id', updatedCode.registration_id)
        .maybeSingle()
      referralCode = registration?.referral_code ?? null
    }

    return NextResponse.json({
      prizeType: updatedCode.prize_type,
      seatLabel,
      referralCode,
    })
  } catch (err) {
    console.error('[reveal-prize] Error:', err)
    return NextResponse.json(
      { error: 'Neočekávaná chyba serveru.' },
      { status: 500 }
    )
  }
}
