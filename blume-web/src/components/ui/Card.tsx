import type { HTMLAttributes } from 'react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <article
      className={`rounded-xl border border-[var(--border)] bg-white ${className}`}
      {...props}
    />
  )
}
