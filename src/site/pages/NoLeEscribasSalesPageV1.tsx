import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import { Check, Pause, Sparkles } from 'lucide-react';
import { resolveCurrentAttribution } from '../../core/attribution';
import { trackEvent } from '../../core/services/analytics';
import { useVisitor } from '../../core/visitor/VisitorContext';
import { DNA } from '../current';
import { persistFunnelContextFromUrl } from '../funnel/funnelContext';
import { startPurchaseIntent, type PurchaseCustomer } from '../purchase';
import { buildVisitorCapiUserData, buildVisitorOrderMetadata } from '../tracking/visitorUserData';
import {
  SalesBadge,
  SalesButton,
  SalesCheckoutDrawer,
  SalesFaq,
  SalesGuaranteeCard,
  SalesImageFeature,
  SalesLegalNote,
  SalesMediaShowcase,
  SalesPriceBox,
  SalesQrPayment,
  SalesSection,
  SalesTimeline,
  SalesTopBar,
  SalesValueStack,
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

const pauseSteps = [
  {
    letter: 'P',
    title: 'Para el impulso',
    text: 'No abras el chat todavía.',
  },
  {
    letter: 'A',
    title: 'Aterriza lo que sientes',
    text: 'Nombra lo que estás sintiendo.',
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
    text: 'Elige desde calma.',
  },
] as const;

const receives = [
  'Módulo de emergencia para ese momento crítico',
  'Reto guiado de 7 días',
  'Videos explicativos por módulo',
  'PDFs y workbook diario',
  'Audios descargables de acompañamiento',
  'Plan anti-recaída para noches y fines de semana',
] as const;

const paymentSteps = [
  'Dejas tu nombre y WhatsApp',
  'Recibes tu QR seguro',
  'Pagas desde tu app bancaria',
  'Confirmamos tu pago',
  'Recibes acceso al área de miembros premium',
] as const;

const valueStackItems = [
  'Módulo de Emergencia “No le escribas todavía”',
  'Reto guiado de 7 días para volver a ti',
  'Videos explicativos por módulo',
  'PDFs + Workbook diario',
  'Audios descargables de acompañamiento',
  'Checklist antes de escribirle',
  'Carta que no vas a enviar',
  'Plan anti-recaída para noches y fines de semana',
] as const;

const faqs = [
  {
    question: '¿Esto es terapia?',
    answer:
      'No. Es una herramienta de acompañamiento emocional y autocuidado. No reemplaza terapia, diagnóstico ni atención profesional.',
  },
  {
    question: '¿Esto hará que él vuelva?',
    answer:
      'No prometemos que él vuelva. Este reto está diseñado para ayudarte a pausar, ordenar lo que sientes y tomar decisiones con más calma.',
  },
  {
    question: '¿Qué pasa si ya le escribí?',
    answer:
      'Puedes empezar igual. El reto también te ayuda a ordenar lo que pasó, bajar la urgencia y decidir tu siguiente paso con más cuidado.',
  },
  {
    question: '¿Cuándo recibo el acceso?',
    answer: 'Después de confirmar tu pago por QR, recibirás el acceso al área de miembros premium.',
  },
  {
    question: '¿Necesito tarjeta?',
    answer: 'No. Pagas con QR desde tu app bancaria o billetera móvil.',
  },
  {
    question: '¿Puedo hacerlo desde mi celular?',
    answer:
      'Sí. La carta y el reto están pensados mobile-first para que puedas entrar desde tu celular cuando aparezca el impulso.',
  },
  {
    question: '¿Cuánto dura el reto?',
    answer:
      'Dura 7 días, con un módulo de emergencia para empezar justo cuando necesitas pausar.',
  },
] as const;

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="nle-section-header">
      {eyebrow ? <p className="nle-eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}

function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="nle-check-list">
      {items.map((item) => (
        <li key={item}>
          <Check aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function NoLeEscribasSalesPageV1() {
  const location = useLocation();
  const { isLoading: isVisitorLoading, visitorData } = useVisitor();
  const attribution = useMemo(() => resolveCurrentAttribution(location), [location]);
  const visitorOrderMetadata = useMemo(() => buildVisitorOrderMetadata(visitorData), [visitorData]);
  const visitorUserData = useMemo(() => buildVisitorCapiUserData(visitorData), [visitorData]);
  const {
    checkoutSubmitLabel,
    currency,
    offerCtaLabel,
    offerId,
    priceLabel,
    productId,
    qrCtaLabel,
    regularPriceLabel,
    value,
    valueTotalLabel,
  } = DNA.noLeEscribas.offer;
  const [isStickyCtaVisible, setIsStickyCtaVisible] = useState(false);
  const [hasReachedOffer, setHasReachedOffer] = useState(false);
  const [checkoutSource, setCheckoutSource] = useState<{ source: string; ctaLabel: string } | null>(
    null,
  );
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    persistFunnelContextFromUrl();
  }, [location.pathname, location.search]);

  const openCheckoutDrawer = (source: string, clickedCtaLabel: string) => () => {
    setCheckoutError(null);
    setCheckoutSource({ source, ctaLabel: clickedCtaLabel });
  };

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
      console.warn(`[NoLeEscribasSalesPageV1] ${result.message}`);
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
      content_category: 'sales_page',
      content_type: 'product',
      num_items: 1,
      product_id: productId,
      value,
      currency,
      userData: visitorUserData,
      attribution,
    }).catch(() => undefined);
  }, [
    attribution,
    attribution.shouldTrackAds,
    currency,
    isVisitorLoading,
    productId,
    value,
    visitorUserData,
  ]);

  useEffect(() => {
    const updateStickyCta = () => {
      setIsStickyCtaVisible(window.scrollY >= 420);
      const offerSection = document.getElementById('oferta');
      setHasReachedOffer(
        Boolean(offerSection && offerSection.getBoundingClientRect().top <= window.innerHeight * 0.72),
      );
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
    <main className="no-le-escribas-page" style={colorVariables}>
      <SalesTopBar text="Reto guiado de 7 días · Método P.A.U.S.A." />

      <section className="nle-hero">
        <div className="nle-container nle-hero-content">
          <div className="nle-hero-copy">
            <SalesBadge icon={<Pause aria-hidden="true" />}>RETO GUIADO DE 7 DÍAS</SalesBadge>
            <h1>
              No le escribas <span>todavía.</span>
            </h1>
            <p className="nle-hero-subheadline">
              Haz una P.A.U.S.A. antes de mandar ese mensaje que mañana puede doler más.
            </p>
            <p className="nle-hero-text">
              Un reto guiado para calmar el impulso, ordenar lo que sientes y volver a ti antes de
              escribir desde la ansiedad.
            </p>
            <SalesButton
              clarityLabel="hero-ver-como-funciona"
              dataCta="hero-ver-como-funciona"
              href="#como-funciona"
            >
              Ver cómo funciona
            </SalesButton>
            <TrustMicrocopy>Método P.A.U.S.A. · Regla de los 10 minutos · Área privada</TrustMicrocopy>
            <a
              className="nle-hero-secondary-link"
              data-clarity-label="hero-ver-oferta"
              data-cta="hero-ver-oferta"
              href="#oferta"
            >
              Ya conozco el reto, quiero ver la oferta
            </a>
          </div>
        </div>
      </section>

      <SalesSection className="nle-identification" width="narrow">
        <div className="nle-flow-copy">
          <h2>Tal vez solo querías mandarle un “hola”.</h2>
          <p>Pero tú sabes que no es solo un hola.</p>
          <p>Es ansiedad.</p>
          <p>Es esperar que responda.</p>
          <p>Es querer saber si todavía le importas.</p>
          <p>Es revisar si está en línea.</p>
          <p>Es abrir una puerta que tal vez ya te costó demasiado cerrar.</p>
          <p className="nle-gold-line">
            Ese mensaje no siempre busca amor. A veces solo busca alivio.
          </p>
          <p className="nle-gold-line">Y ahí es donde necesitas una pausa.</p>
          <SalesButton
            className="nle-soft-section-cta"
            clarityLabel="problema-como-funciona"
            dataCta="problema-como-funciona"
            href="#como-funciona"
            variant="outline"
          >
            Entiendo lo que siento
          </SalesButton>
        </div>
      </SalesSection>

      <SalesSection className="nle-honesty-section" width="narrow">
        <SectionHeader title="Esto no es una promesa falsa." />
        <div className="nle-honesty-points">
          <p>
            <Check aria-hidden="true" />
            <span>No prometemos que él vuelva.</span>
          </p>
          <p>
            <Check aria-hidden="true" />
            <span>No te vamos a decir que “solo seas fuerte”.</span>
          </p>
          <p>
            <Check aria-hidden="true" />
            <span>No necesitas decidir toda tu vida hoy.</span>
          </p>
        </div>
        <p className="nle-honesty-closing">
          Esto es una herramienta práctica para ayudarte a pausar antes de actuar desde la
          ansiedad.
        </p>
      </SalesSection>

      <section className="nle-section nle-ten-minute-section" id="como-funciona">
        <div className="nle-container">
          <SalesImageFeature
            imageAlt="Visual de la regla de los 10 minutos antes de escribirle"
            imageSrc="/assets/reconociendo-tu-poder/visual-regla-10-minutos.png.webp"
            title="Antes de escribirle, date 10 minutos."
          >
            <p>
              No tienes que resolver toda tu historia hoy. Solo necesitas crear una pausa entre lo
              que sientes y lo que haces.
            </p>
            <p className="nle-image-feature__highlight">Solo esto: 10 minutos sin enviar el mensaje.</p>
            <p>Durante esos 10 minutos, haces una P.A.U.S.A.</p>
            <SalesButton
              className="nle-soft-section-cta"
              clarityLabel="como-funciona-metodo"
              dataCta="como-funciona-metodo"
              href="#metodo-pausa"
              variant="outline"
            >
              Conocer el Método P.A.U.S.A.
            </SalesButton>
          </SalesImageFeature>
        </div>
      </section>

      <SalesSection className="nle-method-section" id="metodo-pausa">
        <SectionHeader
          title={
            <>
              El Método P.A.U.S.A.: <span>qué hacer en los 10 minutos antes de escribirle</span>
            </>
          }
          subtitle="No necesitas más fuerza de voluntad. Necesitas un proceso simple para no actuar desde la ansiedad."
        />
        <SalesTimeline items={pauseSteps} />
        <div className="nle-centered-section-cta">
          <SalesButton
            clarityLabel="metodo-que-incluye"
            dataCta="metodo-que-incluye"
            href="#que-incluye"
            variant="outline"
          >
            Ver qué incluye el reto
          </SalesButton>
        </div>
      </SalesSection>

      <SalesSection className="nle-includes-section" id="que-incluye">
        <div className="nle-includes-layout">
          <div className="nle-includes-header">
            <SectionHeader
              title={
                <>
                  <span>No es solo un PDF.</span>
                  <span>Es un kit completo para volver a ti.</span>
                </>
              }
              subtitle="Dentro del área de miembros premium tendrás videos, PDFs, workbook, audios descargables y ejercicios guiados para acompañarte paso a paso durante 7 días."
            />
          </div>
          <SalesMediaShowcase
            alt="Mockup del kit Mujer, No Le Escribas con área de miembros, workbook, audios, checklist y reto de 7 días"
            caption="Esto es lo que verás dentro del área privada."
            className="nle-includes-showcase"
            src="/assets/reconociendo-tu-poder/mockup-producto-mujer-no-le-escribas.webp"
          />
          <div className="nle-includes-list">
            <CheckList items={receives} />
            <SalesButton
              className="nle-soft-section-cta"
              clarityLabel="kit-incluye"
              dataCta="kit-incluye"
              href="#incluye"
              variant="outline"
            >
              Ver todo lo incluido
            </SalesButton>
          </div>
        </div>
      </SalesSection>

      <SalesSection className="nle-authority-section" id="quien-te-acompana">
        <div className="nle-authority-card">
          <figure className="nle-authority-photo">
            <img
              alt="Janny Helguero, fundadora del Movimiento GranDiosa Mujer"
              decoding="async"
              loading="eager"
              src="/assets/reconociendo-tu-poder/janny-helguero-reconociendo.webp"
            />
          </figure>
          <div className="nle-authority-copy">
            <SectionHeader
              eyebrow="Janny Helguero"
              title="Quién te acompaña en este reto"
              subtitle="Una guía creada desde la experiencia, la sensibilidad y el trabajo profundo con mujeres."
            />
            <div className="nle-authority-bio">
              <p>Soy Janny Helguero, fundadora del Movimiento GranDiosa Mujer.</p>
              <p>
                Durante más de 25 años he acompañado a mujeres en procesos de sanación emocional,
                reconexión personal, trabajo energético y transformación interior.
              </p>
              <p>
                He visto muchas veces cómo una mujer puede perder su centro esperando una respuesta,
                sosteniendo silencios que duelen o intentando cerrar heridas desde el impulso.
              </p>
              <p>
                Por eso nace este reto: para ayudarte a hacer una pausa antes de escribir desde la
                ansiedad, ordenar lo que sientes y volver a ti con más claridad.
              </p>
            </div>
            <ul className="nle-authority-bullets">
              <li>
                <span aria-hidden="true" className="nle-authority-bullet-mark">01</span>
                <span>Más de 25 años acompañando procesos de mujeres</span>
              </li>
              <li>
                <span aria-hidden="true" className="nle-authority-bullet-mark">02</span>
                <span>Fundadora del Movimiento GranDiosa Mujer</span>
              </li>
              <li>
                <span aria-hidden="true" className="nle-authority-bullet-mark">03</span>
                <span>Especialista en sanación emocional, energética y reconexión femenina</span>
              </li>
            </ul>
            <blockquote className="nle-authority-quote">
              <p>
                “En cada mujer hay una luz capaz de convertir el dolor en conciencia, y la ansiedad
                en una decisión más amorosa hacia sí misma.”
              </p>
              <cite>— Janny Helguero</cite>
            </blockquote>
            <p className="nle-authority-disclaimer">
              Este reto no reemplaza terapia psicológica, atención médica ni acompañamiento
              profesional en situaciones de crisis. Es una guía práctica y amorosa para ayudarte a
              pausar, observar lo que sientes y tomar decisiones desde más calma.
            </p>
            <SalesButton
              clarityLabel="janny-ver-oferta"
              dataCta="janny-ver-oferta"
              href="#oferta"
              variant="outline"
            >
              Ver la oferta
            </SalesButton>
          </div>
        </div>
      </SalesSection>

      <SalesSection className="nle-value-section" id="incluye">
        <SectionHeader
          title="Todo esto está incluido en el reto"
          subtitle="No estás comprando un PDF. Estás entrando a un sistema completo para pausar, ordenar lo que sientes y volver a ti."
        />
        <SalesValueStack items={valueStackItems} />
        <div className="nle-centered-section-cta">
          <SalesButton
            clarityLabel="incluye-ver-oferta"
            dataCta="incluye-ver-oferta"
            href="#oferta"
            variant="outline"
          >
            Ver la oferta
          </SalesButton>
        </div>
      </SalesSection>

      <SalesSection className="nle-price-section" id="oferta">
        <SalesPriceBox
          badge="Lanzamiento Bolivia"
          buttonLabel={offerCtaLabel}
          buttonClarityLabel="oferta-pago-qr"
          buttonDataCta="oferta-pago-qr"
          buttonHref="#pago-qr"
          microcopy="Pago con QR · Acceso al área privada · Garantía de 7 días"
          priceLabel={priceLabel}
          regularPriceLabel={regularPriceLabel}
          title="Hoy puedes entrar al reto por:"
          valueTotalLabel={valueTotalLabel}
        >
          <p className="nle-price-support">
            Acceso completo al reto de 7 días, área privada, videos, audios, workbook y ejercicios
            guiados.
          </p>
          <p className="nle-price-emotional">
            Una forma guiada de pausar el impulso, ordenar lo que sientes y volver a ti.
          </p>
        </SalesPriceBox>
      </SalesSection>

      <SalesSection className="nle-payment-section" id="pago-qr">
        <SalesQrPayment
          buttonClarityLabel="pago-qr-open-checkout"
          buttonDataCta="pago-qr-open-checkout"
          buttonLabel={qrCtaLabel}
          onButtonClick={openCheckoutDrawer('pago_qr_cta', qrCtaLabel)}
          imageAlt="Pago seguro por QR desde WhatsApp en Bolivia"
          imageSrc="/assets/reconociendo-tu-poder/pago-seguro-por-qr.webp"
          microcopy="El QR se genera según tu orden. No te pediremos datos de tarjeta."
          steps={paymentSteps}
          subtitle="El pago se realiza de forma simple por QR. Después de confirmar tu pago, recibes el acceso al área privada del reto."
          title="Pagas con QR. Entras al área privada."
        />
      </SalesSection>

      <SalesSection className="nle-guarantee-section" width="narrow">
        <SalesGuaranteeCard
          body={
            <>
              <p>
                Entra, revisa el contenido y si sientes que no es para ti, puedes solicitar la
                devolución dentro de los primeros 7 días.
              </p>
            </>
          }
          imageAlt="Sello visual de garantía de 7 días"
          imageSrc="/assets/reconociendo-tu-poder/garantia.webp"
          title="Garantía “No era para mí” de 7 días"
        />
      </SalesSection>

      <SalesSection className="nle-faq-section" width="narrow">
        <SectionHeader title="Preguntas frecuentes" />
        <SalesFaq items={faqs} />
      </SalesSection>

      <SalesSection className="nle-legal-section" width="narrow">
        <SalesLegalNote title="Importante">
          <p>
            Este reto es una herramienta de acompañamiento emocional y autocuidado. No reemplaza
            terapia, diagnóstico, tratamiento psicológico ni atención profesional.
          </p>
          <p>
            Si estás en una situación de peligro, violencia, amenaza, crisis emocional intensa o
            sientes que podrías hacerte daño, busca ayuda inmediata con una persona de confianza,
            servicios de emergencia de tu país o un profesional de salud mental.
          </p>
        </SalesLegalNote>
      </SalesSection>

      <SalesSection className="nle-final-cta" width="narrow">
        <div className="nle-final-card">
          <Sparkles aria-hidden="true" />
          <h2>Antes de volver a él, vuelve a ti.</h2>
          <p>No tienes que decidir toda tu historia hoy. Solo empieza con 10 minutos.</p>
          <SalesButton
            clarityLabel="final-pago-qr"
            dataCta="final-pago-qr"
            href="#pago-qr"
            variant="outline"
          >
            Ir al pago QR
          </SalesButton>
          <TrustMicrocopy>
            Pago con QR · Sin tarjeta · Acceso al área de miembros premium
          </TrustMicrocopy>
        </div>
      </SalesSection>

      <StickySalesCta hasReachedOffer={hasReachedOffer} visible={isStickyCtaVisible} />
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
    </main>
  );
}

export default NoLeEscribasSalesPageV1;
