import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const authError = verifyAdmin(request)
  if (authError) return authError

  const { data, error } = await supabaseAdmin
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[admin/registrations] GET error:', error)
    return NextResponse.json({ error: 'Chyba při načítání registrací.' }, { status: 500 })
  }

  return NextResponse.json({ registrations: data })
}
