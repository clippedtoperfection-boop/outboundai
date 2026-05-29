'use client'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: '◉' },
  { href: '/leads', label: 'Leads', icon: '◈' },
  { href: '/sequences', label: 'Sequences', icon: '◇' },
  { href: '/compose', label: 'AI Compose', icon: '✦' },
  { href: '/calls', label: 'Calls', icon: '◎' },
]

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <div style={{
        width: '224px', flexShrink: 0,
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Logo */}
        <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #6c63ff, #4ecdc4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: 700, color: '#fff', flexShrink: 0
            }}>O</div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, color: 'var(--txt)', letterSpacing: '-0.3px' }}>
                Outbound<span style={{ color: 'var(--accent)' }}>.ai</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--txt3)', marginTop: '1px' }}>Lead engine</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
          {nav.map(n => {
            const active = pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href))
            return (
              <Link key={n.href} href={n.href} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '8px',
                color: active ? 'var(--txt)' : 'var(--txt2)',
                fontSize: '13px', fontWeight: active ? 500 : 400,
                background: active ? 'var(--bg4)' : 'transparent',
                border: active ? '1px solid var(--border)' : '1px solid transparent',
                transition: 'all .12s', textDecoration: 'none'
              }}>
                <span style={{ 
                  fontSize: '11px', 
                  color: active ? 'var(--accent)' : 'var(--txt3)',
                  width: '16px', textAlign: 'center', flexShrink: 0
                }}>{n.icon}</span>
                {n.label}
                {active && <span style={{ marginLeft: 'auto', width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UserButton afterSignOutUrl="/sign-in" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', color: 'var(--txt3)' }}>Account</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{
          height: '52px', flexShrink: 0,
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg2)',
          display: 'flex', alignItems: 'center',
          padding: '0 24px', justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--txt)' }}>
            {nav.find(n => pathname === n.href || pathname.startsWith(n.href))?.label || 'Dashboard'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--txt3)', padding: '4px 10px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '5px' }}>
              outboundai.netlify.app
            </div>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
