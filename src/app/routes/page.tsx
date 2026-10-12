'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RulesUsedBlock from '@/components/RulesUsedBlock';
import { compareRoutes, RouteComparisonResult } from '@/lib/route-engine';
import { getRule, TaxRule } from '@/lib/tax-engine';
import { formatINR, parseInputNumber } from '@/lib/formatters';
import { GitCompare } from 'lucide-react';

export default function RoutesPage() {
  const [investmentAmountStr, setInvestmentAmountStr] = useState<string>('1000000');
  const [holdingYearsStr, setHoldingYearsStr] = useState<string>('3');
  const [assumedReturnStr, setAssumedReturnStr] = useState<string>('12');
  const [priorRemittanceStr, setPriorRemittanceStr] = useState<string>('0');
  const [etfPremiumStr, setEtfPremiumStr] = useState<string>('2.5');

  const investmentAmount = parseInputNumber(investmentAmountStr, 1000000);
  // Cap holding years sensibly between 0 and 100
  const rawHoldingYears = parseInputNumber(holdingYearsStr, 3);
  const holdingYears = Math.min(Math.max(0, rawHoldingYears), 100);
  const assumedReturn = parseInputNumber(assumedReturnStr, 12);
  const priorRemittance = parseInputNumber(priorRemittanceStr, 0);
  const etfPremium = parseInputNumber(etfPremiumStr, 2.5);

  const comparisonResults: RouteComparisonResult[] = compareRoutes(
    investmentAmount,
    holdingYears,
    assumedReturn,
    priorRemittance,
    etfPremium
  );

  const rules: TaxRule[] = [
    getRule('lrs_tcs_investment'),
    getRule('cg_foreign_shares'),
    getRule('health_education_cess'),
  ];

  return (
    <div>
      <Header />
      <main style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 1.5rem' }}>
        
        {/* Page Title */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <GitCompare size={14} /> Module 2: Route Comparison
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Side-by-Side Global Investing Route Comparison
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '850px', fontSize: '1rem' }}>
            Objective cost, tax, and structural comparison across all four international investing routes for Indian residents. 
            <strong> Note:</strong> This tool compares mechanics and all-in costs only; it never ranks routes or recommends an investment.
          </p>
        </div>

        {/* Inputs Bar */}
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Investment Amount (INR)
              </label>
              <input
                type="number"
                value={investmentAmountStr}
                onChange={(e) => setInvestmentAmountStr(e.target.value)}
                className="input-field"
                step="50000"
                min="0"
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {formatINR(investmentAmount)}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Holding Period (Years, max 100)
              </label>
              <input
                type="number"
                value={holdingYearsStr}
                onChange={(e) => setHoldingYearsStr(e.target.value)}
                className="input-field"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Assumed Annual Return (%)
              </label>
              <input
                type="number"
                value={assumedReturnStr}
                onChange={(e) => setAssumedReturnStr(e.target.value)}
                className="input-field"
                step="0.5"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Prior LRS Remittance (INR)
              </label>
              <input
                type="number"
                value={priorRemittanceStr}
                onChange={(e) => setPriorRemittanceStr(e.target.value)}
                className="input-field"
                step="50000"
                min="0"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                ETF Premium to iNAV (%)
              </label>
              <input
                type="number"
                value={etfPremiumStr}
                onChange={(e) => setEtfPremiumStr(e.target.value)}
                className="input-field"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Comparison Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {comparisonResults.map((item) => (
            <div
              key={item.route.id}
              className="glass-panel glow-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                wordBreak: 'break-word',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{item.route.name}</h3>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  {item.route.availability_note}
                </div>

                {/* Metrics Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>Upfront Cash Outflow</span>
                    <strong style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{formatINR(item.upfrontOutflowINR)}</strong>
                  </div>

                  {item.tcsAmountINR > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', color: 'var(--accent-amber)', gap: '0.5rem' }}>
                      <span style={{ flexShrink: 0 }}>Included TCS (Refundable)</span>
                      <span style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{formatINR(item.tcsAmountINR)}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>Friction / Upfront Costs</span>
                    <span style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{formatINR(item.entryCostINR + item.fxMarkupINR + item.premiumCostINR)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>Holding Drag ({holdingYears} yrs)</span>
                    <span style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{formatINR(item.estimatedHoldingCostINR)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>Estimated Exit Tax</span>
                    <span style={{ color: 'var(--accent-rose)', textAlign: 'right', whiteSpace: 'nowrap' }}>{formatINR(item.estimatedExitTaxINR)}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Result Box */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                  Projected Net Post-Tax Value
                </div>
                <div
                  style={{
                    fontSize: item.projectedPostTaxValueINR >= 1e11 ? '1.35rem' : '1.55rem',
                    fontWeight: 800,
                    color: 'var(--accent-emerald)',
                    marginBottom: '0.5rem',
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                  }}
                >
                  {formatINR(item.projectedPostTaxValueINR)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255, 255, 255, 0.02)', padding: '0.5rem', borderRadius: '6px' }}>
                  {item.taxTreatmentSummary}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Rules Used Block */}
        <RulesUsedBlock rules={rules} />

      </main>
      <Footer />
    </div>
  );
}
