'use client'

import { motion } from 'framer-motion'

interface SeatMapSeatProps {
  label: string
  isSelected: boolean
  onClick: () => void
}

export function SeatMapSeat({ label, isSelected, onClick }: SeatMapSeatProps) {
  const col = label.replace(/\d+/g, '') // A, B, C, D

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.15, y: -1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="relative focus:outline-none rounded-md transition-colors duration-150"
      style={{
        width: 28,
        height: 28,
        cursor: 'pointer',
        backgroundColor: isSelected ? 'rgba(209, 10, 16, 0.85)' : 'rgba(255, 255, 255, 0.12)',
        border: isSelected ? '1.5px solid #D10A10' : '1.5px solid rgba(255, 255, 255, 0.22)',
        boxShadow: isSelected
          ? '0 0 12px rgba(209, 10, 16, 0.5), inset 0 1px 1px rgba(255,255,255,0.1)'
          : 'inset 0 1px 1px rgba(255,255,255,0.08)',
      }}
      aria-label={`Sedadlo ${label}`}
      title={`Sedadlo ${label}`}
    >
      <span
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        style={{
          fontSize: '10px',
          fontWeight: 700,
          color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
          letterSpacing: '0.02em',
        }}
      >
        {col}
      </span>
    </motion.button>
  )
}
