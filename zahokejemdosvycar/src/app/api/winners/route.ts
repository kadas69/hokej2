import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('winners')
    .select('slot_number, first_name, last_name, revealed_at')
    .order('slot_number', { ascending: true })

  if (error) {
    console.error('[winners] GET error:', error)
    return NextResponse.json({ error: 'Chyba při načítání výherců.' }, { status: 500 })
  }

  return NextResponse.json({ winners: data })
}
