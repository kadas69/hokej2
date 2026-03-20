import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/admin-auth'
import { WINNERS_TOTAL_SLOTS } from '@/lib/types'

export async function GET(request: NextRequest) {
  const authError = verifyAdmin(request)
  if (authError) return authError

  const { data, error } = await supabaseAdmin
    .from('winners')
    .select('*')
    .order('slot_number', { ascending: true })

  if (error) {
    console.error('[admin/winners] GET error:', error)
    return NextResponse.json({ error: 'Chyba při načítání výherců.' }, { status: 500 })
  }

  return NextResponse.json({ winners: data })
}

export async function POST(request: NextRequest) {
  const authError = verifyAdmin(request)
  if (authError) return authError

  const body = await request.json()
  const { slot_number, first_name, last_name } = body

  if (!slot_number || !first_name || !last_name) {
    return NextResponse.json({ error: 'Vyplňte všechna pole.' }, { status: 400 })
  }

  if (slot_number < 1 || slot_number > WINNERS_TOTAL_SLOTS) {
    return NextResponse.json({ error: `Číslo slotu musí být 1–${WINNERS_TOTAL_SLOTS}.` }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('winners')
    .insert({
      slot_number,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      revealed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: `Slot ${slot_number} je již obsazen.` }, { status: 409 })
    }
    console.error('[admin/winners] POST error:', error)
    return NextResponse.json({ error: 'Chyba při vytváření výherce.' }, { status: 500 })
  }

  return NextResponse.json({ winner: data })
}

export async function PUT(request: NextRequest) {
  const authError = verifyAdmin(request)
  if (authError) return authError

  const body = await request.json()
  const { id, first_name, last_name } = body

  if (!id) {
    return NextResponse.json({ error: 'Chybí ID výherce.' }, { status: 400 })
  }

  if (!first_name?.trim() || !last_name?.trim()) {
    return NextResponse.json({ error: 'Vyplňte jméno a příjmení.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('winners')
    .update({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
    })
    .eq('id', id)

  if (error) {
    console.error('[admin/winners] PUT error:', error)
    return NextResponse.json({ error: 'Chyba při aktualizaci výherce.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const authError = verifyAdmin(request)
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Chybí ID výherce.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('winners').delete().eq('id', id)

  if (error) {
    console.error('[admin/winners] DELETE error:', error)
    return NextResponse.json({ error: 'Chyba při mazání výherce.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
