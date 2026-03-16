import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const { data: seats, error } = await supabaseAdmin
      .from('seats')
      .select('id, seat_label, is_occupied')
      .order('seat_label')

    if (error) {
      console.error('[seats] Fetch error:', error)
      return NextResponse.json(
        { error: 'Nepodařilo se načíst sedadla.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ seats })
  } catch (err) {
    console.error('[seats] Error:', err)
    return NextResponse.json(
      { error: 'Neočekávaná chyba serveru.' },
      { status: 500 }
    )
  }
}
