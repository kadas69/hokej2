export function PageBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Main CNN Prima NEWS dark blue background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #0a1a6e 0%, #010D5D 40%, #000838 100%)',
        }}
      />

      {/* Subtle decorative glow at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.08]"
        style={{
          background: 'radial-gradient(ellipse, #D10A10 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
