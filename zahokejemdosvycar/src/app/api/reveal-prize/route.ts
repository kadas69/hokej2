import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { codeId } = await request.json()

    if (!codeId) {
      return NextResponse.json(
        { error: 'Chybí kód.' },
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

    const { error: updateError } = await supabaseAdmin
      .from('codes')
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
      })
      .eq('id', codeId)

    if (updateError) {
      console.error('[reveal-prize] Update code error:', updateError)
      return NextResponse.json(
        { error: 'Nepodařilo se aktualizovat kód.' },
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
