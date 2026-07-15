import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import { Check, Heart, Pause, ShieldCheck } from 'lucide-react';
import { resolveCurrentAttribution } from '../../core/attribution';
import { trackEvent } from '../../core/services/analytics';
import { useVisitor } from '../../core/visitor/VisitorContext';
import { DNA } from '../current';
import { getCheckoutCountryMode } from '../checkoutCountry';
import { persistFunnelContextFromUrl } from '../funnel/funnelContext';
import { startPurchaseIntent, type PurchaseCustomer } from '../purchase';
import { buildVisitorCapiUserData, buildVisitorOrderMetadata } from '../tracking/visitorUserData';
import {
  SalesButton,
  SalesCheckoutDrawer,
  SalesTopBar,
  StickySalesCta,
  TrustMicrocopy,
} from '../components/sales';

type NoLeEscribasColorVariables = CSSProperties &
  Record<
    | '--nle-deep-night'
    | '--nle-aubergine'
    | '--nle-royal-plum'
    | '--nle-ritual-gold'
    | '--nle-champagne'
    | '--nle-moon-lavender'
    | '--nle-warm-white'
    | '--nle-soft-mauve'
    | '--nle-whatsapp-green',
    string
  >;

const colorVariables: NoLeEscribasColorVariables = {
  '--nle-deep-night': DNA.noLeEscribas.colors.deepNight,
  '--nle-aubergine': DNA.noLeEscribas.colors.aubergine,
  '--nle-royal-plum': DNA.noLeEscribas.colors.royalPlum,
  '--nle-ritual-gold': DNA.noLeEscribas.colors.ritualGold,
  '--nle-champagne': DNA.noLeEscribas.colors.champagne,
  '--nle-moon-lavender': DNA.noLeEscribas.colors.moonLavender,
  '--nle-warm-white': DNA.noLeEscribas.colors.warmWhite,
  '--nle-soft-mauve': DNA.noLeEscribas.colors.softMauve,
  '--nle-whatsapp-green': DNA.noLeEscribas.colors.whatsappGreen,
};

const directCtaLabel = 'SOLICITAR QR POR WHATSAPP';
const internationalCtaLabel = 'QUIERO ACCEDER POR USD 7';
const offerContentCategory = 'Reto 7 días';

