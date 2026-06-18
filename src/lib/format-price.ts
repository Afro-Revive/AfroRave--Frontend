interface FormatNairaOptions {
  aproximate?: boolean;
  free?: boolean;
}

export function formatNaira(amount: number, options: FormatNairaOptions = {}) {
  const { aproximate, free } = options;

  if (amount === 0 && free) return 'FREE';

  if (amount < 1000 && aproximate) {
    return `₦${amount.toLocaleString()}`;
  }

  if (amount < 1000000 && aproximate) {
    return `₦${(amount / 1000).toFixed(1).toLocaleString()}K`;
  }

  if (amount > 1000000 && aproximate) {
    return `₦${(amount / 1000000).toFixed(1).toLocaleString()}M`;
  }

  return `₦${amount.toLocaleString()}`;
}
