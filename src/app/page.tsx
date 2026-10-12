import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Calculator, GitCompare, Table, FileSpreadsheet, ShieldCheck, ArrowRight, CheckCircle, Lock } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      <Header />
      <main style={{ maxWidth: '1280px', margin: '3rem auto', padding: '0 1.5rem' }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: '#34d399',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '1.25rem'
          }}>
            <Lock size={13} /> 100% Client-Side Processing • DPDP Act 2023 Compliant
          </div>

          <h1 style={{ fontSize: '3.2rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            The Transparent Operating System for <br />
            <span style={{
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Resident Indian Global Investors
            </span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 2rem auto', fontSize: '1.15rem' }}>
            Accurate, rule-verified tools to calculate LRS TCS, foreign capital gains, compare investment routes, track mutual fund limits, and generate ITR Schedule FA worksheets without transmitting your financial data anywhere.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/calculators" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
              Launch Tax Engine (M1) <ArrowRight size={16} />
            </Link>
            <Link href="/schedule-fa" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
              Generate Schedule FA (M4)
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          
          <Link href="/calculators" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-panel glow-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Calculator size={22} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Tax & LRS Engine (M1)</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Calculate TCS on remittances with cumulative FY threshold tracking, Long-Term/Short-Term foreign capital gains, and US dividend withholding with Rule 128 Foreign Tax Credit.
                </p>
              </div>
              <div style={{ marginTop: '1.5rem', color: 'var(--accent-blue)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                Open Calculators <ArrowRight size={14} />
              </div>
            </div>
          </Link>

          <Link href="/routes" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-panel glow-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <GitCompare size={22} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Route Comparison (M2)</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Unbiased side-by-side analysis of Direct LRS, Indian International ETFs, Domestic Feeder FoFs, and GIFT City funds with editable holding periods and fee drag.
                </p>
              </div>
              <div style={{ marginTop: '1.5rem', color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                Compare Routes <ArrowRight size={14} />
              </div>
            </div>
          </Link>

          <Link href="/funds" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-panel glow-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Table size={22} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Fund Matrix (M3)</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Search and filter international mutual fund schemes and ETFs open for fresh investments under SEBI/RBI industry-wide overseas limit caps.
                </p>
              </div>
              <div style={{ marginTop: '1.5rem', color: 'var(--accent-emerald)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                View Availability <ArrowRight size={14} />
              </div>
            </div>
          </Link>

          <Link href="/schedule-fa" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-panel glow-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-amber)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <FileSpreadsheet size={22} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Schedule FA Tool (M4)</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Convert broker transaction statements into ITR-ready foreign asset reporting schedules. Zero network transmission; processes strictly in browser RAM.
                </p>
              </div>
              <div style={{ marginTop: '1.5rem', color: 'var(--accent-amber)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                Generate Worksheet <ArrowRight size={14} />
              </div>
            </div>
          </Link>

        </div>

      </main>
      <Footer />
    </div>
  );
}
