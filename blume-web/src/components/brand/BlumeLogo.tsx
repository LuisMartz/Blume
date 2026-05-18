export function BlumeLogo({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--brand)" />
      <path
        d="M10 22V10h6.2c2.6 0 4.2 1.3 4.2 3.4 0 1.4-.8 2.4-2 2.8 1.6.3 2.6 1.5 2.6 3.1 0 2.2-1.7 3.6-4.4 3.6H10Zm2.7-7.2h2.9c1.2 0 1.9-.6 1.9-1.5s-.7-1.5-1.9-1.5h-2.9v3Zm0 5h3.2c1.3 0 2.1-.6 2.1-1.6 0-1-.8-1.6-2.1-1.6h-3.2v3.2Z"
        fill="var(--brand-foreground)"
      />
    </svg>
  )
}
