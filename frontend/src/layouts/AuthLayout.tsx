import type { PropsWithChildren } from 'react'
import { cn } from '../utils/format'

export function AuthLayout({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('auth-shell', className)}>{children}</div>
}
