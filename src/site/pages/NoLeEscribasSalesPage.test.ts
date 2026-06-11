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

describe('NoLeEscribasSalesPage trust-first flow', () => {
  it('keeps the hero educational without price, QR, or checkout behavior', () => {
    const hero = sourceBetween(
      '<section className="nle-hero">',
      '<SalesSection className="nle-identification"',
    );

    expect(hero).toContain('RETO GUIADO DE 7 DÍAS');
    expect(hero).toContain('No le escribas <span>todavía.</span>');
    expect(hero).toContain('href="#como-funciona"');
    expect(hero).toContain('dataCta="hero-ver-como-funciona"');
    expect(hero).toContain('Ya conozco el reto, quiero ver la oferta');
    expect(hero).toContain('data-cta="hero-ver-oferta"');
    expect(hero).not.toContain('openCheckoutDrawer');
    expect(hero).not.toContain('priceLabel');
    expect(hero).not.toMatch(/Bs \d/);
    expect(hero).not.toContain('QR');
  });

  it('uses soft anchor CTAs through problem, method, and kit sections', () => {
    const problem = sourceBetween(
      '<SalesSection className="nle-identification"',
      '<SalesSection className="nle-honesty-section"',
    );
    const howItWorks = sourceBetween('id="como-funciona"', 'id="metodo-pausa"');
    const method = sourceBetween('id="metodo-pausa"', 'id="que-incluye"');
    const kit = sourceBetween('id="que-incluye"', 'id="quien-te-acompana"');

    expect(problem).toContain('Entiendo lo que siento');
    expect(problem).toContain('href="#como-funciona"');
    expect(problem).toContain('dataCta="problema-como-funciona"');
    expect(howItWorks).toContain('Antes de escribirle, date 10 minutos.');
    expect(howItWorks).toContain('Conocer el Método P.A.U.S.A.');
    expect(howItWorks).toContain('href="#metodo-pausa"');
    expect(howItWorks).toContain('dataCta="como-funciona-metodo"');
    expect(method).toContain('El Método P.A.U.S.A.');
    expect(pageSource).toContain("title: 'Para el impulso'");
    expect(pageSource).toContain("title: 'Aterriza lo que sientes'");
    expect(pageSource).toContain("title: 'Ubica la realidad'");
    expect(pageSource).toContain("title: 'Sustituye el mensaje'");
    expect(pageSource).toContain("title: 'Acuérdate de ti'");
    expect(method).toContain('href="#que-incluye"');
    expect(method).toContain('dataCta="metodo-que-incluye"');
    expect(kit).toContain('No es solo un PDF.');
    expect(kit).toContain('Es un kit completo para volver a ti.');
    expect(kit).toContain('href="#incluye"');
    expect(kit).toContain('dataCta="kit-incluye"');
    expect(`${problem}${howItWorks}${method}${kit}`).not.toContain('openCheckoutDrawer');
  });

  it('places the Janny authority section before any offer price', () => {
    const janny = sourceBetween('id="quien-te-acompana"', 'id="incluye"');
    const sectionPositions = [
      'id="como-funciona"',
      'id="metodo-pausa"',
      'id="que-incluye"',
      'id="quien-te-acompana"',
      'id="incluye"',
      'id="oferta"',
      'id="pago-qr"',
    ].map((id) => pageSource.indexOf(id));

    expect(sectionPositions.every((position) => position >= 0)).toBe(true);
    expect(sectionPositions).toEqual([...sectionPositions].sort((a, b) => a - b));
    expect(janny).toContain('Quién te acompaña en este reto');
    expect(janny).toContain('Janny Helguero');
    expect(janny).toContain('Movimiento GranDiosa Mujer');
    expect(janny).toContain('Más de 25 años acompañando procesos de mujeres');
    expect(janny).toContain('Fundadora del Movimiento GranDiosa Mujer');
    expect(janny).toContain('Especialista en sanación emocional');
    expect(janny).toContain('Este reto no reemplaza terapia psicológica');
    expect(janny).toContain('janny-helguero-reconociendo.webp');
    expect(janny).not.toContain('janny-helguero-avatar.webp');
    expect(janny).toContain('dataCta="janny-ver-oferta"');
    expect(janny).toContain('href="#oferta"');
    expect(janny).not.toContain('openCheckoutDrawer');
    expect(janny).not.toMatch(/Bs \d/);
  });

  it('reveals centralized pricing only in the offer and sends the user to payment QR', () => {
    const beforeOffer = pageSource.slice(0, pageSource.indexOf('id="oferta"'));
    const offer = sourceBetween('id="oferta"', 'id="pago-qr"');
    const valueStack = sourceBetween('id="incluye"', 'id="oferta"');

    expect(beforeOffer).not.toMatch(/Bs \d/);
    expect(valueStack).toContain('Todo esto está incluido en el reto');
    expect(valueStack).toContain('dataCta="incluye-ver-oferta"');
    expect(valueStack).toContain('href="#oferta"');
    expect(offer).toContain('priceLabel={priceLabel}');
    expect(offer).toContain('regularPriceLabel={regularPriceLabel}');
    expect(offer).toContain('valueTotalLabel={valueTotalLabel}');
    expect(offer).toContain('buttonLabel={offerCtaLabel}');
    expect(offer).toContain('buttonHref="#pago-qr"');
    expect(offer).toContain('buttonDataCta="oferta-pago-qr"');
    expect(offer).not.toContain('openCheckoutDrawer');
    expect(pageSource).not.toContain('Bs 29');
    expect(pageSource).not.toContain('Bs 39');
  });

  it('opens checkout only from the pago QR CTA', () => {
    const payment = sourceBetween('id="pago-qr"', 'className="nle-guarantee-section"');
    const guarantee = sourceBetween(
      'className="nle-guarantee-section"',
      'className="nle-faq-section"',
    );
    const final = sourceBetween('className="nle-final-cta"', '<StickySalesCta');
    const checkoutOpenCalls = pageSource.match(/openCheckoutDrawer\('/g) ?? [];

    expect(payment).toContain('buttonLabel={qrCtaLabel}');
    expect(payment).toContain('buttonDataCta="pago-qr-open-checkout"');
    expect(payment).toContain("openCheckoutDrawer('pago_qr_cta', qrCtaLabel)");
    expect(guarantee).toContain('Garantía “No era para mí” de 7 días');
    expect(guarantee).not.toContain('openCheckoutDrawer');
    expect(final).toContain('href="#pago-qr"');
    expect(final).not.toContain('openCheckoutDrawer');
    expect(checkoutOpenCalls).toHaveLength(1);
  });

  it('keeps the sticky dynamic and anchor-only', () => {
    expect(stickySource).toContain("const href = hasReachedOffer ? '#pago-qr' : '#como-funciona'");
    expect(stickySource).toContain(
      "const label = hasReachedOffer ? 'Quiero entrar al reto' : 'Ver cómo funciona'",
    );
    expect(stickySource).toContain('data-cta="sticky-primary"');
    expect(stickySource).not.toContain('onClick');
    expect(stickySource).not.toContain('openCheckout');
  });

  it('does not add forbidden standard frontend events', () => {
    expect(pageSource).not.toContain("trackEvent('Lead'");
    expect(pageSource).not.toContain("trackEvent('Purchase'");
    expect(pageSource).not.toContain('CompleteRegistration');
  });
});
