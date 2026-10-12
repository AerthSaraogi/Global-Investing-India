/**
 * Format numbers with Indian numbering grouping (Lakh, Crore)
 * or compact notation (Cr, L) for very large values to prevent layout overflow.
 */
export function formatINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return '₹0';
  
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  // For astronomical numbers (> 1,000 Crore), format in compact readable format
  if (abs >= 1e11) {
    // 1 Lakh Crore = 10^12, 1 Crore = 10^7
    const cr = abs / 1e7;
    return `${sign}₹${cr.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`;
  }

  return `${sign}₹${Math.round(val).toLocaleString('en-IN')}`;
}

export function parseInputNumber(valStr: string, fallback: number = 0): number {
  if (valStr.trim() === '') return 0;
  const parsed = Number(valStr);
  return isNaN(parsed) ? fallback : parsed;
}
