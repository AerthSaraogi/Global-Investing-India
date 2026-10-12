import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Lock } from 'lucide-react';

export default function Header() {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'rgba(10, 14, 23, 0.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.75rem 2rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Image
            src="/logo.svg"
            alt="Global Investing India Logo"
            width={38}
            height={38}
            style={{ borderRadius: '8px' }}
          />
          <div>
            <Link href="/" style={{ textDecoration: 'none', color: '#fff' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                Global Investing India
              </span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#10b981' }}>
              <Lock size={11} /> 100% Client-Side Processing • Zero Data Stored
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.9rem', fontWeight: 500 }}>
          <Link href="/calculators" style={{ color: 'var(--text-secondary)' }}>Calculators (M1)</Link>
          <Link href="/routes" style={{ color: 'var(--text-secondary)' }}>Route Comparison (M2)</Link>
          <Link href="/funds" style={{ color: 'var(--text-secondary)' }}>Fund Matrix (M3)</Link>
          <Link href="/schedule-fa" style={{ color: 'var(--text-secondary)' }}>Schedule FA (M4)</Link>
          <Link href="/methodology" style={{ color: 'var(--text-secondary)' }}>Methodology</Link>
        </nav>
      </div>
    </header>
  );
}
