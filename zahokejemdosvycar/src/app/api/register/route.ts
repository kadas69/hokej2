import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { resend, EMAIL_FROM } from '@/lib/resend'
import { buildCodeEmailHtml, buildCodeEmailSubject } from '@/lib/email-templates'

const REFERRAL_CODE_LENGTH = 8
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateReferralCode(): string {
  return Array.from(
    { length: REFERRAL_CODE_LENGTH },
    () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  ).join('')
}

function generateCode(): string {
  const part = () =>
    Array.from({ length: 4 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('')
  return `HOKEJ-${part()}-${part()}`
}

export async function POST(request: Request) {
  let step = 'parsing-body'

  try {
    const body = await request.json()
    const {
      first_name,
      last_name,
      email,
      phone,
      birth_date,
      question_id,
      selected_answer,
      gdpr_consent,
      terms_consent,
      referred_by,
    } = body

    console.log('[register] Received:', {
      first_name,
      last_name,
      email,
      phone,
      birth_date,
      question_id,
      selected_answer,
      gdpr_consent,
      terms_consent,
      referred_by,
    })

    step = 'validating-fields'

    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
      !birth_date ||
      !question_id ||
      selected_answer === undefined ||
      selected_answer === null ||
      !gdpr_consent ||
      !terms_consent
    ) {
      const missing = {
        first_name: !first_name,
        last_name: !last_name,
        email: !email,
        phone: !phone,
        birth_date: !birth_date,
        question_id: !question_id,
        selected_answer: selected_answer === undefined || selected_answer === null,
        gdpr_consent: !gdpr_consent,
        terms_consent: !terms_consent,
      }
      console.log('[register] Missing fields:', missing)
      return NextResponse.json(
        { error: 'Vyplňte prosím všechna povinná pole.' },
        { status: 400 }
      )
    }

    if (first_name.trim().length < 2 || last_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Jméno a příjmení musí mít alespoň 2 znaky.' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Zadejte platnou e-mailovou adresu.' },
        { status: 400 }
      )
    }

    const cleanPhone = phone.replace(/\s/g, '')
    if (!/^(\+420)?\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Zadejte platné 9místné telefonní číslo.' },
        { status: 400 }
      )
    }
    const normalizedPhone = cleanPhone.startsWith('+420') ? cleanPhone : `+420${cleanPhone}`

    const parsedDate = new Date(birth_date)
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: 'Neplatné datum narození.' },
        { status: 400 }
      )
    }
    const age = Math.floor(
      (Date.now() - parsedDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    )
    if (age < 18) {
      return NextResponse.json(
        { error: 'Musíte být starší 18 let.' },
        { status: 400 }
      )
    }

    step = 'fetching-question'
    console.log('[register] Fetching question:', question_id)
    const { data: question, error: qError } = await supabaseAdmin
      .from('questions')
      .select('correct_option_index')
      .eq('id', question_id)
      .single()

    console.log('[register] Question result:', { question, error: qError?.message })

    if (qError || !question) {
      return NextResponse.json(
        { error: 'Soutěžní otázka nebyla nalezena.' },
        { status: 400 }
      )
    }

    const isCorrect = question.correct_option_index === selected_answer
    console.log('[register] Answer check:', {
      correct_index: question.correct_option_index,
      selected: selected_answer,
      isCorrect,
    })

    if (!isCorrect) {
      return NextResponse.json(
        { error: 'Nesprávná odpověď, zkuste to znovu.' },
        { status: 400 }
      )
    }

    const normalizedReferralSource =
      typeof referred_by === 'string' ? referred_by.trim().toUpperCase() : null
    if (normalizedReferralSource && !/^[A-Z0-9]{8}$/.test(normalizedReferralSource)) {
      return NextResponse.json(
        { error: 'Referral odkaz není platný.' },
        { status: 400 }
      )
    }

    let validReferralSource: string | null = null
    if (normalizedReferralSource) {
      step = 'validating-referral-source'
      const { data: referralOwner, error: referralOwnerError } = await supabaseAdmin
        .from('registrations')
        .select('id')
        .eq('referral_code', normalizedReferralSource)
        .maybeSingle()

      if (!referralOwnerError && referralOwner) {
        validReferralSource = normalizedReferralSource
      }
    }

    step = 'inserting-registration'
    const baseInsertPayload = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim().toLowerCase(),
      phone: normalizedPhone,
      birth_date,
      question_id,
      selected_answer,
      is_correct: isCorrect,
      gdpr_consent,
      terms_consent,
      referred_by: validReferralSource,
    }
    console.log('[register] Inserting:', baseInsertPayload)

    let registration: { id: string; email: string; first_name: string; referral_code: string } | null = null
    let insertError: { message: string; code?: string; details?: string | null; hint?: string | null } | null = null

    for (let attempt = 0; attempt < 10; attempt++) {
      const referralCode = generateReferralCode()
      const { data, error } = await supabaseAdmin
        .from('registrations')
        .insert({ ...baseInsertPayload, referral_code: referralCode })
        .select('id, email, first_name, referral_code')
        .single()

      if (!error && data) {
        registration = data
        insertError = null
        break
      }

      insertError = error
      if (
        error?.code === '23505' &&
        (error.message.includes('referral_code') || error.details?.includes('referral_code'))
      ) {
        continue
      }
      break
    }

    if (insertError || !registration) {
      console.error('[register] Insert error:', {
        message: insertError?.message,
        code: insertError?.code,
        details: insertError?.details,
        hint: insertError?.hint,
      })
      if (insertError?.code === '23505' && insertError.message.includes('email')) {
        return NextResponse.json(
          { error: 'Tento e-mail je již registrován.' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: `Chyba při ukládání: ${insertError?.message ?? 'neznámá chyba'}` },
        { status: 500 }
      )
    }

    // Generate a new code and atomically assign a prize via DB function
    step = 'assigning-code'
    const newCode = generateCode()
    console.log('[register] Generated code:', newCode)

    const { data: prizeType, error: rpcError } = await supabaseAdmin.rpc(
      'assign_prize_and_create_code',
      { p_registration_id: registration.id, p_code: newCode }
    )

    if (rpcError || !prizeType) {
      console.error('[register] Prize assignment error:', rpcError?.message)
      return NextResponse.json({ success: true, warning: 'Nepodařilo se přiřadit kód.' })
    }

    const availableCode = { code: newCode, prize_type: prizeType as string }
    console.log('[register] Code assigned:', availableCode.code, '| Prize:', availableCode.prize_type)

    // Send confirmation email with the code
    step = 'sending-email'
    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: registration.email,
        subject: buildCodeEmailSubject(),
        html: buildCodeEmailHtml({
          firstName: registration.first_name,
          code: availableCode.code,
        }),
      })
      console.log('[register] Email sent to:', registration.email)
    } catch (emailErr) {
      console.error('[register] Email send failed:', emailErr)
    }

    console.log('[register] Success!')
    return NextResponse.json({
      success: true,
      referralCode: registration.referral_code,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[register] Exception at step "${step}":`, message)
    return NextResponse.json(
      { error: `Chyba serveru (${step}): ${message}` },
      { status: 500 }
    )
  }
}
