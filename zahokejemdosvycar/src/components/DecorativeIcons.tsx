'use client'

import { motion } from 'framer-motion'

interface DecoProps {
  className?: string
  style?: React.CSSProperties
}

const glowStyle = {
  filter: 'drop-shadow(0 0 12px rgba(180, 200, 255, 0.4))',
}

function Wrapper({ className = '', style, children }: DecoProps & { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2 }}
      className={`absolute pointer-events-none select-none ${className}`}
      style={style}
    >
      {children}
    </motion.div>
  )
}

/* ── Boarding Pass / Flight Ticket ─────────────────────────── */
export function BoardingPass({ className, style }: DecoProps) {
  return (
    <Wrapper className={className} style={style}>
      <svg viewBox="0 0 140 80" fill="none" className="w-full h-full" style={glowStyle}>
        {/* Back ticket shadow */}
        <rect x="18" y="4" width="118" height="64" rx="8" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        {/* Main ticket */}
        <rect x="4" y="12" width="118" height="64" rx="8" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        {/* Perforation */}
        <line x1="90" y1="12" x2="90" y2="76" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 3" />
        {/* Airplane */}
        <path d="M22 38 L30 32 L54 40 L30 48 Z" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="30" y1="40" x2="38" y2="44" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="30" y1="40" x2="38" y2="36" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        {/* Text lines */}
        <line x1="24" y1="54" x2="60" y2="54" stroke="rgba(210,50,50,0.2)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="24" y1="60" x2="50" y2="60" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="24" y1="66" x2="55" y2="66" stroke="rgba(210,50,50,0.15)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Barcode */}
        {[0,4,7,10,13,15,18,21,23].map(x => (
          <rect key={x} x={96 + x} y={22} width={x % 3 === 0 ? 2 : 1} height={40} rx={0.5} fill="rgba(255,255,255,0.08)" />
        ))}
      </svg>
    </Wrapper>
  )
}

/* ── Location Pin with Path ─────────────────────────────── */
export function LocationPin({ className, style }: DecoProps) {
  return (
    <Wrapper className={className} style={style}>
      <svg viewBox="0 0 90 120" fill="none" className="w-full h-full" style={glowStyle}>
        {/* Road/path */}
        <path d="M10 110 C20 90, 30 80, 45 65" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M6 108 C16 88, 28 78, 43 63" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeLinecap="round" fill="none" />
        {/* Pin */}
        <path d="M45 60 C45 60, 70 38, 70 25 C70 11, 58 0, 45 0 C32 0, 20 11, 20 25 C20 38, 45 60, 45 60 Z" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        {/* Inner circle */}
        <circle cx="45" cy="25" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        <circle cx="45" cy="25" r="4" fill="rgba(255,255,255,0.06)" />
      </svg>
    </Wrapper>
  )
}

/* ── Hockey Puck ────────────────────────────────────────── */
export function HockeyPuck({ className, style }: DecoProps) {
  return (
    <Wrapper className={className} style={style}>
      <svg viewBox="0 0 100 70" fill="none" className="w-full h-full" style={glowStyle}>
        {/* Bottom ellipse (3D depth) */}
        <ellipse cx="50" cy="50" rx="42" ry="14" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        {/* Side walls */}
        <line x1="8" y1="38" x2="8" y2="50" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <line x1="92" y1="38" x2="92" y2="50" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        {/* Top ellipse */}
        <ellipse cx="50" cy="38" rx="42" ry="14" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        {/* Red accent line on top */}
        <ellipse cx="50" cy="38" rx="30" ry="9" stroke="rgba(210,50,50,0.2)" strokeWidth="1" />
      </svg>
    </Wrapper>
  )
}

/* ── Stadium Floodlight ─────────────────────────────────── */
export function StadiumLight({ className, style }: DecoProps) {
  return (
    <Wrapper className={className} style={style}>
      <svg viewBox="0 0 70 110" fill="none" className="w-full h-full" style={glowStyle}>
        {/* Pole */}
        <line x1="35" y1="50" x2="35" y2="108" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" />
        {/* Light panel */}
        <rect x="8" y="6" width="54" height="40" rx="6" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        {/* Light bulbs grid */}
        {[0,1,2,3,4].map(col =>
          [0,1,2].map(row => (
            <circle key={`${col}-${row}`} cx={18 + col * 9} cy={16 + row * 10} r="3" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          ))
        )}
        {/* Support bracket */}
        <path d="M28 46 L35 54 L42 46" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Wrapper>
  )
}

/* ── Hockey Stick ───────────────────────────────────────── */
export function HockeyStick({ className, style }: DecoProps) {
  return (
    <Wrapper className={className} style={style}>
      <svg viewBox="0 0 80 110" fill="none" className="w-full h-full" style={glowStyle}>
        {/* Shaft */}
        <line x1="60" y1="4" x2="25" y2="80" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
        {/* Blade */}
        <path d="M25 80 Q18 85, 10 88 Q6 90, 8 94 Q10 98, 18 96 L30 88 Z" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Tape wrapping on shaft */}
        <line x1="55" y1="18" x2="52" y2="14" stroke="rgba(210,50,50,0.15)" strokeWidth="1" />
        <line x1="53" y1="24" x2="50" y2="20" stroke="rgba(210,50,50,0.15)" strokeWidth="1" />
        <line x1="51" y1="30" x2="48" y2="26" stroke="rgba(210,50,50,0.15)" strokeWidth="1" />
      </svg>
    </Wrapper>
  )
}

/* ── Ice Skate ──────────────────────────────────────────── */
export function IceSkate({ className, style }: DecoProps) {
  return (
    <Wrapper className={className} style={style}>
      <svg viewBox="0 0 100 80" fill="none" className="w-full h-full" style={glowStyle}>
        {/* Boot */}
        <path d="M30 15 C30 8, 40 4, 50 4 L55 4 C60 4, 65 8, 65 15 L65 45 C65 50, 60 55, 55 55 L25 55 C20 55, 18 50, 20 45 Z" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        {/* Sole */}
        <path d="M15 55 L72 55 C78 55, 82 58, 80 62 L14 62 C10 62, 10 58, 15 55 Z" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        {/* Blade */}
        <path d="M10 68 L85 68" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
        {/* Blade supports */}
        <line x1="25" y1="62" x2="22" y2="68" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="50" y1="62" x2="50" y2="68" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="70" y1="62" x2="72" y2="68" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        {/* Laces */}
        <line x1="38" y1="18" x2="52" y2="18" stroke="rgba(210,50,50,0.15)" strokeWidth="1" />
        <line x1="36" y1="25" x2="54" y2="25" stroke="rgba(210,50,50,0.15)" strokeWidth="1" />
        <line x1="34" y1="32" x2="56" y2="32" stroke="rgba(210,50,50,0.15)" strokeWidth="1" />
      </svg>
    </Wrapper>
  )
}
