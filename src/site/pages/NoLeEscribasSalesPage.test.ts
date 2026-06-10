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

describe('NoLeEscribasSalesPage offer-focused flow', () => {
  it('keeps the hero educational and points its only CTA to content', () => {
    const hero = sourceBetween('<section className="nle-hero">', '<SalesSection className="nle-identification"');

    expect(hero).toContain('href="#como-funciona"');
    expect(hero).toContain('Ver cómo funciona');
    expect(hero).not.toContain('href="#oferta"');
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

  it('reveals the centralized price and opens checkout only from offer', () => {
    const beforeOffer = pageSource.slice(0, pageSource.indexOf('id="oferta"'));
    const offer = sourceBetween('id="oferta"', 'id="pago-qr"');
    const payment = sourceBetween('id="pago-qr"', 'className="nle-guarantee-section"');
    const final = sourceBetween('className="nle-final-cta"', '<StickySalesCta');
    const checkoutOpenCalls = pageSource.match(/openCheckoutDrawer\('/g) ?? [];

    expect(beforeOffer).not.toMatch(/Bs \d/);
    expect(offer).toContain('priceLabel={priceLabel}');
    expect(offer).toContain('buttonDataCta="oferta-open-checkout"');
    expect(offer).toContain("openCheckoutDrawer('oferta_cta'");
    expect(offer).toContain('`Quiero mi QR por ${priceLabel}`');
    expect(payment).toContain('buttonHref="#oferta"');
    expect(payment).toContain('buttonDataCta="qr-ver-oferta"');
    expect(payment).not.toContain('openCheckoutDrawer');
    expect(final).toContain('href="#oferta"');
    expect(final).not.toContain('openCheckoutDrawer');
    expect(checkoutOpenCalls).toHaveLength(1);
    expect(pageSource).not.toContain('Bs 39');
  });

  it('keeps the sticky focused on offer without opening checkout', () => {
    expect(stickySource).toContain('data-cta="sticky-ver-oferta"');
    expect(stickySource).toContain('href="#oferta"');
    expect(stickySource).toContain('Ver la oferta');
    expect(stickySource).not.toContain('onClick');
    expect(stickySource).not.toContain('openCheckout');
  });

  it('removes redundant intermediate buttons', () => {
    expect(pageSource).not.toContain('Entiendo lo que siento');
    expect(pageSource).not.toContain('Conocer el método P.A.U.S.A.');
    expect(pageSource).not.toContain('Ver qué incluye el reto');
    expect(pageSource).not.toContain('Ver todo lo incluido');
    expect(pageSource).not.toContain('incluye-ver-oferta');
  });

  it('does not add forbidden standard frontend events', () => {
    expect(pageSource).not.toContain("trackEvent('Lead'");
    expect(pageSource).not.toContain("trackEvent('Purchase'");
    expect(pageSource).not.toContain('CompleteRegistration');
  });
});
