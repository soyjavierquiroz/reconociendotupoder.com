export type CheckoutCountryMode = 'bolivia' | 'international' | 'unknown';

export function getCheckoutCountryMode(
  visitorCountry?: string | null,
): CheckoutCountryMode {
  const country = String(visitorCountry || '').trim().toUpperCase();

  if (country === 'BO') return 'bolivia';
  if (country) return 'international';

  return 'unknown';
}
