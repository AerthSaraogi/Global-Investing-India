import rulesData from '../../data/rules.json';

export interface TaxRule {
  id: string;
  name: string;
  type: string;
  threshold_group?: string;
  threshold_inr?: number;
  rate_up_to_threshold?: number;
  rate_above_threshold?: number;
  flat_rate?: number;
  rate_with_w8ben?: number;
  rate_without_w8ben?: number;
  value_usd?: number;
  long_term_min_months?: number;
  long_term_rate?: number;
  indexation?: boolean;
  short_term_rate?: string;
  rate?: number;
  method?: string;
  carry_forward?: boolean;
  refundable?: boolean;
  effective_from: string;
  source_name?: string;
  source_url: string;
  verification_status: string;
  last_verified_date: string;
  verified_by?: string;
}

export function getRule(id: string): TaxRule {
  const rule = rulesData.rules.find((r) => r.id === id);
  if (!rule) {
    throw new Error(`Rule not found: ${id}`);
  }
  return rule as TaxRule;
}

export interface TCSResult {
  category: string;
  amountINR: number;
  priorRemittanceINR: number;
  thresholdINR: number;
  taxableExcess: number;
  rateUpToThreshold: number;
  rateAboveThreshold: number;
  tcsAmount: number;
  rbiLimitExceeded: boolean;
  rule: TaxRule;
  calculationSteps: string[];
}

export function calculateTCS(
  category: 'investment' | 'education_loan' | 'education_self' | 'tour',
  amountINR: number,
  priorRemittanceINR: number = 0,
  fxRateUSD: number = 0
): TCSResult {
  if (amountINR <= 0 || isNaN(amountINR)) {
    throw new Error('Amount must be a positive number.');
  }
  if (priorRemittanceINR < 0 || isNaN(priorRemittanceINR)) {
    throw new Error('Prior remittance cannot be negative.');
  }

  let ruleId = 'lrs_tcs_investment';
  if (category === 'tour') ruleId = 'lrs_tcs_tour';
  else if (category === 'education_loan') ruleId = 'lrs_tcs_education_loan';
  else if (category === 'education_self') ruleId = 'lrs_tcs_education_self';

  const rule = getRule(ruleId);
  const steps: string[] = [];

  let tcs = 0;
  let taxableExcess = 0;
  let threshold = 0;
  let rateUpTo = 0;
  let rateAbove = 0;

  if (rule.type === 'flat') {
    rateAbove = rule.flat_rate ?? 0;
    tcs = amountINR * rateAbove;
    steps.push(`Applied flat TCS rate of ${(rateAbove * 100).toFixed(2)}% on ₹${amountINR.toLocaleString('en-IN')}`);
  } else if (rule.type === 'threshold') {
    threshold = rule.threshold_inr ?? 1000000;
    rateUpTo = rule.rate_up_to_threshold ?? 0;
    rateAbove = rule.rate_above_threshold ?? 0.20;

    const P = priorRemittanceINR;
    const A = amountINR;
    const T = threshold;

    taxableExcess = Math.max(0, P + A - T) - Math.max(0, P - T);
    const nonTaxablePortion = A - taxableExcess;

    tcs = (rateUpTo * nonTaxablePortion) + (rateAbove * taxableExcess);

    steps.push(`Annual threshold for ${rule.threshold_group}: ₹${threshold.toLocaleString('en-IN')}`);
    steps.push(`Prior remittances in current FY: ₹${P.toLocaleString('en-IN')}`);
    steps.push(`Current remittance: ₹${A.toLocaleString('en-IN')}`);
    if (nonTaxablePortion > 0) {
      steps.push(`Portion within threshold (taxed at ${(rateUpTo * 100).toFixed(2)}%): ₹${nonTaxablePortion.toLocaleString('en-IN')} = ₹${(nonTaxablePortion * rateUpTo).toFixed(2)}`);
    }
    if (taxableExcess > 0) {
      steps.push(`Portion exceeding threshold (taxed at ${(rateAbove * 100).toFixed(2)}%): ₹${taxableExcess.toLocaleString('en-IN')} = ₹${(taxableExcess * rateAbove).toFixed(2)}`);
    }
  }

  // Round nearest rupee half up
  const roundedTcs = Math.round(tcs);

  // Check RBI limit
  let rbiLimitExceeded = false;
  if (fxRateUSD > 0) {
    const lrsLimitRule = getRule('lrs_annual_limit_usd');
    const totalUSD = (priorRemittanceINR + amountINR) / fxRateUSD;
    if (totalUSD > (lrsLimitRule.value_usd ?? 250000)) {
      rbiLimitExceeded = true;
      steps.push(`Warning: Cumulative remittance ($${totalUSD.toFixed(2)}) may exceed the annual RBI LRS limit of $${lrsLimitRule.value_usd?.toLocaleString()}.`);
    }
  }

  return {
    category,
    amountINR,
    priorRemittanceINR,
    thresholdINR: threshold,
    taxableExcess,
    rateUpToThreshold: rateUpTo,
    rateAboveThreshold: rateAbove,
    tcsAmount: roundedTcs,
    rbiLimitExceeded,
    rule,
    calculationSteps: steps,
  };
}

export interface CapitalGainsResult {
  costINR: number;
  proceedsINR: number;
  gainINR: number;
  holdingMonths: number;
  isLongTerm: boolean;
  baseTaxINR: number;
  cessINR: number;
  totalTaxINR: number;
  effectiveRatePct: number;
  notes: string[];
  rule: TaxRule;
}