function createOfferBridgeEventId(prefix: string): string {
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
    return `${prefix}_${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

const receiveItems = [
  'Reto guiado de 7 días.',
  'Kit de emergencia “No le escribas todavía”.',
  'Ejercicios para momentos de impulso.',
  'Prácticas para descargar sin enviar.',
  'Guía del Método P.A.U.S.A.',
  'Acceso digital.',
  'Soporte por WhatsApp para pago y acceso.',
] as const;

const pauseSteps = [
  {
    letter: 'P',
    title: 'Para el impulso',
    text: 'No abras el chat todavía.',
  },
  {
    letter: 'A',
    title: 'Aterriza lo que sientes',
    text: 'Nombra la emoción.',
  },
  {
    letter: 'U',
    title: 'Ubica la realidad',
    text: 'Separa hechos de fantasías.',
  },
  {
    letter: 'S',
    title: 'Sustituye el mensaje',
    text: 'Descarga sin enviarlo.',
  },
  {
    letter: 'A',
    title: 'Acuérdate de ti',
    text: 'Decide desde calma.',
  },
] as const;

const offerIncludes = [
  'reto completo',
  'ejercicios prácticos',
  'guía P.A.U.S.A.',
  'material de apoyo',
  'acceso digital',
  'soporte por WhatsApp',
  'garantía de claridad emocional',
] as const;

const guaranteeLimits = [
  'No promete que vas a olvidar.',
  'No promete que él volverá.',
  'No promete sanar todo en 7 días.',
] as const;

function DirectSectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="nle-direct-section-header">
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}

function DirectCheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="nle-direct-check-list">
      {items.map((item) => (
        <li key={item}>
          <Check aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function NoLeEscribasSalesPage() {
  const location = useLocation();
  const { isLoading: isVisitorLoading, visitorData } = useVisitor();
  const attribution = useMemo(() => resolveCurrentAttribution(location), [location]);
  const visitorOrderMetadata = useMemo(() => buildVisitorOrderMetadata(visitorData), [visitorData]);
  const visitorUserData = useMemo(() => buildVisitorCapiUserData(visitorData), [visitorData]);
  const {
    checkoutSubmitLabel,
    currency,
    internationalCheckoutUrl,
    internationalCurrency,
    internationalPaymentProvider,
    internationalPriceLabel,
    offerId,
    priceLabel,
    productId,
    regularPriceLabel,
    value,
  } = DNA.noLeEscribas.offer;
  const checkoutCountryMode = getCheckoutCountryMode(visitorData?.country_code);
  const usesBoliviaCheckout = checkoutCountryMode === 'bolivia';
  const isUnknownCountry = checkoutCountryMode === 'unknown';
  const displayPriceLabel = usesBoliviaCheckout ? priceLabel : internationalPriceLabel;
  const displayCurrency = usesBoliviaCheckout ? currency : internationalCurrency;
  const displayValue = usesBoliviaCheckout ? value : 7;
  const ctaLabel = usesBoliviaCheckout ? directCtaLabel : internationalCtaLabel;
  const displayedReceiveItems = !usesBoliviaCheckout
    ? receiveItems.filter((item) => !item.includes('WhatsApp'))
    : receiveItems;
  const displayedOfferIncludes = !usesBoliviaCheckout
    ? offerIncludes.filter((item) => item !== 'soporte por WhatsApp')
    : offerIncludes;
  const [isStickyCtaVisible, setIsStickyCtaVisible] = useState(false);
  const [checkoutSource, setCheckoutSource] = useState<{ source: string; ctaLabel: string } | null>(
    null,
  );
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const offerViewedTrackedRef = useRef(false);

  useEffect(() => {
    persistFunnelContextFromUrl();
  }, [location.pathname, location.search]);

  const openCheckoutDrawer = (
    source: string,
    clickedCtaLabel = directCtaLabel,
    forceBoliviaCheckout = false,
  ) => () => {
    if (!usesBoliviaCheckout && !forceBoliviaCheckout) {
      if (attribution.shouldTrackAds && !isVisitorLoading) {
        void trackEvent('ClickHotmartCheckout', {
          eventId: createOfferBridgeEventId('click_hotmart'),
          content_ids: [productId],
          content_name: 'Mujer, No Le Escribas',
          content_type: 'product',
          cta_label: internationalCtaLabel,
          currency: internationalCurrency,
          payment_method: internationalPaymentProvider,
          value: 7,
          userData: visitorUserData,
          attribution,
        }).catch(() => undefined);
      }

      const checkout = new URL(internationalCheckoutUrl);
      const currentParams = new URLSearchParams(location.search);
      currentParams.forEach((paramValue, key) => {
        if (
          ['fbclid', 'fbc', 'fbp', 'ttclid', 'gclid', 'debug_tracking'].includes(key) ||
          key.toLowerCase().startsWith('utm_')
        ) {
          checkout.searchParams.set(key, paramValue);
        }
      });
      window.location.assign(checkout.toString());
      return;
    }

    if (attribution.shouldTrackAds && !isVisitorLoading) {
      void trackEvent('ClickSolicitarQR', {
        eventId: createOfferBridgeEventId('click_qr'),
        content_ids: [productId],
        content_name: 'Mujer, No Le Escribas',
        content_type: 'product',
        cta_label: clickedCtaLabel,
        currency,
        payment_method: 'QR WhatsApp',
        value,
        userData: visitorUserData,
        attribution,
      }).catch(() => undefined);
    }

    setCheckoutError(null);
    setCheckoutSource({ source, ctaLabel: clickedCtaLabel });
  };

  const openUnknownCountryBoliviaCheckout = openCheckoutDrawer(
    'unknown_country_bolivia_qr_link',
    '¿Estás en Bolivia? Puedes pagar por QR aquí.',
    true,
  );

  const closeCheckoutDrawer = useCallback(() => {
    if (!checkoutLoading) {
      setCheckoutSource(null);
      setCheckoutError(null);
    }
  }, [checkoutLoading]);

  const handleCheckoutSubmit = async (customer: PurchaseCustomer) => {
    if (!checkoutSource) {
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);

    const result = await startPurchaseIntent({
      productId,
      offerId,
      productName: 'Mujer, No Le Escribas',
      value,
      currency,
      source: checkoutSource.source,
      ctaLabel: checkoutSource.ctaLabel,
      customer,
      visitor: visitorOrderMetadata,
    });

    if (result.status !== 'opened') {
      console.warn(`[NoLeEscribasSalesPage] ${result.message}`);
      setCheckoutError(result.message);
      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    if (!attribution.shouldTrackAds || isVisitorLoading) {
      return;
    }

    const trackingKey = `${DNA.siteId}.no-le-escribas.view-content`;

    try {
      if (window.sessionStorage.getItem(trackingKey) === '1') {
        return;
      }

      window.sessionStorage.setItem(trackingKey, '1');
    } catch {
      // Analytics remains safe when storage is unavailable.
    }

    void trackEvent('ViewContent', {
      content_ids: [productId],
      content_name: 'Mujer, No Le Escribas',
      content_category: offerContentCategory,
      content_type: 'product',
      num_items: 1,
      product_id: productId,
      value: displayValue,
      currency: displayCurrency,
      userData: visitorUserData,
      attribution,
    }).catch(() => undefined);
  }, [
    attribution,
    attribution.shouldTrackAds,
    displayCurrency,
    displayValue,
    isVisitorLoading,
    productId,
    visitorUserData,
  ]);

  useEffect(() => {
    if (!attribution.shouldTrackAds || isVisitorLoading || offerViewedTrackedRef.current) {
      return;
    }

    offerViewedTrackedRef.current = true;

    void trackEvent('OfferViewed', {
      eventId: createOfferBridgeEventId('offer_viewed'),
      content_ids: [productId],
      content_name: 'Mujer, No Le Escribas',
      content_type: 'product',
      content_category: offerContentCategory,
      currency: displayCurrency,
      funnel_name: 'Oráculo psicológico místico',
      offer_id: offerId,
      value: displayValue,
      userData: visitorUserData,
      attribution,
    }).catch(() => undefined);
  }, [
    attribution,
    attribution.shouldTrackAds,
    displayCurrency,
    displayValue,
    isVisitorLoading,
    offerId,
    productId,
    visitorUserData,
  ]);

  useEffect(() => {
    const updateStickyCta = () => {
      setIsStickyCtaVisible(window.scrollY >= 360);
    };

    updateStickyCta();
    window.addEventListener('scroll', updateStickyCta, { passive: true });
    window.addEventListener('resize', updateStickyCta);

    return () => {
      window.removeEventListener('scroll', updateStickyCta);
      window.removeEventListener('resize', updateStickyCta);
    };
  }, []);

  return (
    <main className="no-le-escribas-page nle-direct-page" style={colorVariables}>
      <SalesTopBar
        text={
          usesBoliviaCheckout
            ? `Mujer, No Le Escribas · Hoy ${priceLabel} · Pago por QR`
            : `Mujer, No Le Escribas · Hoy ${internationalPriceLabel} · Pago seguro con Hotmart`
        }
      />

      <section className="nle-direct-hero">
        <div className="nle-container nle-direct-hero-grid">
          <div className="nle-direct-hero-copy">
            <span className="nle-direct-kicker">
              <Pause aria-hidden="true" />
              Kit guiado de 7 días
            </span>
            <h1>No le escribas todavía.</h1>
            <p className="nle-direct-hero-subtitle">
              Antes de volver al chat, date 7 días para hacer una P.A.U.S.A. y volver a ti.
            </p>
            <p className="nle-direct-hero-text">
              Mujer, No Le Escribas es un kit guiado para ayudarte a frenar el impulso, ordenar lo
              que sientes y decidir desde calma, no desde ansiedad.
            </p>
            <div className="nle-direct-emotional-copy">
              <p>No necesitas hacerte la fuerte.</p>
              <p>No necesitas fingir que no te importa.</p>
              <p>No necesitas resolver toda tu vida hoy.</p>
              <strong>Solo necesitas una pausa antes de enviar.</strong>
            </div>
            <div className="nle-direct-hero-actions">
              <SalesButton
                clarityLabel="direct-hero-open-checkout"
                dataCta="direct-hero-open-checkout"
                onClick={openCheckoutDrawer('direct_hero_cta')}
              >
                {ctaLabel}
              </SalesButton>
              <TrustMicrocopy>
                {usesBoliviaCheckout
                  ? 'Pago por QR en Bolivia. No necesitas tarjeta.'
                  : 'Pago internacional seguro procesado por Hotmart.'}
              </TrustMicrocopy>
              {isUnknownCountry ? (
                <button
                  className="nle-bolivia-fallback-link"
                  data-clarity-label="unknown-country-bolivia-qr"
                  data-cta="unknown-country-bolivia-qr"
                  onClick={openUnknownCountryBoliviaCheckout}
                  type="button"
                >
                  ¿Estás en Bolivia? Puedes pagar por QR aquí.
                </button>
              ) : null}
            </div>
          </div>
          <aside className="nle-direct-quick-offer" aria-label="Resumen de la oferta">
            <span>Hoy puedes entrar por:</span>
            <strong>{displayPriceLabel}</strong>
            <p>Acceso completo al kit guiado de 7 días.</p>
          </aside>
        </div>
      </section>

      <section className="nle-section nle-direct-receives">
        <div className="nle-container nle-direct-two-column">
          <div>
            <DirectSectionHeader
              title="No es solo un PDF."
              subtitle="Es un kit práctico para los minutos antes de escribirle."
            />
            <DirectCheckList items={displayedReceiveItems} />
            <div className="nle-direct-highlight">
              <p>No estás comprando información.</p>
              <strong>Estás comprando una pausa guiada para no actuar desde ansiedad.</strong>
            </div>
            <SalesButton
              clarityLabel="direct-receives-open-checkout"
              dataCta="direct-receives-open-checkout"
              onClick={openCheckoutDrawer('direct_receives_cta')}
            >
              {ctaLabel}
            </SalesButton>
          </div>
          <figure className="nle-direct-kit-mockup">
            <img
              alt="Mockup del kit Mujer, No Le Escribas"
              decoding="async"
              loading="lazy"
              src="/assets/reconociendo-tu-poder/mockup-producto-mujer-no-le-escribas.webp"
            />
          </figure>
        </div>
      </section>

      <section className="nle-section nle-direct-method">
        <div className="nle-container">
          <DirectSectionHeader title="Qué hacer antes de abrir el chat" />
          <div className="nle-direct-pause-grid">
            {pauseSteps.map((step) => (
              <article className="nle-direct-pause-card" key={`${step.letter}-${step.title}`}>
                <span>{step.letter}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
          <div className="nle-direct-highlight nle-direct-highlight--center">
            <p>El objetivo no es que no sientas.</p>
            <strong>Es que no entregues tu paz a un impulso de cinco minutos.</strong>
          </div>
        </div>
      </section>

      <section className="nle-section nle-direct-janny">
        <div className="nle-container nle-direct-janny-card">
          <figure className="nle-direct-janny-photo">
            <img
              alt="Janny Helguero, fundadora de GranDiosa Mujer"
              decoding="async"
              loading="lazy"
              src="/assets/reconociendo-tu-poder/janny-helguero-reconociendo.webp"
            />
          </figure>
          <div className="nle-direct-janny-copy">
            <DirectSectionHeader title="Quién te acompaña" />
            <p className="nle-direct-name">Janny Helguero</p>
            <p>Fundadora de GranDiosa Mujer.</p>
            <p>Más de 25 años acompañando procesos emocionales de mujeres.</p>
            <div className="nle-direct-funnel-bridge">
              <p>Veyra reveló el patrón.</p>
              <strong>Janny te acompaña a ordenarlo.</strong>
            </div>
            <p>
              GranDiosa Mujer es para mujeres que quieren dejar de repetirse en vínculos y volver a
              sí mismas sin castigarse por haber amado.
            </p>
            <div className="nle-direct-highlight">
              <p>No entras a un reto para juzgarte.</p>
              <strong>Entras a un espacio para volver a ti.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="nle-section nle-direct-offer" id="oferta">
        <div className="nle-container nle-direct-offer-grid">
          <div className="nle-direct-price-card">
            <span className="nle-direct-kicker">
              <ShieldCheck aria-hidden="true" />
              Acceso digital inmediato tras confirmar pago
            </span>
            <h2>Hoy puedes entrar por:</h2>
            <p className="nle-direct-price">{displayPriceLabel}</p>
            <p>Acceso completo al kit guiado de 7 días.</p>
            <DirectCheckList items={displayedOfferIncludes} />
            <div className="nle-direct-highlight">
              <p>Te cuesta menos que una salida impulsiva.</p>
              <strong>Pero puede evitarte otro mensaje enviado desde ansiedad.</strong>
            </div>
            <SalesButton
              clarityLabel="direct-offer-open-checkout"
              dataCta="direct-offer-open-checkout"
              onClick={openCheckoutDrawer('direct_offer_cta')}
            >
              {ctaLabel}
            </SalesButton>
            <TrustMicrocopy>
              {usesBoliviaCheckout
                ? 'Al tocar el botón, se abre el formulario seguro para generar tu pedido y solicitar tu QR.'
                : 'Al tocar el botón, irás al checkout internacional seguro de Hotmart.'}
            </TrustMicrocopy>
          </div>

          <div className="nle-direct-guarantee-card">
            <Heart aria-hidden="true" />
            <h3>Garantía de claridad emocional</h3>
            <p>
              Si recorres el reto y sientes que no te ayudó a entender mejor tu impulso o a pausar
              antes de actuar, puedes escribirnos dentro del período de garantía.
            </p>
            <DirectCheckList items={guaranteeLimits} />
            <div className="nle-direct-highlight">
              <p>Promete algo más real:</p>
              <strong>una estructura para volver a ti antes de escribir desde ansiedad.</strong>
            </div>
            <div className="nle-direct-final-copy">
              <p>Antes de escribirle desde ansiedad, elígete por 7 días.</p>
              <p>No decidas desde la herida.</p>
              <strong>Haz una pausa.</strong>
            </div>
            <SalesButton
              clarityLabel="direct-final-open-checkout"
              dataCta="direct-final-open-checkout"
              onClick={openCheckoutDrawer('direct_final_cta')}
              variant="outline"
            >
              {ctaLabel}
            </SalesButton>
            <p className="nle-direct-last-line">
              Tu primer acto de regreso a ti puede ser no enviar ese mensaje todavía.
            </p>
          </div>
        </div>
      </section>

      <StickySalesCta
        hasReachedOffer
        label={ctaLabel}
        onClick={openCheckoutDrawer('direct_sticky_cta')}
        subtitle={usesBoliviaCheckout ? 'Pago por QR en Bolivia' : 'Pago internacional con Hotmart'}
        visible={isStickyCtaVisible}
      />
      {checkoutCountryMode !== 'international' ? (
        <SalesCheckoutDrawer
          error={checkoutError}
          loading={checkoutLoading}
          onClose={closeCheckoutDrawer}
          onSubmit={handleCheckoutSubmit}
          open={checkoutSource !== null}
          priceLabel={priceLabel}
          productName="Mujer, No Le Escribas"
          regularPriceLabel={regularPriceLabel}
          submitLabel={checkoutSubmitLabel}
        />
      ) : null}
    </main>
  );
}

export default NoLeEscribasSalesPage;
