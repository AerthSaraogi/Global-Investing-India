import React from 'react';
import { TaxRule } from '@/lib/tax-engine';
import { ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface RulesUsedBlockProps {
  rules: TaxRule[];
}

export default function RulesUsedBlock({ rules }: RulesUsedBlockProps) {
  if (!rules || rules.length === 0) return null;

  return (
    <div className="glass-panel" style={{ marginTop: '2.5rem', border: '1px solid var(--border-color)' }}>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CheckCircle size={18} color="#10b981" />
        Statutory Rules & Provisions Applied
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {rules.map((rule) => {
          const isVerified = rule.verification_status.startsWith('verified');
          return (
            <div
              key={rule.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{rule.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Source: {rule.source_name ?? 'Statutory Provision'} • Effective from: {rule.effective_from}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className={isVerified ? 'badge-verified' : 'badge-pending'}>
                  {isVerified ? (
                    <>
                      <CheckCircle size={12} /> Verified ({rule.last_verified_date})
                    </>
                  ) : (
                    <>
                      <AlertCircle size={12} /> Pending verification
                    </>
                  )}
                </span>

                {rule.source_url && (
                  <a
                    href={rule.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}
                  >
                    View Law <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
