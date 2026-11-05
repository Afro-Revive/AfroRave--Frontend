interface FormatNairaOptions {
  aproximate?: boolean;
  free?: boolean;
}

/**
 * Kobo always shows two places (8013.6 -> 8,013.60); while naira stay bare
 * (7420 -> 7,420).
 */
function toNairaString(amount: number): string {
  const hasKobo = !Number.isInteger(Math.round(amount * 100) / 100);

  return amount.toLocaleString(undefined, {
    minimumFractionDigits: hasKobo ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

export function formatNaira(amount: number, options: FormatNairaOptions = {}) {
  const { aproximate, free } = options;

  if (amount === 0 && free) return 'FREE';

  if (amount < 1000 && aproximate) {
    return `₦${toNairaString(amount)}`;
  }

  if (amount < 1000000 && aproximate) {
    return `₦${(amount / 1000).toFixed(1).toLocaleString()}K`;
  }

  if (amount > 1000000 && aproximate) {
    return `₦${(amount / 1000000).toFixed(1).toLocaleString()}M`;
  }

  return `₦${toNairaString(amount)}`;
}
