import { describe, expect, it } from 'vitest';
import { getCheckoutCountryMode, resolveCheckoutCountry } from './checkoutCountry';

describe('getCheckoutCountryMode', () => {
  it.each(['BO', 'bo', ' BO '])('classifies %j as Bolivia', (country) => {
    expect(getCheckoutCountryMode(country)).toBe('bolivia');
  });

  it.each(['US', 'AR', 'ES', 'pe'])('classifies %j as international', (country) => {
    expect(getCheckoutCountryMode(country)).toBe('international');
  });

  it.each([undefined, null, '', '   '])('classifies %j as unknown', (country) => {
    expect(getCheckoutCountryMode(country)).toBe('unknown');
  });
});

describe('resolveCheckoutCountry QA overrides', () => {
  it.each([
    ['BO', 'bolivia', 'qr'],
    ['US', 'international', 'hotmart'],
    ['PE', 'international', 'hotmart'],
    ['', 'unknown', 'hotmart_with_qr_fallback'],
  ] as const)('uses productive country %j as %s', (country, mode, provider) => {
    expect(resolveCheckoutCountry(country)).toMatchObject({ mode, provider });
  });

  it.each([
    ['checkout_country=US', 'international', 'hotmart'],
    ['checkout_country=BO', 'bolivia', 'qr'],
    ['checkout_country=unknown', 'unknown', 'hotmart_with_qr_fallback'],
    ['checkout_mode=international', 'international', 'hotmart'],
    ['checkout_mode=bolivia', 'bolivia', 'qr'],
    ['checkout_mode=unknown', 'unknown', 'hotmart_with_qr_fallback'],
  ] as const)('applies debug override %s', (override, mode, provider) => {
    expect(resolveCheckoutCountry('BO', `?debug_tracking=1&${override}`)).toEqual({
      mode,
      provider,
      source: 'override',
      visitorCountry: 'BO',
    });
  });

  it('gives checkout_mode precedence over checkout_country', () => {
    expect(
      resolveCheckoutCountry(
        'BO',
        '?debug_tracking=1&checkout_mode=unknown&checkout_country=US',
      ).mode,
    ).toBe('unknown');
  });

  it('ignores overrides without debug_tracking=1', () => {
    expect(resolveCheckoutCountry('BO', '?checkout_mode=international')).toMatchObject({
      mode: 'bolivia',
      source: 'visitor',
      provider: 'qr',
    });
  });
});
