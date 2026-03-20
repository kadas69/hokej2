'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Loader2,
  Plus,
  Trash2,
  RefreshCw,
  Download,
  LogIn,
  ShieldCheck,
} from 'lucide-react'
import type { Question, Registration, Code, Winner } from '@/lib/types'
import { PRIZE_LIMITS, WINNERS_TOTAL_SLOTS } from '@/lib/types'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    try {
      const res = await fetch('/api/admin/questions', {
        headers: {
          Authorization: `Basic ${btoa(`admin:${password}`)}`,
        },
      })
      if (res.status === 401) {
        setAuthError('Nesprávné heslo.')
        return
      }
      setAuthed(true)
    } catch {
      setAuthError('Chyba připojení.')
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light px-6">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm space-y-4">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-hockey-blue/10 mb-3">
              <ShieldCheck className="w-7 h-7 text-hockey-blue" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">Admin Panel</h1>
          </div>
          <div>
            <Label htmlFor="password">Heslo</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          {authError && <p className="text-destructive text-sm">{authError}</p>}
          <Button type="submit" className="w-full bg-hockey-blue hover:bg-hockey-blue/90 text-white cursor-pointer">
            <LogIn className="w-4 h-4 mr-2" />
            Přihlásit
          </Button>
        </form>
      </div>
    )
  }

  return <AdminDashboard password={password} onAuthError={() => { setAuthed(false); setAuthError('Nesprávné heslo.') }} />
}

function AdminDashboard({ password, onAuthError }: { password: string; onAuthError: () => void }) {
  const [tab, setTab] = useState<'questions' | 'codes' | 'registrations' | 'winners'>('questions')

  const authedFetch = useCallback(async (url: string, options?: RequestInit) => {
    const authHeaders = {
      Authorization: `Basic ${btoa(`admin:${password}`)}`,
      'Content-Type': 'application/json',
    }
    const res = await fetch(url, {
      ...options,
      headers: { ...authHeaders, ...options?.headers },
    })
    if (res.status === 401) {
      onAuthError()
      throw new Error('Unauthorized')
    }
    return res
  }, [password, onAuthError])

  const tabs = [
    { id: 'questions' as const, label: 'Otázky' },
    { id: 'codes' as const, label: 'Kódy' },
    { id: 'registrations' as const, label: 'Registrace' },
    { id: 'winners' as const, label: 'Výherci' },
  ]

  return (
    <div className="min-h-screen bg-bg-light">
      <header className="bg-text-primary text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold">Admin — Za hokejem do Švýcar</h1>
          <a href="/" className="text-white/60 hover:text-white text-sm">
            ← Zpět na web
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                tab === t.id
                  ? 'bg-hockey-blue text-white'
                  : 'bg-white text-text-secondary hover:bg-gray-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'questions' && <QuestionsTab authedFetch={authedFetch} />}
        {tab === 'codes' && <CodesTab authedFetch={authedFetch} />}
        {tab === 'registrations' && <RegistrationsTab authedFetch={authedFetch} />}
        {tab === 'winners' && <WinnersTab authedFetch={authedFetch} />}
      </div>
    </div>
  )
}

type AuthedFetch = (url: string, options?: RequestInit) => Promise<Response>

