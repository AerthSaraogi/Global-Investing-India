import fxRatesData from '../../data/fx_rates.json';

export interface BrokerTransaction {
  date: string;
  type: 'buy' | 'sell' | 'dividend' | 'other';
  symbol: string;
  quantity?: number;
  price_usd?: number;
  amount_usd: number;
  fees_usd?: number;
}

export interface ScheduleFARow {
  countryName: string;
  countryCode: string;
  entityName: string;
  entityAddress: string;
  natureOfEntity: string;
  dateOfAcquisition: string;
  initialValueINR: number;
  peakValueINR: number;
  closingValueINR: number;
  grossAmountPaidINR: number;
  grossProceedsINR: number;
}

export function getFxRate(dateStr: string): number {
  const match = fxRatesData.rates.find((r) => r.date === dateStr);
  if (match) return match.usd_inr;

  // Find closest earlier date
  const sorted = [...fxRatesData.rates].sort((a, b) => a.date.localeCompare(b.date));
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].date <= dateStr) {
      return sorted[i].usd_inr;
    }
  }

  // Default fallback reference if outside range
  return 87.5;
}

export function processScheduleFA(
  transactions: BrokerTransaction[],
  userPeakValues: Record<string, number> = {},
  userClosingPricesUSD: Record<string, number> = {}
): ScheduleFARow[] {
  // Group by symbol
  const bySymbol: Record<string, BrokerTransaction[]> = {};

  for (const tx of transactions) {
    if (!bySymbol[tx.symbol]) {
      bySymbol[tx.symbol] = [];
    }
    bySymbol[tx.symbol].push(tx);
  }

  const rows: ScheduleFARow[] = [];

  for (const [symbol, txs] of Object.entries(bySymbol)) {
    // Sort chronological
    txs.sort((a, b) => a.date.localeCompare(b.date));

    const buys = txs.filter((t) => t.type === 'buy');
    const sells = txs.filter((t) => t.type === 'sell');

    if (buys.length === 0 && sells.length === 0) continue;

    const firstBuy = buys[0] || txs[0];
    const firstRate = getFxRate(firstBuy.date);

    // Initial investment
    const initialUSD = buys.reduce((acc, t) => acc + (t.amount_usd || 0), 0);
    const initialINR = Math.round(initialUSD * firstRate);

    // Proceeds from sale
    let grossProceedsINR = 0;
    for (const sell of sells) {
      const rate = getFxRate(sell.date);
      grossProceedsINR += Math.round((sell.amount_usd || 0) * rate);
    }

    // Closing value as of Dec 31
    let closingUSD = 0;
    const netShares = buys.reduce((acc, t) => acc + (t.quantity || 0), 0) -
                      sells.reduce((acc, t) => acc + (t.quantity || 0), 0);

    if (netShares > 0 && userClosingPricesUSD[symbol]) {
      closingUSD = netShares * userClosingPricesUSD[symbol];
    } else if (netShares > 0 && buys.length > 0) {
      // If closing price not entered, use last trade price
      const lastPrice = txs[txs.length - 1].price_usd || 0;
      closingUSD = netShares * lastPrice;
    }

    const dec31Rate = getFxRate('2025-12-31');
    const closingINR = Math.round(closingUSD * dec31Rate);

    // Peak value
    const peakINR = userPeakValues[symbol] ? Math.round(userPeakValues[symbol]) : Math.max(initialINR, closingINR);

    rows.push({
      countryName: 'United States',
      countryCode: '001',
      entityName: `${symbol} Inc.`,
      entityAddress: 'Delaware, USA',
      natureOfEntity: 'Company (Foreign Listed Equity)',
      dateOfAcquisition: firstBuy.date,
      initialValueINR: initialINR,
      peakValueINR: peakINR,
      closingValueINR: closingINR,
      grossAmountPaidINR: initialINR,
      grossProceedsINR,
    });
  }

  return rows;
}