export function calculateCapitalGains(
  costINR: number,
  proceedsINR: number,
  holdingMonths: number,
  slabRate: number = 0.30
): CapitalGainsResult {
  if (costINR < 0 || proceedsINR < 0 || holdingMonths < 0) {
    throw new Error('Values cannot be negative.');
  }

  const cgRule = getRule('cg_foreign_shares');
  const cessRule = getRule('health_education_cess');
  const cessRate = cessRule.rate ?? 0.04;

  const gain = proceedsINR - costINR;
  const minLtMonths = cgRule.long_term_min_months ?? 24;
  const isLongTerm = holdingMonths >= minLtMonths;

  const notes: string[] = [];

  if (gain <= 0) {
    return {
      costINR,
      proceedsINR,
      gainINR: gain,
      holdingMonths,
      isLongTerm,
      baseTaxINR: 0,
      cessINR: 0,
      totalTaxINR: 0,
      effectiveRatePct: 0,
      notes: ['No taxable gain or capital loss incurred. Version 1 does not model capital loss carry-forward or set-off.'],
      rule: cgRule,
    };
  }

  let baseTax = 0;
  if (isLongTerm) {
    const ltRate = cgRule.long_term_rate ?? 0.125;
    baseTax = gain * ltRate;
    notes.push(`Long-term capital gain (> ${minLtMonths} months) taxed at ${(ltRate * 100).toFixed(1)}% under section 112A/112.`);
    notes.push('No indexation benefit and no ₹1.25 Lakh basic exemption applied for foreign unlisted shares.');
  } else {
    baseTax = gain * slabRate;
    notes.push(`Short-term capital gain (< ${minLtMonths} months) added to income and taxed at user slab rate (${(slabRate * 100).toFixed(1)}%).`);
  }

  const cess = baseTax * cessRate;
  const totalTax = Math.round(baseTax + cess);

  notes.push(`Health & Education Cess at ${(cessRate * 100).toFixed(1)}%: ₹${Math.round(cess).toLocaleString('en-IN')}`);
  notes.push('Note: Applicable surcharge (if total income > ₹50 Lakh) is not modelled.');

  return {
    costINR,
    proceedsINR,
    gainINR: gain,
    holdingMonths,
    isLongTerm,
    baseTaxINR: Math.round(baseTax),
    cessINR: Math.round(cess),
    totalTaxINR: totalTax,
    effectiveRatePct: gain > 0 ? (totalTax / gain) * 100 : 0,
    notes,
    rule: cgRule,
  };
}

export interface DividendTaxResult {
  grossDividendINR: number;
  usWithholdingINR: number;
  indiaTaxINR: number;
  foreignTaxCreditINR: number;
  additionalIndiaTaxINR: number;
  unusedCreditINR: number;
  netDividendReceivedINR: number;
  notes: string[];
}

export function calculateDividendTax(
  grossDividendINR: number,
  hasW8BEN: boolean = true,
  slabRate: number = 0.30
): DividendTaxResult {
  if (grossDividendINR <= 0) {
    throw new Error('Dividend must be positive.');
  }

  const usRule = getRule('us_dividend_withholding');
  const cessRule = getRule('health_education_cess');
  const cessRate = cessRule.rate ?? 0.04;

  const usWithholdingRate = hasW8BEN
    ? (usRule.rate_with_w8ben ?? 0.25)
    : (usRule.rate_without_w8ben ?? 0.30);

  const usWithholding = Math.round(grossDividendINR * usWithholdingRate);
  const indianTaxBeforeCess = grossDividendINR * slabRate;
  const indiaTax = Math.round(indianTaxBeforeCess * (1 + cessRate));

  // FTC under Rule 128: lower of foreign tax paid and Indian tax payable on same income
  const ftc = Math.min(usWithholding, indiaTax);
  const additionalIndiaTax = Math.max(0, indiaTax - ftc);
  const unusedCredit = Math.max(0, usWithholding - ftc);
  const netReceived = grossDividendINR - usWithholding - additionalIndiaTax;

  const notes: string[] = [
    `US withholding tax at ${(usWithholdingRate * 100).toFixed(0)}% (W-8BEN ${hasW8BEN ? 'Valid' : 'Not provided'}): ₹${usWithholding.toLocaleString('en-IN')}`,
    `Indian tax liability at slab (${(slabRate * 100).toFixed(0)}%) + 4% cess: ₹${indiaTax.toLocaleString('en-IN')}`,
    `Foreign Tax Credit (FTC) eligible under Rule 128: ₹${ftc.toLocaleString('en-IN')}`,
  ];

  if (unusedCredit > 0) {
    notes.push(`Unused foreign tax credit: ₹${unusedCredit.toLocaleString('en-IN')} (Cannot be carried forward or refunded)`);
  }
  notes.push('To claim Foreign Tax Credit, Form 67 must be furnished on or before the due date of filing ITR.');

  return {
    grossDividendINR,
    usWithholdingINR: usWithholding,
    indiaTaxINR: indiaTax,
    foreignTaxCreditINR: ftc,
    additionalIndiaTaxINR: additionalIndiaTax,
    unusedCreditINR: unusedCredit,
    netDividendReceivedINR: netReceived,
    notes,
  };
}
