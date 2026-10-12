import routesData from '../../data/routes.json';
import { calculateTCS } from './tax-engine';

export interface Route {
  id: string;
  name: string;
  availability_note: string;
  entry_cost_pct: number;
  fx_markup_pct: number;
  annual_cost_pct: number;
  premium_to_nav_pct: number;
  tcs_applies: boolean;
  tax_treatment_key: string;
  min_investment_inr: number;
  source_url: string;
  last_verified_date: string;
  verification_status: string;
}

export interface RouteComparisonResult {
  route: Route;
  amountINR: number;
  upfrontOutflowINR: number;
  tcsAmountINR: number;
  entryCostINR: number;
  fxMarkupINR: number;
  premiumCostINR: number;
  netInvestedINR: number;
  estimatedHoldingCostINR: number;
  projectedPreTaxValueINR: number;
  estimatedExitTaxINR: number;
  projectedPostTaxValueINR: number;
  allInCostINR: number;
  taxTreatmentSummary: string;
}

export function compareRoutes(
  amountINR: number,
  holdingYears: number,
  assumedAnnualReturnPct: number,
  priorRemittanceINR: number = 0,
  userEtfPremiumPct?: number
): RouteComparisonResult[] {
  const routes = routesData.routes as Route[];

  return routes.map((route) => {
    let tcsAmount = 0;
    if (route.tcs_applies) {
      const tcsRes = calculateTCS('investment', amountINR, priorRemittanceINR);
      tcsAmount = tcsRes.tcsAmount;
    }

    const premiumPct = (route.id === 'indian_etf' && userEtfPremiumPct !== undefined)
      ? userEtfPremiumPct
      : route.premium_to_nav_pct;

    const entryCost = (amountINR * route.entry_cost_pct) / 100;
    const fxMarkup = (amountINR * route.fx_markup_pct) / 100;
    const premiumCost = (amountINR * premiumPct) / 100;

    const netInvested = Math.max(0, amountINR - entryCost - fxMarkup - premiumCost);

    // Compound growth
    const annualReturnRate = assumedAnnualReturnPct / 100;
    const annualExpenseRate = route.annual_cost_pct / 100;
    const netAnnualGrowthRate = Math.max(-1, annualReturnRate - annualExpenseRate);

    const projectedPreTaxValue = netInvested * Math.pow(1 + netAnnualGrowthRate, holdingYears);
    const estimatedHoldingCost = (netInvested * Math.pow(1 + annualReturnRate, holdingYears)) - projectedPreTaxValue;

    // Gain
    const estimatedGain = Math.max(0, projectedPreTaxValue - netInvested);
    let exitTax = 0;
    let taxSummary = '';

    if (route.tax_treatment_key === 'foreign_shares') {
      // 12.5% if >= 2 years else slab (assume 30%) + 4% cess
      if (holdingYears >= 2) {
        exitTax = estimatedGain * 0.125 * 1.04;
        taxSummary = 'LTCG: 12.5% + 4% cess (holding >= 24 mos)';
      } else {
        exitTax = estimatedGain * 0.30 * 1.04;
        taxSummary = 'STCG: Slab rate (30%) + 4% cess';
      }
    } else if (route.tax_treatment_key === 'indian_international_etf') {
      // Specified mutual fund / ETF post April 2023: taxed at slab rates
      exitTax = estimatedGain * 0.30 * 1.04;
      taxSummary = 'Taxed at slab rates as per s.50AA (specified mutual fund)';
    } else if (route.tax_treatment_key === 'debt_mf_taxation') {
      exitTax = estimatedGain * 0.30 * 1.04;
      taxSummary = 'Taxed at slab rates under section 50AA';
    } else if (route.tax_treatment_key === 'gift_city_funds') {
      if (holdingYears >= 2) {
        exitTax = estimatedGain * 0.125 * 1.04;
        taxSummary = 'LTCG 12.5% + cess; exemption under IFSC rules if applicable';
      } else {
        exitTax = estimatedGain * 0.30 * 1.04;
        taxSummary = 'STCG slab rate';
      }
    } else {
      taxSummary = 'Not modelled';
    }

    const projectedPostTax = projectedPreTaxValue - exitTax;
    const allInCost = entryCost + fxMarkup + premiumCost + estimatedHoldingCost + exitTax;

    return {
      route,
      amountINR,
      upfrontOutflowINR: Math.round(amountINR + tcsAmount),
      tcsAmountINR: Math.round(tcsAmount),
      entryCostINR: Math.round(entryCost),
      fxMarkupINR: Math.round(fxMarkup),
      premiumCostINR: Math.round(premiumCost),
      netInvestedINR: Math.round(netInvested),
      estimatedHoldingCostINR: Math.round(estimatedHoldingCost),
      projectedPreTaxValueINR: Math.round(projectedPreTaxValue),
      estimatedExitTaxINR: Math.round(exitTax),
      projectedPostTaxValueINR: Math.round(projectedPostTax),
      allInCostINR: Math.round(allInCost),
      taxTreatmentSummary: taxSummary,
    };
  });
}
