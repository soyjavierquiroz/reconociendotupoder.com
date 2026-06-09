import { describe, expect, it } from 'vitest';
import { normalizeCheckoutWhatsapp } from './checkoutCustomer';

describe('normalizeCheckoutWhatsapp', () => {
  it('keeps an international prefix and removes presentation characters', () => {
    expect(normalizeCheckoutWhatsapp('+591 (694) 30-776')).toBe('+59169430776');
  });

  it('normalizes a local number to digits', () => {
    expect(normalizeCheckoutWhatsapp('694 30-776')).toBe('69430776');
  });
});
