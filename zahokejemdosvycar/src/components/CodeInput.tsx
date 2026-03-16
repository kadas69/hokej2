'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, AlertCircle, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CodeInputProps {
  onVerified: (codeId: string) => void
}

export function CodeInput({ onVerified }: CodeInputProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!code.trim()) {
      setError('Zadejte kód ze svého e-mailu.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Neplatný kód.')
        return
      }
      onVerified(data.codeId)
    } catch {
      setError('Chyba připojení. Zkuste to prosím znovu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl shadow-black/10 border border-white/20 p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D10A10]/20 mb-4">
            <KeyRound className="w-8 h-8 text-[#D10A10]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Zadejte svůj kód</h2>
          <p className="text-white/60">
            Kód jste obdrželi e-mailem po registraci
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="code" className="sr-only">Soutěžní kód</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="HOKEJ-XXXX-XXXX"
              className="text-center text-lg tracking-widest font-mono py-6 bg-white/90 text-[#1A1A2E] border-white/30 focus:border-[#D10A10]"
              autoComplete="off"
            />
            <p className="text-xs text-white/50 text-center mt-2">
              Kód jste obdrželi e-mailem po uzavření registrací
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-destructive bg-destructive/10 rounded-lg px-4 py-3 text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full bg-[#D10A10] hover:bg-[#D10A10]/90 text-white py-6 rounded-xl shadow-lg shadow-[#D10A10]/20 cursor-pointer transition-all hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Ověřuji...
              </span>
            ) : (
              'Ověřit kód'
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  )
}
