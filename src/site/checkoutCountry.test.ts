import { describe, expect, it } from 'vitest';
import { getCheckoutCountryMode } from './checkoutCountry';

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
