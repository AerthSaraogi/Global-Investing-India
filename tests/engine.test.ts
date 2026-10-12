import { describe, it, expect } from 'vitest';
import { calculateTCS, calculateCapitalGains, calculateDividendTax } from '../src/lib/tax-engine';
import { compareRoutes } from '../src/lib/route-engine';

describe('M1: Tax & LRS Engine', () => {
  it('TC-01: calculates 0% TCS on investment below 10L threshold', () => {
    const res = calculateTCS('investment', 700000, 0);
    expect(res.tcsAmount).toBe(0);
    expect(res.taxableExcess).toBe(0);
  });

  it('TC-02: calculates 20% TCS on portion above 10L threshold', () => {
    // 15L remittance with 0 prior -> 10L at 0%, 5L at 20% = 1,00,000
    const res = calculateTCS('investment', 1500000, 0);
    expect(res.taxableExcess).toBe(500000);
    expect(res.tcsAmount).toBe(100000);
  });

  it('TC-03: handles prior remittances crossing threshold', () => {
    // Prior 8L, new 5L -> total 13L -> taxable excess 3L @ 20% = 60,000
    const res = calculateTCS('investment', 500000, 800000);
    expect(res.taxableExcess).toBe(300000);
    expect(res.tcsAmount).toBe(60000);
  });

  it('TC-04: handles tour package flat 2% TCS', () => {
    const res = calculateTCS('tour', 200000, 0);
    expect(res.tcsAmount).toBe(4000);
  });

  it('TC-05: handles education loan 0% flat TCS', () => {
    const res = calculateTCS('education_loan', 1500000, 0);
    expect(res.tcsAmount).toBe(0);
  });

  it('TC-06: rejects non-positive remittance amounts', () => {
    expect(() => calculateTCS('investment', 0)).toThrow();
    expect(() => calculateTCS('investment', -500)).toThrow();
  });

  it('TC-07: flags RBI annual limit warning if USD exceeds 250k', () => {
    // 2.5 Crore at 85 USD/INR is ~$294,117 > 250,000
    const res = calculateTCS('investment', 25000000, 0, 85);
    expect(res.rbiLimitExceeded).toBe(true);
  });

  it('TC-08: calculates Long-term Capital Gains for foreign shares (>= 24 months)', () => {
    // Cost 10L, Sale 15L -> Gain 5L. LTCG 12.5% + 4% cess = 13% = 65,000
    const res = calculateCapitalGains(1000000, 1500000, 24, 0.30);
    expect(res.isLongTerm).toBe(true);
    expect(res.gainINR).toBe(500000);
    expect(res.baseTaxINR).toBe(62500);
    expect(res.cessINR).toBe(2500);
    expect(res.totalTaxINR).toBe(65000);
  });

  it('TC-09: calculates Short-term Capital Gains for foreign shares (< 24 months)', () => {
    // Cost 10L, Sale 15L -> Gain 5L. STCG 30% slab + 4% cess = 31.2% = 156,000
    const res = calculateCapitalGains(1000000, 1500000, 12, 0.30);
    expect(res.isLongTerm).toBe(false);
    expect(res.totalTaxINR).toBe(156000);
  });

  it('TC-10: returns 0 tax for capital loss', () => {
    const res = calculateCapitalGains(1500000, 1000000, 36, 0.30);
    expect(res.gainINR).toBe(-500000);
    expect(res.totalTaxINR).toBe(0);
  });

  it('TC-11: calculates dividend withholding and Foreign Tax Credit under Rule 128', () => {
    // 100,000 dividend. US withholding @ 25% = 25,000. Indian tax @ 30% + 4% cess = 31,200.
    // FTC = min(25,000, 31,200) = 25,000. Additional Indian tax = 6,200.
    const res = calculateDividendTax(100000, true, 0.30);
    expect(res.usWithholdingINR).toBe(25000);
    expect(res.indiaTaxINR).toBe(31200);
    expect(res.foreignTaxCreditINR).toBe(25000);
    expect(res.additionalIndiaTaxINR).toBe(6200);
    expect(res.unusedCreditINR).toBe(0);
  });
});

describe('M2: Route Comparison Engine', () => {
  it('TC-25: calculates route comparisons without bias or recommendation', () => {
    const results = compareRoutes(1000000, 3, 10, 0, 2.0);
    expect(results.length).toBeGreaterThanOrEqual(4);
    results.forEach((r) => {
      expect(r.upfrontOutflowINR).toBeGreaterThan(0);
      expect(r.projectedPostTaxValueINR).toBeDefined();
      expect(r.route.availability_note).toBeDefined();
    });
  });
});
