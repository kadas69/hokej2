import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const authError = verifyAdmin(request)
  if (authError) return authError

  const { data, error } = await supabaseAdmin
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[admin/questions] GET error:', error)
    return NextResponse.json({ error: 'Chyba při načítání otázek.' }, { status: 500 })
  }

  return NextResponse.json({ questions: data })
}

export async function POST(request: NextRequest) {
  const authError = verifyAdmin(request)
  if (authError) return authError

  const body = await request.json()
  const { question_text, options, correct_option_index, is_active } = body

  if (!question_text || !options || correct_option_index === undefined) {
    return NextResponse.json({ error: 'Vyplňte všechna pole.' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('questions')
    .insert({ question_text, options, correct_option_index, is_active: is_active ?? false })
    .select()
    .single()

  if (error) {
    console.error('[admin/questions] POST error:', error)
    return NextResponse.json({ error: 'Chyba při vytváření otázky.' }, { status: 500 })
  }

  return NextResponse.json({ question: data })
}

export async function PUT(request: NextRequest) {
  const authError = verifyAdmin(request)
  if (authError) return authError

  const body = await request.json()
  const { id, question_text, options, correct_option_index, is_active } = body

  if (!id) {
    return NextResponse.json({ error: 'Chybí ID otázky.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('questions')
    .update({
      question_text,
      options,
      correct_option_index,
      is_active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('[admin/questions] PUT error:', error)
    return NextResponse.json({ error: 'Chyba při aktualizaci otázky.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const authError = verifyAdmin(request)
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Chybí ID otázky.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('questions').delete().eq('id', id)

  if (error) {
    console.error('[admin/questions] DELETE error:', error)
    return NextResponse.json({ error: 'Chyba při mazání otázky.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
