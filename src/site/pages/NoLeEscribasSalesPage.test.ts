import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const pageSource = readFileSync(
  new URL('./NoLeEscribasSalesPage.tsx', import.meta.url),
  'utf8',
);
const stickySource = readFileSync(
  new URL('../components/sales/StickySalesCta.tsx', import.meta.url),
  'utf8',
);

function sourceBetween(start: string, end: string) {
  const startIndex = pageSource.indexOf(start);
  const endIndex = pageSource.indexOf(end, startIndex);

  expect(startIndex).toBeGreaterThanOrEqual(0);
  expect(endIndex).toBeGreaterThan(startIndex);

  return pageSource.slice(startIndex, endIndex);
}

describe('NoLeEscribasSalesPage value-first flow', () => {
  it('keeps the hero educational and points its CTAs to content anchors', () => {
    const hero = sourceBetween('<section className="nle-hero">', '<SalesSection className="nle-identification"');

    expect(hero).toContain('href="#como-funciona"');
    expect(hero).toContain('href="#oferta"');
    expect(hero).toContain('Ver cómo funciona');
    expect(hero).not.toContain('openCheckoutDrawer');
    expect(hero).not.toContain('priceLabel');
    expect(hero).not.toContain('QR');
  });

  it('orders the required sections before revealing the offer and payment', () => {
    const orderedIds = [
      'id="como-funciona"',
      'id="metodo-pausa"',
      'id="que-incluye"',
      'id="incluye"',
      'id="oferta"',
      'id="pago-qr"',
    ];

    const positions = orderedIds.map((id) => pageSource.indexOf(id));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('reveals the centralized price in offer and opens checkout from payment', () => {
    const beforeOffer = pageSource.slice(0, pageSource.indexOf('id="oferta"'));
    const offer = sourceBetween('id="oferta"', 'id="pago-qr"');
    const payment = sourceBetween('id="pago-qr"', 'className="nle-guarantee-section"');
    const checkoutOpenCalls = pageSource.match(/openCheckoutDrawer\('/g) ?? [];

    expect(beforeOffer).not.toMatch(/Bs \d/);
    expect(offer).toContain('priceLabel={priceLabel}');
    expect(offer).toContain('buttonHref="#pago-qr"');
    expect(offer).not.toContain('openCheckoutDrawer');
    expect(payment).toContain("openCheckoutDrawer('pago_qr_cta'");
    expect(checkoutOpenCalls).toHaveLength(2);
    expect(pageSource).not.toContain('Bs 39');
  });

  it('keeps the mobile sticky educational before offer and price-aware after offer', () => {
    expect(pageSource).toContain("ctaLabel={isOfferReached ? ctaLabel : 'Ver cómo funciona'}");
    expect(pageSource).toContain("href={isOfferReached ? '#pago-qr' : '#como-funciona'}");
    expect(pageSource).toContain("title={isOfferReached ? `Hoy ${priceLabel}` : 'Reto guiado de 7 días'}");
    expect(stickySource).toContain('href={href}');
    expect(stickySource).not.toContain('onClick');
  });

  it('does not add forbidden standard frontend events', () => {
    expect(pageSource).not.toContain("trackEvent('Lead'");
    expect(pageSource).not.toContain("trackEvent('Purchase'");
    expect(pageSource).not.toContain('CompleteRegistration');
  });
});
