import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DNA } from '../dna.config';

const pageSource = readFileSync(
  new URL('./NoLeEscribasSalesPage.tsx', import.meta.url),
  'utf8',
);
const legacyPageSource = readFileSync(
  new URL('./NoLeEscribasSalesPageV1.tsx', import.meta.url),
  'utf8',
);
const drawerSource = readFileSync(
  new URL('../components/sales/SalesCheckoutDrawer.tsx', import.meta.url),
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

describe('NoLeEscribasSalesPage direct offer', () => {
  it('renders the required five-block decision page copy', () => {
    expect(pageSource).toContain('No le escribas todavía.');
    expect(pageSource).toContain('No es solo un PDF.');
    expect(pageSource).toContain('Qué hacer antes de abrir el chat');
    expect(pageSource).toContain('Quién te acompaña');
    expect(pageSource).toContain('Hoy puedes entrar por:');

    expect(pageSource).toContain('Antes de volver al chat, date 7 días');
    expect(pageSource).toContain('Es un kit práctico para los minutos antes de escribirle.');
    expect(pageSource).toContain('Veyra reveló el patrón.');
    expect(pageSource).toContain('Garantía de claridad emocional');
    expect(pageSource).toContain('Tu primer acto de regreso a ti puede ser no enviar ese mensaje todavía.');
  });

  it('keeps the page short and ordered into the requested sales blocks', () => {
    const sectionOrder = [
      'className="nle-direct-hero"',
      'className="nle-section nle-direct-receives"',
      'className="nle-section nle-direct-method"',
      'className="nle-section nle-direct-janny"',
      'className="nle-section nle-direct-offer"',
    ].map((needle) => pageSource.indexOf(needle));

    expect(sectionOrder.every((position) => position >= 0)).toBe(true);
    expect(sectionOrder).toEqual([...sectionOrder].sort((a, b) => a - b));
    expect(pageSource.match(/<section /g)).toHaveLength(5);
  });

  it('uses centralized offer price labels without hardcoding the active amount', () => {
    const activePricePattern = new RegExp(`Bs\\s+${DNA.noLeEscribas.offer.price}`);

    expect(pageSource).toContain('priceLabel');
    expect(pageSource).toContain('checkoutSubmitLabel');
    expect(pageSource).toContain('value');
    expect(pageSource).toContain('currency');
    expect(pageSource).not.toMatch(activePricePattern);
    expect(pageSource).not.toContain('Bs 39');
    expect(DNA.noLeEscribas.offer.checkoutSubmitLabel).toBe(
      `Solicitar QR • ${DNA.noLeEscribas.offer.priceLabel}`,
    );
  });

  it('opens the existing checkout drawer from every direct CTA and from sticky', () => {
    const directCtaButtons = pageSource.match(/onClick=\{openCheckoutDrawer\('/g) ?? [];

    expect(pageSource).toContain("const directCtaLabel = 'SOLICITAR QR POR WHATSAPP'");
    expect(directCtaButtons).toHaveLength(5);
    expect(pageSource).toContain("openCheckoutDrawer('direct_hero_cta')");
    expect(pageSource).toContain("openCheckoutDrawer('direct_receives_cta')");
    expect(pageSource).toContain("openCheckoutDrawer('direct_offer_cta')");
    expect(pageSource).toContain("openCheckoutDrawer('direct_final_cta')");
    expect(pageSource).toContain("openCheckoutDrawer('direct_sticky_cta')");
    expect(pageSource).toContain('<SalesCheckoutDrawer');
    expect(stickySource).toContain('onClick?: () => void');
    expect(stickySource).toContain('<button');
  });

  it('does not embed a visible page form and keeps the checkout copy in the drawer', () => {
    expect(pageSource).not.toContain('<form');
    expect(pageSource).not.toContain('Nombre completo');
    expect(pageSource).not.toContain('placeholder="Ej. María Gómez"');
    expect(drawerSource).toContain('Genera tu QR seguro');
    expect(drawerSource).toContain('Déjanos tus datos para generar tu QR.');
    expect(drawerSource).toContain('No necesitas tarjeta. Pagas con QR desde tu app bancaria.');
    expect(drawerSource).toContain('Tus datos se usan solo para gestionar este pedido.');
  });

  it('tracks the QR click bridge without firing InitiateCheckout on CTA click', () => {
    const openCheckoutHandler = sourceBetween(
      'const openCheckoutDrawer =',
      'const closeCheckoutDrawer',
    );

    expect(openCheckoutHandler).toContain("trackEvent('ClickSolicitarQR'");
    expect(openCheckoutHandler).toContain("eventId: createOfferBridgeEventId('click_qr')");
    expect(openCheckoutHandler).toContain("payment_method: 'QR WhatsApp'");
    expect(openCheckoutHandler).not.toContain('startPurchaseIntent');
    expect(openCheckoutHandler).not.toContain('InitiateCheckout');
    expect(pageSource).not.toContain('InitiateCheckout');
    expect(pageSource).not.toContain("trackEvent('Lead'");
    expect(pageSource).not.toContain("trackEvent('Purchase'");
    expect(pageSource).not.toContain('CompleteRegistration');
  });

  it('sends OfferViewed once per mounted page view as a custom bridge event', () => {
    expect(pageSource).toContain('const offerViewedTrackedRef = useRef(false)');
    expect(pageSource).toContain('offerViewedTrackedRef.current = true');
    expect(pageSource).toContain("trackEvent('OfferViewed'");
    expect(pageSource).toContain("eventId: createOfferBridgeEventId('offer_viewed')");
    expect(pageSource).toContain("funnel_name: 'Oráculo psicológico místico'");
    expect(pageSource).toContain("offer_id: offerId");
  });

  it('sends complete Meta product data for ViewContent on the direct and legacy pages', () => {
    for (const source of [pageSource, legacyPageSource]) {
      expect(source).toContain("trackEvent('ViewContent'");
      expect(source).toContain('content_ids: [productId]');
      expect(source).toContain("content_name: 'Mujer, No Le Escribas'");
      expect(source).toContain("content_type: 'product'");
      expect(source).toContain('num_items: 1');
      expect(source).toContain('value,');
      expect(source).toContain('currency,');
      expect(source).toContain('userData: visitorUserData');
    }
  });

  it('keeps funnel context and purchase submission on the existing path', () => {
    expect(pageSource).toContain('persistFunnelContextFromUrl');
    expect(pageSource).toContain('startPurchaseIntent({');
    expect(pageSource).toContain('source: checkoutSource.source');
    expect(pageSource).toContain('ctaLabel: checkoutSource.ctaLabel');
    expect(pageSource).toContain('visitor: visitorOrderMetadata');
  });

  it('uses Hotmart by default when country is unknown and exposes QR only as a secondary action', () => {
    expect(pageSource).toContain("const isUnknownCountry = checkoutCountryMode === 'unknown'");
    expect(pageSource).toContain('if (!usesBoliviaCheckout && !forceBoliviaCheckout)');
    expect(pageSource).toContain('¿Estás en Bolivia? Puedes pagar por QR aquí.');
    expect(pageSource).toContain("'unknown_country_bolivia_qr_link'");
    expect(pageSource).toContain('checkoutCountryMode !== \'international\'');
  });

  it('keeps Hotmart outside orders and routes the unknown QR fallback through the modal submit', () => {
    const checkoutHandler = sourceBetween('const openCheckoutDrawer =', 'const closeCheckoutDrawer');

    expect(checkoutHandler).toContain('if (!usesBoliviaCheckout && !forceBoliviaCheckout)');
    expect(checkoutHandler).toContain('window.location.assign(checkout.toString())');
    expect(checkoutHandler).toContain('return;');
    expect(checkoutHandler).not.toContain('startPurchaseIntent');
    expect(checkoutHandler).not.toContain("trackEvent('Purchase'");
    expect(pageSource).toContain("'unknown_country_bolivia_qr_link'");
    expect(pageSource).toContain('forceBoliviaCheckout = false');
    expect(pageSource).toContain('startPurchaseIntent({');
  });

  it('logs non-sensitive checkout diagnostics only in debug mode', () => {
    expect(pageSource).toContain("get('debug_tracking') === '1'");
    expect(pageSource).toContain('[country-checkout] visitor.country=');
    expect(pageSource).toContain('[country-checkout] checkoutMode=');
    expect(pageSource).toContain('[country-checkout] checkoutSource=');
    expect(pageSource).toContain('[country-checkout] checkoutProvider=');
  });

  it('uses the real Janny photo and preserves V1 as a separate component', () => {
    expect(pageSource).toContain('janny-helguero-reconociendo.webp');
    expect(pageSource).not.toContain('janny-helguero-avatar.webp');
    expect(legacyPageSource).toContain('export function NoLeEscribasSalesPageV1()');
    expect(legacyPageSource).toContain('Tal vez solo querías mandarle un');
    expect(legacyPageSource).toContain('<StickySalesCta hasReachedOffer={hasReachedOffer} visible={isStickyCtaVisible} />');
    expect(legacyPageSource).not.toContain('directCtaLabel');
  });
});
