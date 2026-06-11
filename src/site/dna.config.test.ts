import { describe, expect, it } from 'vitest';
import { DNA } from './dna.config';

describe('No Le Escribas offer pricing', () => {
  it('derives every price surface from the active offer price', () => {
    const offer = DNA.noLeEscribas.offer;

    expect(offer.price).toBeGreaterThan(0);
    expect(offer.value).toBe(offer.price);
    expect(offer.currency).toBe('BOB');
    expect(offer.priceLabel).toBe(`Bs ${offer.price}`);
    expect(offer.regularPrice).toBe(97);
    expect(offer.regularPriceLabel).toBe(`Bs ${offer.regularPrice}`);
    expect(offer.valueTotalLabel).toMatch(/^Bs \d+$/);
    expect(offer.offerId).toBe(`NLE_LAUNCH_${offer.currency}_${offer.price}`);
    expect(offer.ctaLabel).toContain(offer.priceLabel);
    expect(offer.checkoutSubmitLabel).toContain(offer.priceLabel);
    expect(offer.topBarLabel).toContain(offer.priceLabel);
    expect(offer.topBarLabel).toContain(offer.regularPriceLabel);
    expect(offer.topBarMobileLabel).toBe(
      `Hoy Bs ${offer.price} · Luego Bs ${offer.regularPrice}`,
    );
    expect(offer.topBarMobileLabel).toContain(offer.priceLabel);
    expect(offer.topBarMobileLabel).toContain(offer.regularPriceLabel);
  });
});