function QuestionsTab({ authedFetch }: { authedFetch: AuthedFetch }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formText, setFormText] = useState('')
  const [formOptions, setFormOptions] = useState(['', '', ''])
  const [formCorrect, setFormCorrect] = useState(0)
  const [formActive, setFormActive] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await authedFetch('/api/admin/questions')
      const data = await res.json()
      setQuestions(data.questions || [])
    } catch { /* auth redirect */ }
    setLoading(false)
  }, [authedFetch])

  useEffect(() => { load() }, [load])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await authedFetch('/api/admin/questions', {
        method: 'POST',
        body: JSON.stringify({
          question_text: formText,
          options: formOptions.filter(Boolean),
          correct_option_index: formCorrect,
          is_active: formActive,
        }),
      })
      setShowForm(false)
      setFormText('')
      setFormOptions(['', '', ''])
      setFormCorrect(0)
      setFormActive(false)
      load()
    } catch { /* auth redirect */ }
    setSaving(false)
  }

  async function toggleActive(q: Question) {
    await authedFetch('/api/admin/questions', {
      method: 'PUT',
      body: JSON.stringify({ id: q.id, is_active: !q.is_active }),
    })
    load()
  }

  async function deleteQuestion(id: string) {
    if (!confirm('Opravdu smazat otázku?')) return
    await authedFetch(`/api/admin/questions?id=${id}`, { method: 'DELETE' })
    load()
  }

  if (loading) return <LoadingState />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">Soutěžní otázky ({questions.length})</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} className="cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="bg-hockey-blue hover:bg-hockey-blue/90 text-white cursor-pointer">
            <Plus className="w-4 h-4 mr-1" /> Nová otázka
          </Button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <Label>Text otázky</Label>
            <Input value={formText} onChange={(e) => setFormText(e.target.value)} className="mt-1" />
          </div>
          <div className="space-y-2">
            <Label>Odpovědi</Label>
            {formOptions.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  checked={formCorrect === i}
                  onChange={() => setFormCorrect(i)}
                  className="accent-green-600"
                />
                <Input
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...formOptions]
                    newOpts[i] = e.target.value
                    setFormOptions(newOpts)
                  }}
                  placeholder={`Odpověď ${i + 1}`}
                />
              </div>
            ))}
            <p className="text-xs text-text-secondary">Zelený radio = správná odpověď</p>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={formActive} onCheckedChange={(v) => setFormActive(v === true)} />
            <Label>Aktivní (zobrazí se na webu)</Label>
          </div>
          <Button type="submit" disabled={saving} className="bg-kaufland hover:bg-kaufland/90 text-white cursor-pointer">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Vytvořit otázku
          </Button>
        </form>
      )}

      <div className="space-y-2">
        {questions.map((q) => (
          <div key={q.id} className={`bg-white rounded-xl p-4 shadow-sm flex items-start justify-between gap-4 ${q.is_active ? 'ring-2 ring-green-500' : ''}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {q.is_active && (
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    Aktivní
                  </span>
                )}
                <p className="font-semibold text-text-primary truncate">{q.question_text}</p>
              </div>
              <div className="text-sm text-text-secondary space-y-0.5">
                {q.options.map((opt: string, i: number) => (
                  <p key={i}>
                    {i === q.correct_option_index ? '✅' : '○'} {opt}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="outline" size="sm" onClick={() => toggleActive(q)} className="cursor-pointer text-xs">
                {q.is_active ? 'Deaktivovat' : 'Aktivovat'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => deleteQuestion(q.id)} className="cursor-pointer text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CodesTab({ authedFetch }: { authedFetch: AuthedFetch }) {
  const [codes, setCodes] = useState<Code[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [counts, setCounts] = useState({
    main_trip: PRIZE_LIMITS.main_trip,
    prima_voucher: PRIZE_LIMITS.prima_voucher,
    kaufland_voucher: PRIZE_LIMITS.kaufland_voucher,
    merch: PRIZE_LIMITS.merch,
    no_prize: 0,
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await authedFetch('/api/admin/generate-codes')
      const data = await res.json()
      setCodes(data.codes || [])
    } catch { /* auth redirect */ }
    setLoading(false)
  }, [authedFetch])

  useEffect(() => { load() }, [load])

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setGenerating(true)
    try {
      await authedFetch('/api/admin/generate-codes', {
        method: 'POST',
        body: JSON.stringify(counts),
      })
      load()
    } catch { /* auth redirect */ }
    setGenerating(false)
  }

  const usedCount = codes.filter((c) => c.is_used).length
  const assigned = {
    main_trip: codes.filter((c) => c.prize_type === 'main_trip' && c.registration_id).length,
    prima_voucher: codes.filter((c) => c.prize_type === 'prima_voucher' && c.registration_id).length,
    kaufland_voucher: codes.filter((c) => c.prize_type === 'kaufland_voucher' && c.registration_id).length,
    merch: codes.filter((c) => c.prize_type === 'merch' && c.registration_id).length,
    no_prize: codes.filter((c) => c.prize_type === 'no_prize').length,
  }

  if (loading) return <LoadingState />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">
          Kódy ({codes.length} celkem, {usedCount} použitých)
        </h2>
        <Button variant="outline" size="sm" onClick={load} className="cursor-pointer">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Prize assignment statistics */}
      <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="font-semibold text-text-primary text-sm">Stav výher (přiděleno / limit)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(PRIZE_LIMITS) as (keyof typeof PRIZE_LIMITS)[]).map((type) => {
            const count = assigned[type]
            const limit = PRIZE_LIMITS[type]
            const full = count >= limit
            return (
              <div key={type} className={`rounded-xl p-4 text-center border-2 ${full ? 'border-red-300 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                <p className={`text-2xl font-bold ${full ? 'text-red-600' : 'text-green-700'}`}>
                  {count} <span className="text-base font-normal text-text-secondary">/ {limit}</span>
                </p>
                <p className="text-xs text-text-secondary mt-1">{type.replace(/_/g, ' ')}</p>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-text-secondary">
          Bez výhry (no_prize): <strong>{assigned.no_prize}</strong>
        </p>
      </div>

      {/* Generate form — legacy, only for test/seed purposes */}
      <form onSubmit={handleGenerate} className="bg-white rounded-xl p-6 shadow-sm space-y-4 border border-dashed border-gray-300">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-text-primary">Generovat kódy (legacy)</h3>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            Kódy se nyní generují automaticky při registraci
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(counts) as (keyof typeof counts)[]).map((key) => (
            <div key={key}>
              <Label className="text-xs">{key.replace('_', ' ')}</Label>
              <Input
                type="number"
                min={0}
                value={counts[key]}
                onChange={(e) => setCounts({ ...counts, [key]: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
          ))}
        </div>
        <Button type="submit" disabled={generating} className="bg-kaufland hover:bg-kaufland/90 text-white cursor-pointer">
          {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Generovat kódy
        </Button>
      </form>

      {/* Codes table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Kód</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Typ výhry</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Stav</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Sedadlo</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {codes.slice(0, 50).map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{c.code}</td>
                  <td className="px-4 py-3">{c.prize_type.replace('_', ' ')}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.is_used ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {c.is_used ? 'Použitý' : 'Volný'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{c.seat_number || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {codes.length > 50 && (
          <p className="text-center text-xs text-text-secondary py-3">
            Zobrazeno 50 z {codes.length} kódů
          </p>
        )}
      </div>
    </div>
  )
}

function RegistrationsTab({ authedFetch }: { authedFetch: AuthedFetch }) {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await authedFetch('/api/admin/registrations')
      const data = await res.json()
      setRegistrations(data.registrations || [])
    } catch { /* auth redirect */ }
    setLoading(false)
  }, [authedFetch])

  useEffect(() => { load() }, [load])

  function exportCSV() {
    const headers = [
      'Jméno',
      'Příjmení',
      'E-mail',
      'Telefon',
      'Datum narození',
      'Správná odpověď',
      'Referral kód',
      'Přišel přes referral',
      'Vytvořeno',
    ]
    const rows = registrations.map((r) => [
      r.first_name,
      r.last_name,
      r.email,
      r.phone,
      r.birth_date,
      r.is_correct ? 'Ano' : 'Ne',
      r.referral_code || '',
      r.referred_by || '',
      new Date(r.created_at).toLocaleString('cs-CZ'),
    ])

    const escapeCSV = (v: string) => `"${String(v).replace(/"/g, '""')}"`
    const csv = [headers, ...rows].map((row) => row.map(escapeCSV).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `registrace-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <LoadingState />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">Registrace ({registrations.length})</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} className="cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV} className="cursor-pointer">
            <Download className="w-4 h-4 mr-1" /> CSV
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Jméno</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">E-mail</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Telefon</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Odpověď</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Referral</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {registrations.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{r.first_name} {r.last_name}</td>
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3">{r.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.is_correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {r.is_correct ? 'Správná' : 'Špatná'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary">
                    <div>Kód: {r.referral_code || '—'}</div>
                    <div>Přes: {r.referred_by || '—'}</div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {new Date(r.created_at).toLocaleString('cs-CZ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function WinnersTab({ authedFetch }: { authedFetch: AuthedFetch }) {
  const [winners, setWinners] = useState<Winner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formSlot, setFormSlot] = useState(1)
  const [formFirstName, setFormFirstName] = useState('')
  const [formLastName, setFormLastName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await authedFetch('/api/admin/winners')
      const data = await res.json()
      setWinners(data.winners || [])
    } catch { /* auth redirect */ }
    setLoading(false)
  }, [authedFetch])

  useEffect(() => { load() }, [load])

  const occupiedSlots = new Set(winners.map((w) => w.slot_number))
  const availableSlots = Array.from({ length: WINNERS_TOTAL_SLOTS }, (_, i) => i + 1).filter(
    (s) => !occupiedSlots.has(s)
  )

  // Auto-select first available slot when form opens
  useEffect(() => {
    if (showForm) {
      const occupied = new Set(winners.map((w) => w.slot_number))
      const first = Array.from({ length: WINNERS_TOTAL_SLOTS }, (_, i) => i + 1).find((s) => !occupied.has(s))
      if (first !== undefined) setFormSlot(first)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await authedFetch('/api/admin/winners', {
        method: 'POST',
        body: JSON.stringify({
          slot_number: formSlot,
          first_name: formFirstName,
          last_name: formLastName,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Chyba při vytváření.')
        setSaving(false)
        return
      }
      setShowForm(false)
      setFormFirstName('')
      setFormLastName('')
      load()
    } catch { /* auth redirect */ }
    setSaving(false)
  }

  async function deleteWinner(id: string) {
    if (!confirm('Opravdu odebrat výherce?')) return
    await authedFetch(`/api/admin/winners?id=${id}`, { method: 'DELETE' })
    load()
  }

  if (loading) return <LoadingState />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">
          Výherní listina ({winners.length} / {WINNERS_TOTAL_SLOTS})
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} className="cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </Button>
          {availableSlots.length > 0 && (
            <Button size="sm" onClick={() => setShowForm(!showForm)} className="bg-hockey-blue hover:bg-hockey-blue/90 text-white cursor-pointer">
              <Plus className="w-4 h-4 mr-1" /> Přidat výherce
            </Button>
          )}
        </div>
      </div>

      {/* Progress overview */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">Zveřejněno</span>
          <span className="text-sm font-bold text-text-primary">{winners.length} / {WINNERS_TOTAL_SLOTS}</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-hockey-blue transition-all duration-500"
            style={{ width: `${(winners.length / WINNERS_TOTAL_SLOTS) * 100}%` }}
          />
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-text-primary">Nový výherce</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Slot</Label>
              <select
                value={formSlot}
                onChange={(e) => setFormSlot(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                {availableSlots.map((s) => (
                  <option key={s} value={s}>Slot #{s}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Jméno</Label>
              <Input value={formFirstName} onChange={(e) => setFormFirstName(e.target.value)} className="mt-1" placeholder="Jan" />
            </div>
            <div>
              <Label>Příjmení</Label>
              <Input value={formLastName} onChange={(e) => setFormLastName(e.target.value)} className="mt-1" placeholder="Novák" />
            </div>
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" disabled={saving || !formFirstName || !formLastName} className="bg-kaufland hover:bg-kaufland/90 text-white cursor-pointer">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Přidat výherce
          </Button>
        </form>
      )}

      {/* Slots grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: WINNERS_TOTAL_SLOTS }, (_, i) => {
          const slotNum = i + 1
          const winner = winners.find((w) => w.slot_number === slotNum)
          return (
            <div
              key={slotNum}
              className={`bg-white rounded-xl p-4 shadow-sm flex items-center justify-between gap-3 ${
                winner ? 'ring-2 ring-green-400' : 'border border-dashed border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  winner ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  {slotNum}
                </div>
                {winner ? (
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary text-sm truncate">
                      {winner.first_name} {winner.last_name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {new Date(winner.revealed_at).toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Prázdný slot</p>
                )}
              </div>
              {winner && (
                <Button variant="outline" size="sm" onClick={() => deleteWinner(winner.id)} className="cursor-pointer text-destructive shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-hockey-blue animate-spin" />
    </div>
  )
}
