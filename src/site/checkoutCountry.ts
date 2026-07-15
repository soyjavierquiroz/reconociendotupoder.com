export type CheckoutCountryMode = 'bolivia' | 'international' | 'unknown';
export type CheckoutCountrySource = 'visitor' | 'override' | 'unknown';
export type CheckoutProvider = 'qr' | 'hotmart' | 'hotmart_with_qr_fallback';

export type CheckoutCountryResolution = {
  mode: CheckoutCountryMode;
  source: CheckoutCountrySource;
  provider: CheckoutProvider;
  visitorCountry: string;
};

export function getCheckoutCountryMode(
  visitorCountry?: string | null,
): CheckoutCountryMode {
  const country = String(visitorCountry || '').trim().toUpperCase();

  if (country === 'BO') return 'bolivia';
  if (country) return 'international';

  return 'unknown';
}

function getCheckoutProvider(mode: CheckoutCountryMode): CheckoutProvider {
  if (mode === 'bolivia') return 'qr';
  if (mode === 'international') return 'hotmart';
  return 'hotmart_with_qr_fallback';
}

function parseModeOverride(value: string | null): CheckoutCountryMode | null {
  const mode = value?.trim().toLowerCase();
  return mode === 'bolivia' || mode === 'international' || mode === 'unknown' ? mode : null;
}

function parseCountryOverride(value: string | null): CheckoutCountryMode | null {
  const country = value?.trim().toUpperCase();

  if (!country) return null;
  if (country === 'UNKNOWN') return 'unknown';
  return getCheckoutCountryMode(country);
}

export function resolveCheckoutCountry(
  visitorCountry: string | null | undefined,
  search = '',
): CheckoutCountryResolution {
  const normalizedVisitorCountry = String(visitorCountry || '').trim().toUpperCase();
  const params = new URLSearchParams(search);
  const debugEnabled = params.get('debug_tracking') === '1';

  if (debugEnabled) {
    const overrideMode =
      parseModeOverride(params.get('checkout_mode')) ??
      parseCountryOverride(params.get('checkout_country'));

    if (overrideMode) {
      return {
        mode: overrideMode,
        source: 'override',
        provider: getCheckoutProvider(overrideMode),
        visitorCountry: normalizedVisitorCountry,
      };
    }
  }

  const mode = getCheckoutCountryMode(normalizedVisitorCountry);

  return {
    mode,
    source: mode === 'unknown' ? 'unknown' : 'visitor',
    provider: getCheckoutProvider(mode),
    visitorCountry: normalizedVisitorCountry,
  };
}
