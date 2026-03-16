'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Loader2, AlertCircle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import type { Question } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { IceSkate, HockeyStick } from '@/components/DecorativeIcons'

interface FormErrors {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  birth_date?: string
  selected_answer?: string
  gdpr_consent?: string
  terms_consent?: string
}

export function RegistrationForm() {
  const [question, setQuestion] = useState<Question | null>(null)
  const [questionLoading, setQuestionLoading] = useState(true)
  const [noActiveQuestion, setNoActiveQuestion] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [gdprConsent, setGdprConsent] = useState(false)
  const [termsConsent, setTermsConsent] = useState(false)
  const [referredBy, setReferredBy] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('questions')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (data) {
          setQuestion(data as Question)
        } else if (error) {
          setNoActiveQuestion(true)
        }
        setQuestionLoading(false)
      })
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')?.trim().toUpperCase()
    if (ref && /^[A-Z0-9]{8}$/.test(ref)) {
      setReferredBy(ref)
    }
  }, [])

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (firstName.trim().length < 2) errs.first_name = 'Jméno musí mít alespoň 2 znaky'
    if (lastName.trim().length < 2) errs.last_name = 'Příjmení musí mít alespoň 2 znaky'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Zadejte platnou e-mailovou adresu'
    const cleanPhone = phone.replace(/\s/g, '')
    if (!/^(\+420)?\d{9}$/.test(cleanPhone)) errs.phone = 'Zadejte 9místné telefonní číslo'

    if (!birthDate) {
      errs.birth_date = 'Vyplňte datum narození'
    } else {
      const age = Math.floor(
        (Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      )
      if (age < 18) errs.birth_date = 'Musíte být starší 18 let'
    }

    if (question && selectedAnswer === null) {
      errs.selected_answer = 'Vyberte odpověď na soutěžní otázku'
    }
    if (!gdprConsent) errs.gdpr_consent = 'Musíte souhlasit se zpracováním osobních údajů'
    if (!termsConsent) errs.terms_consent = 'Musíte souhlasit s podmínkami soutěže'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError('')
    setErrors({})

    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.replace(/\s/g, '').replace(/^(?!\+420)(\d{9})$/, '+420$1'),
          birth_date: birthDate,
          question_id: question?.id,
          selected_answer: selectedAnswer,
          gdpr_consent: gdprConsent,
          terms_consent: termsConsent,
          referred_by: referredBy,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setServerError(data.error || 'Něco se pokazilo, zkuste to prosím znovu.')
        return
      }
      setSuccess(true)
    } catch {
      setServerError('Chyba připojení. Zkuste to prosím znovu.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <section id="registration" className="relative z-10 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto px-6"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl shadow-black/10 border border-white/30 p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-[#1A1A2E] mb-4">Registrace úspěšná!</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Děkujeme za registraci. Na váš e-mail zašleme unikátní kód, se kterým si budete moci
              vybrat sedadlo v letadle a odhalit svou výhru.
            </p>
          </div>
        </motion.div>
      </section>
    )
  }

  return (
    <section id="registration" className="relative z-10 py-16 md:py-24 overflow-hidden">
      {/* Decorative icons */}
      <IceSkate className="w-28 md:w-36 opacity-50 rotate-12 -left-4 top-24 hidden md:block" />
      <HockeyStick className="w-20 md:w-28 opacity-50 -rotate-12 right-8 bottom-20 hidden md:block" />

      <div className="max-w-xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl shadow-black/10 border border-white/30 p-8 md:p-10"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#D10A10]/10 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D10A10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] mb-2">
              Zaregistrujte se
            </h2>
            <p className="text-gray-500">
              Vyplňte formulář a zapojte se do soutěže o skvělé ceny
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">Jméno *</Label>
                <Input
                  id="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jan"
                  className="mt-1.5 bg-white"
                />
                <FieldError message={errors.first_name} />
              </div>
              <div>
                <Label htmlFor="last_name">Příjmení *</Label>
                <Input
                  id="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Novák"
                  className="mt-1.5 bg-white"
                />
                <FieldError message={errors.last_name} />
              </div>
            </div>

            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jan.novak@email.cz"
                className="mt-1.5 bg-white"
              />
              <FieldError message={errors.email} />
            </div>

            <div>
              <Label htmlFor="phone">Telefon *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="123 456 789"
                className="mt-1.5 bg-white"
              />
              <FieldError message={errors.phone} />
            </div>

            <div>
              <Label htmlFor="birth_date">Datum narození *</Label>
              <Input
                id="birth_date"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="mt-1.5 bg-white"
              />
              <FieldError message={errors.birth_date} />
            </div>

            {/* Soutěžní otázka */}
            {questionLoading ? (
              <div className="bg-[#F4F6F8] rounded-xl p-5 flex items-center justify-center gap-2 text-text-secondary text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Načítám soutěžní otázku...
              </div>
            ) : noActiveQuestion ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-center gap-3 text-amber-800 text-sm">
                <Info className="w-5 h-5 shrink-0" />
                <p>Soutěž momentálně neprobíhá. Zkuste to prosím později.</p>
              </div>
            ) : question ? (
              <div className="bg-[#F4F6F8] rounded-xl p-5">
                <Label className="text-base font-semibold mb-3 block">
                  {question.question_text} *
                </Label>
                <div className="space-y-2">
                  {question.options.map((option: string, idx: number) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 transition-all ${
                        selectedAnswer === idx
                          ? 'border-[#010D5D] bg-[#010D5D]/5 shadow-sm'
                          : 'border-transparent hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={idx}
                        checked={selectedAnswer === idx}
                        onChange={() => setSelectedAnswer(idx)}
                        className="w-4 h-4 accent-[#010D5D]"
                      />
                      <span className="text-text-primary">{option}</span>
                    </label>
                  ))}
                </div>
                <FieldError message={errors.selected_answer} />
              </div>
            ) : null}

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={termsConsent}
                  onCheckedChange={(v) => setTermsConsent(v === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="terms" className="text-sm text-text-secondary leading-relaxed cursor-pointer">
                  Souhlasím s{' '}
                  <a href="/pravidla" target="_blank" className="text-[#D10A10] underline">
                    podmínkami soutěže
                  </a>{' '}
                  *
                </Label>
              </div>
              <FieldError message={errors.terms_consent} />

              <div className="flex items-start gap-3">
                <Checkbox
                  id="gdpr"
                  checked={gdprConsent}
                  onCheckedChange={(v) => setGdprConsent(v === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="gdpr" className="text-sm text-text-secondary leading-relaxed cursor-pointer">
                  Souhlasím se zpracováním osobních údajů *
                </Label>
              </div>
              <FieldError message={errors.gdpr_consent} />
            </div>

            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-destructive bg-destructive/10 rounded-lg px-4 py-3 text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {serverError}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={loading || noActiveQuestion}
              size="lg"
              className="w-full bg-[#D10A10] hover:bg-[#D10A10]/90 text-white text-base py-6 rounded-xl shadow-lg shadow-[#D10A10]/20 cursor-pointer transition-all hover:shadow-xl hover:shadow-[#D10A10]/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Odesílám...
                </span>
              ) : (
                'Odeslat registraci'
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-destructive text-sm mt-1">{message}</p>
}
