import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    console.log('[verify-code] Received code:', JSON.stringify(code))

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Zadejte kód.' },
        { status: 400 }
      )
    }

    const normalizedCode = code.trim().toUpperCase()
    console.log('[verify-code] Normalized:', normalizedCode)

    const { data, error } = await supabaseAdmin
      .from('codes')
      .select('id, is_used, code')
      .eq('code', normalizedCode)
      .single()

    console.log('[verify-code] Supabase response:', { data, error: error?.message })

    if (error || !data) {
      return NextResponse.json(
        { error: 'Neplatný kód.' },
        { status: 404 }
      )
    }

    if (data.is_used) {
      return NextResponse.json(
        { error: 'Tento kód již byl použit.' },
        { status: 409 }
      )
    }

    return NextResponse.json({ valid: true, codeId: data.id })
  } catch (err) {
    console.error('[verify-code] Error:', err)
    return NextResponse.json(
      { error: 'Neočekávaná chyba serveru.' },
      { status: 500 }
    )
  }
}
