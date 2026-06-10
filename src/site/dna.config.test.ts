import { describe, expect, it } from 'vitest';
import { DNA } from './dna.config';

describe('No Le Escribas offer pricing', () => {
  it('derives every current price surface from the Bs 29 offer', () => {
    const offer = DNA.noLeEscribas.offer;

    expect(offer.price).toBe(29);
    expect(offer.value).toBe(offer.price);
    expect(offer.currency).toBe('BOB');
    expect(offer.priceLabel).toBe('Bs 29');
    expect(offer.regularPrice).toBe(97);
    expect(offer.regularPriceLabel).toBe('Bs 97');
    expect(offer.offerId).toBe('NLE_LAUNCH_BOB_29');
    expect(offer.ctaLabel).toContain(offer.priceLabel);
    expect(offer.checkoutSubmitLabel).toContain(offer.priceLabel);
    expect(offer.topBarLabel).toContain(offer.priceLabel);
    expect(offer.topBarLabel).toContain(offer.regularPriceLabel);
  });
});
