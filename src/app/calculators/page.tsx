'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RulesUsedBlock from '@/components/RulesUsedBlock';
import { calculateTCS, calculateCapitalGains, calculateDividendTax, getRule, TaxRule } from '@/lib/tax-engine';
import { formatINR, parseInputNumber } from '@/lib/formatters';
import { Calculator, AlertTriangle } from 'lucide-react';

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState<'tcs' | 'cg' | 'dividend'>('tcs');

  // TCS State
  const [tcsCategory, setTcsCategory] = useState<'investment' | 'education_loan' | 'education_self' | 'tour'>('investment');
  const [tcsAmountStr, setTcsAmountStr] = useState<string>('1200000');
  const [priorRemittanceStr, setPriorRemittanceStr] = useState<string>('0');
  const [usdFxRateStr, setUsdFxRateStr] = useState<string>('87.5');

  // Capital Gains State
  const [cgCostStr, setCgCostStr] = useState<string>('500000');
  const [cgProceedsStr, setCgProceedsStr] = useState<string>('900000');
  const [cgMonthsStr, setCgMonthsStr] = useState<string>('26');
  const [cgSlabRate, setCgSlabRate] = useState<number>(0.30);

  // Dividend State
  const [dividendAmountStr, setDividendAmountStr] = useState<string>('50000');
  const [hasW8Ben, setHasW8Ben] = useState<boolean>(true);
  const [dividendSlabRate, setDividendSlabRate] = useState<number>(0.30);

  const tcsAmount = parseInputNumber(tcsAmountStr, 1200000);
  const priorRemittance = parseInputNumber(priorRemittanceStr, 0);
  const usdFxRate = parseInputNumber(usdFxRateStr, 87.5);

  const cgCost = parseInputNumber(cgCostStr, 500000);
  const cgProceeds = parseInputNumber(cgProceedsStr, 900000);
  const cgMonths = parseInputNumber(cgMonthsStr, 26);

  const dividendAmount = parseInputNumber(dividendAmountStr, 50000);

  // Computed results
  let tcsResult = null;
  let tcsError = '';
  try {
    tcsResult = calculateTCS(tcsCategory, tcsAmount, priorRemittance, usdFxRate);
  } catch (err: any) {
    tcsError = err.message;
  }

  let cgResult = null;
  let cgError = '';
  try {
    cgResult = calculateCapitalGains(cgCost, cgProceeds, cgMonths, Number(cgSlabRate));
  } catch (err: any) {
    cgError = err.message;
  }

  let divResult = null;
  let divError = '';
  try {
    divResult = calculateDividendTax(dividendAmount, hasW8Ben, Number(dividendSlabRate));
  } catch (err: any) {
    divError = err.message;
  }

  const activeRules: TaxRule[] = [];
  if (activeTab === 'tcs' && tcsResult) {
    activeRules.push(tcsResult.rule);
    activeRules.push(getRule('lrs_annual_limit_usd'));
  } else if (activeTab === 'cg' && cgResult) {
    activeRules.push(cgResult.rule);
    activeRules.push(getRule('health_education_cess'));
  } else if (activeTab === 'dividend') {
    activeRules.push(getRule('us_dividend_withholding'));
    activeRules.push(getRule('foreign_tax_credit'));
    activeRules.push(getRule('health_education_cess'));
  }

  return (
    <div>
      <Header />
      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
        
        {/* Header Title */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <Calculator size={14} /> Module 1: Tax & LRS Engine
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            International Investment Tax Calculators
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '800px', fontSize: '1rem' }}>
            Transparent, pure-function tax engines for resident Indian investors. Every step is clearly broken down with statutory citations and verification status.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('tcs')}
            className={activeTab === 'tcs' ? 'btn-primary' : 'btn-secondary'}
          >
            TCS on LRS Remittances
          </button>
          <button
            onClick={() => setActiveTab('cg')}
            className={activeTab === 'cg' ? 'btn-primary' : 'btn-secondary'}
          >
            Capital Gains on Foreign Shares
          </button>
          <button
            onClick={() => setActiveTab('dividend')}
            className={activeTab === 'dividend' ? 'btn-primary' : 'btn-secondary'}
          >
            US Dividend Withholding & FTC
          </button>
        </div>

        {/* TAB 1: TCS CALCULATOR */}
        {activeTab === 'tcs' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
            
            {/* Input Form */}
            <div className="glass-panel">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Remittance Parameters</h2>
              
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Remittance Purpose / Category
                </label>
                <select
                  value={tcsCategory}
                  onChange={(e: any) => setTcsCategory(e.target.value)}
                  className="input-field"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="investment">Investment / Others (s.394)</option>
                  <option value="education_self">Education / Medical (Self-funded)</option>
                  <option value="education_loan">Education (Funded via Loan s.80E)</option>
                  <option value="tour">Overseas Tour Package</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Current Remittance Amount (INR)
                </label>
                <input
                  type="number"
                  value={tcsAmountStr}
                  onChange={(e) => setTcsAmountStr(e.target.value)}
                  className="input-field"
                  step="50000"
                  min="0"
                />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  {formatINR(tcsAmount)}
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Prior Remittances this FY (in same category group)
                </label>
                <input
                  type="number"
                  value={priorRemittanceStr}
                  onChange={(e) => setPriorRemittanceStr(e.target.value)}
                  className="input-field"
                  step="50000"
                  min="0"
                />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  {formatINR(priorRemittance)}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Reference USD/INR Rate (for RBI $250k check)
                </label>
                <input
                  type="number"
                  value={usdFxRateStr}
                  onChange={(e) => setUsdFxRateStr(e.target.value)}
                  className="input-field"
                  step="0.1"
                  min="0"
                />
              </div>
            </div>

            {/* Results Panel */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Calculation Output</h2>

                {tcsError ? (
                  <div style={{ color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={18} /> {tcsError}
                  </div>
                ) : tcsResult && (
                  <div>
                    <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        TCS Payable to Authorized Dealer (Bank)
                      </div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '0.25rem 0', wordBreak: 'break-word' }}>
                        {formatINR(tcsResult.tcsAmount)}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Total outflow: {formatINR(tcsResult.amountINR + tcsResult.tcsAmount)}
                      </div>
                    </div>

                    {tcsResult.rbiLimitExceeded && (
                      <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.85rem', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle size={18} />
                        Warning: Cumulative remittance exceeds annual RBI LRS limit of $250,000.
                      </div>
                    )}

                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                        Step-by-Step Breakdown:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {tcsResult.calculationSteps.map((step, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>•</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text-secondary)' }}>Important Note:</strong> TCS is not an additional final tax expense. It operates as advance tax and can be adjusted against your overall tax liability or claimed as a refund when filing your annual Income Tax Return (ITR).
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: CAPITAL GAINS CALCULATOR */}
        {activeTab === 'cg' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
            <div className="glass-panel">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Transaction Details</h2>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Total Acquisition Cost (INR)
                </label>
                <input
                  type="number"
                  value={cgCostStr}
                  onChange={(e) => setCgCostStr(e.target.value)}
                  className="input-field"
                  step="10000"
                  min="0"
                />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  {formatINR(cgCost)}
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Total Sale Proceeds (INR)
                </label>
                <input
                  type="number"
                  value={cgProceedsStr}
                  onChange={(e) => setCgProceedsStr(e.target.value)}
                  className="input-field"
                  step="10000"
                  min="0"
                />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  {formatINR(cgProceeds)}
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Holding Period (in Months)
                </label>
                <input
                  type="number"
                  value={cgMonthsStr}
                  onChange={(e) => setCgMonthsStr(e.target.value)}
                  className="input-field"
                  min="0"
                />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Threshold for Long-Term: 24 Months
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Your Applicable Income Tax Slab
                </label>
                <select
                  value={cgSlabRate}
                  onChange={(e) => setCgSlabRate(Number(e.target.value))}
                  className="input-field"
                >
                  <option value={0.30}>30% Slab (Highest)</option>
                  <option value={0.20}>20% Slab</option>
                  <option value={0.15}>15% Slab</option>
                  <option value={0.10}>10% Slab</option>
                  <option value={0.05}>5% Slab</option>
                </select>
              </div>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Capital Gains Liability</h2>

              {cgError ? (
                <div style={{ color: 'var(--accent-rose)' }}>{cgError}</div>
              ) : cgResult && (
                <div>
                  <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      {cgResult.isLongTerm ? 'Long-Term Capital Gains Tax' : 'Short-Term Capital Gains Tax'}
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-emerald)', margin: '0.25rem 0', wordBreak: 'break-word' }}>
                      {formatINR(cgResult.totalTaxINR)}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Net Gain: {formatINR(cgResult.gainINR)} • Effective Tax Rate: {cgResult.effectiveRatePct.toFixed(2)}%
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {cgResult.notes.map((note, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>•</span>
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: US DIVIDEND & FTC CALCULATOR */}
        {activeTab === 'dividend' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
            <div className="glass-panel">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Dividend Inputs</h2>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Gross Foreign Dividend (INR Equivalent)
                </label>
                <input
                  type="number"
                  value={dividendAmountStr}
                  onChange={(e) => setDividendAmountStr(e.target.value)}
                  className="input-field"
                  step="5000"
                  min="0"
                />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  {formatINR(dividendAmount)}
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={hasW8Ben}
                    onChange={(e) => setHasW8Ben(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>Valid W-8BEN Form on file with US Broker (25% withholding vs 30%)</span>
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Indian Income Tax Slab Rate
                </label>
                <select
                  value={dividendSlabRate}
                  onChange={(e) => setDividendSlabRate(Number(e.target.value))}
                  className="input-field"
                >
                  <option value={0.30}>30% Slab</option>
                  <option value={0.20}>20% Slab</option>
                  <option value={0.15}>15% Slab</option>
                  <option value={0.10}>10% Slab</option>
                </select>
              </div>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Withholding & FTC Breakdown</h2>

              {divError ? (
                <div style={{ color: 'var(--accent-rose)' }}>{divError}</div>
              ) : divResult && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>US Withholding Tax (Paid)</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-rose)', wordBreak: 'break-word' }}>
                        {formatINR(divResult.usWithholdingINR)}
                      </div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Foreign Tax Credit (Rule 128)</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-emerald)', wordBreak: 'break-word' }}>
                        {formatINR(divResult.foreignTaxCreditINR)}
                      </div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Additional Indian Tax Payable</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)', wordBreak: 'break-word' }}>
                      {formatINR(divResult.additionalIndiaTaxINR)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Net in hand after all taxes: {formatINR(divResult.netDividendReceivedINR)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {divResult.notes.map((note, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--accent-cyan)' }}>•</span>
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rules Used Block */}
        <RulesUsedBlock rules={activeRules} />

      </main>
      <Footer />
    </div>
  );
}
