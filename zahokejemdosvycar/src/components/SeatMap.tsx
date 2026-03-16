'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { SeatMapSeat } from './SeatMapSeat'
import { Button } from '@/components/ui/button'

interface SeatMapProps {
  codeId: string
  onSeatClaimed: (prizeType: string, seatLabel: string, referralCode: string | null) => void
}

// 101 seats: rows 1-25 with cols A-D (100), row 26 with col A only (1)
const ROWS = Array.from({ length: 26 }, (_, i) => i + 1)
const COLS = ['A', 'B', 'C', 'D']

function getSeatLabelsForRow(row: number): string[] {
  if (row === 26) return ['26A']
  return COLS.map((col) => `${row}${col}`)
}

export function SeatMap({ codeId, onSeatClaimed }: SeatMapProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [claiming, setClaiming] = useState(false)
  const [error, setError] = useState('')

  async function handleReveal() {
    if (!selected) return
    setClaiming(true)
    setError('')

    try {
      const res = await fetch('/api/reveal-prize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeId }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Nepodařilo se odhalit výhru.')
        return
      }
      onSeatClaimed(data.prizeType, selected, data.referralCode ?? null)
    } catch {
      setError('Chyba připojení.')
    } finally {
      setClaiming(false)
    }
  }

  // Wing config — wings appear around rows 7-17
  const WING_START_ROW = 7
  const WING_END_ROW = 17

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Vyberte si sedadlo</h2>
        <p className="text-white/50 text-sm">Klikněte na sedadlo a odhalte svou výhru</p>
      </div>

      {/* Airplane container */}
      <div className="relative flex justify-center">
        {/* The airplane body */}
        <div className="relative">
          {/* Nose / cockpit */}
          <div
            className="mx-auto relative"
            style={{
              width: 200,
              height: 60,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              borderLeft: '1px solid rgba(255,255,255,0.15)',
              borderRight: '1px solid rgba(255,255,255,0.15)',
              borderTop: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50% 50% 0 0',
            }}
          >
            {/* Cockpit windows */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="w-4 h-2 rounded-full bg-white/10 border border-white/15" />
              <div className="w-4 h-2 rounded-full bg-white/10 border border-white/15" />
            </div>
          </div>

          {/* Fuselage with seats */}
          <div
            className="relative mx-auto overflow-visible"
            style={{
              width: 200,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.05) 100%)',
              borderLeft: '1px solid rgba(255,255,255,0.15)',
              borderRight: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {/* Window dots along the sides */}
            {ROWS.map((row, idx) => (
              <div key={`windows-${row}`}>
                {/* Left window */}
                <div
                  className="absolute w-1.5 h-2.5 rounded-full bg-white/5 border border-white/8"
                  style={{
                    left: -1,
                    top: idx * 38 + 14,
                    transform: 'translateX(-50%)',
                  }}
                />
                {/* Right window */}
                <div
                  className="absolute w-1.5 h-2.5 rounded-full bg-white/5 border border-white/8"
                  style={{
                    right: -1,
                    top: idx * 38 + 14,
                    transform: 'translateX(50%)',
                  }}
                />
              </div>
            ))}

            {/* Wings */}
            {/* Left wing */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: (WING_START_ROW - 1) * 38 + 20,
                right: '100%',
                width: 140,
                height: (WING_END_ROW - WING_START_ROW + 1) * 38 - 40,
                background: 'linear-gradient(270deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.02) 100%)',
                borderTop: '1px solid rgba(255,255,255,0.2)',
                borderBottom: '1px solid rgba(255,255,255,0.15)',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
                clipPath: 'polygon(100% 0%, 100% 100%, 0% 80%, 0% 30%)',
                transformOrigin: 'right center',
              }}
            >
              {/* Wing stripe */}
              <div
                className="absolute"
                style={{
                  top: '48%',
                  left: 0,
                  right: 0,
                  height: 2,
                  background: 'linear-gradient(270deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                }}
              />
              {/* Engine */}
              <div
                className="absolute"
                style={{
                  top: '35%',
                  left: '30%',
                  width: 16,
                  height: 24,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              />
            </div>

            {/* Right wing */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: (WING_START_ROW - 1) * 38 + 20,
                left: '100%',
                width: 140,
                height: (WING_END_ROW - WING_START_ROW + 1) * 38 - 40,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.02) 100%)',
                borderTop: '1px solid rgba(255,255,255,0.2)',
                borderBottom: '1px solid rgba(255,255,255,0.15)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                clipPath: 'polygon(0% 0%, 0% 100%, 100% 80%, 100% 30%)',
                transformOrigin: 'left center',
              }}
            >
              {/* Wing stripe */}
              <div
                className="absolute"
                style={{
                  top: '48%',
                  left: 0,
                  right: 0,
                  height: 2,
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                }}
              />
              {/* Engine */}
              <div
                className="absolute"
                style={{
                  top: '35%',
                  right: '30%',
                  width: 16,
                  height: 24,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              />
            </div>

            {/* Seat rows */}
            {ROWS.map((row) => {
              const seatLabels = getSeatLabelsForRow(row)
              const isLastRow = row === 26

              return (
                <div
                  key={row}
                  className="flex items-center justify-center py-[5px]"
                  style={{ minHeight: 38 }}
                >
                  {/* Row content */}
                  <div className="flex items-center gap-0">
                    {/* Left seats (A, B) */}
                    <div className="flex gap-1">
                      {seatLabels
                        .filter((l) => {
                          const c = l.replace(/\d+/g, '')
                          return c === 'A' || c === 'B'
                        })
                        .map((label) => (
                          <SeatMapSeat
                            key={label}
                            label={label}
                            isSelected={selected === label}
                            onClick={() => setSelected(label)}
                          />
                        ))}
                    </div>

                    {/* Aisle */}
                    {!isLastRow && <div style={{ width: 20 }} />}

                    {/* Right seats (C, D) */}
                    <div className="flex gap-1">
                      {seatLabels
                        .filter((l) => {
                          const c = l.replace(/\d+/g, '')
                          return c === 'C' || c === 'D'
                        })
                        .map((label) => (
                          <SeatMapSeat
                            key={label}
                            label={label}
                            isSelected={selected === label}
                            onClick={() => setSelected(label)}
                          />
                        ))}
                    </div>
                  </div>

                  {/* Row number */}
                  <span
                    className="absolute select-none pointer-events-none"
                    style={{
                      right: 8,
                      fontSize: '9px',
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {row}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Tail section — narrowing */}
          <div
            className="mx-auto relative"
            style={{
              width: 200,
              height: 50,
              background: 'linear-gradient(0deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.04) 100%)',
              borderLeft: '1px solid rgba(255,255,255,0.15)',
              borderRight: '1px solid rgba(255,255,255,0.15)',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '0 0 40% 40%',
            }}
          />

          {/* Tail fin (vertical stabilizer) */}
          <div className="flex justify-center -mt-2">
            <div
              style={{
                width: 8,
                height: 30,
                background: 'linear-gradient(0deg, rgba(209,10,16,0.4) 0%, rgba(209,10,16,0.15) 100%)',
                borderLeft: '1px solid rgba(255,255,255,0.12)',
                borderRight: '1px solid rgba(255,255,255,0.12)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0 0 2px 2px',
              }}
            />
          </div>

          {/* Horizontal tail wings (stabilizers) */}
          <div className="flex justify-center -mt-3">
            <div
              style={{
                width: 120,
                height: 16,
                background: 'linear-gradient(0deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                borderTop: '1px solid rgba(255,255,255,0.12)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-8 text-xs text-white/50">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-md"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1.5px solid rgba(255, 255, 255, 0.15)',
            }}
          />
          Volné
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-md"
            style={{
              backgroundColor: 'rgba(209, 10, 16, 0.85)',
              border: '1.5px solid #D10A10',
              boxShadow: '0 0 8px rgba(209, 10, 16, 0.4)',
            }}
          />
          Vaše volba
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
      )}

      <div className="mt-6">
        <Button
          onClick={handleReveal}
          disabled={!selected || claiming}
          size="lg"
          className="w-full bg-[#D10A10] hover:bg-[#D10A10]/90 text-white py-6 rounded-xl cursor-pointer disabled:opacity-50 transition-all"
        >
          {claiming ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Odhaluji výhru...
            </span>
          ) : selected ? (
            `Odhalit výhru — sedadlo ${selected}`
          ) : (
            'Vyberte sedadlo'
          )}
        </Button>
      </div>
    </motion.div>
  )
}
