import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      backgroundColor: 'rgba(10, 14, 23, 0.95)',
      padding: '3rem 2rem 2rem 2rem',
      marginTop: '5rem',
      fontSize: '0.85rem',
      color: 'var(--text-secondary)'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Mandatory Agreement Disclaimer */}
        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          borderLeft: '4px solid var(--accent-amber)',
          padding: '1.25rem',
          borderRadius: '6px',
          color: '#cbd5e1',
          lineHeight: 1.6
        }}>
          <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '0.35rem' }}>
            Disclaimer & Educational Notice
          </strong>
          This platform is for educational and informational purposes only and does not constitute professional tax, legal or investment advice. Calculations are based on our interpretation of the Income-tax Act, 2025, the Finance Act 2026, RBI guidelines and other sources as of the date shown next to each figure, and may change or contain errors. Each figure shows its verification status and date; figures marked pending verification have not yet been confirmed. Please consult a qualified Chartered Accountant or a SEBI-registered investment adviser before making a remittance, making an investment, or filing a tax return.
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={15} color="#10b981" />
            <span>Strict Client-Side Privacy: No user financial inputs or files are sent to any server or database.</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
            <Link href="/methodology" style={{ color: 'var(--text-secondary)' }}>Methodology</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
