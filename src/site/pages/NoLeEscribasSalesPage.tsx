import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Check, Pause, ShieldCheck, Sparkles } from 'lucide-react';
import { DNA } from '../current';
import {
  SalesBadge,
  SalesButton,
  SalesFaq,
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
    title: 'Parar',
    text: 'No abras el chat todavía.',
  },
  {
    letter: 'A',
    title: 'Aterrizar',
    text: 'Nombra lo que estás sintiendo.',
  },
  {
    letter: 'U',
    title: 'Ubicar',
    text: 'Separa hechos de fantasías.',
  },
  {
    letter: 'S',
    title: 'Sustituir',
    text: 'Descarga sin enviarlo.',
  },
  {
    letter: 'A',
    title: 'Acordarte de ti',
    text: 'Elige desde calma.',
  },
] as const;

const receives = [
  'Módulo de emergencia para empezar cuando estás a punto de escribirle',
  'Reto guiado de 7 días, paso a paso',
  'Videos explicativos para cada módulo',
  'PDFs y workbook diario',
  'Audios descargables de acompañamiento',
  'Checklist antes de mandar ese mensaje',
  'Carta que escribes para soltar, no para enviar',
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
  { name: 'Módulo de Emergencia “No le escribas todavía”', value: 'Bs 27' },
  { name: 'Reto guiado de 7 días para volver a ti', value: 'Bs 67' },
  { name: 'Videos explicativos por módulo', value: 'Bs 47' },
  { name: 'PDFs + Workbook diario', value: 'Bs 37' },
  { name: 'Audios descargables de acompañamiento', value: 'Bs 47' },
  { name: 'Checklist antes de escribirle', value: 'Bs 17' },
  { name: 'Carta que no vas a enviar', value: 'Bs 17' },
  { name: 'Plan anti-recaída para noches y fines de semana', value: 'Bs 27' },
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

export function NoLeEscribasSalesPage() {
  const { ctaLabel, priceLabel, regularPriceLabel, valueTotalLabel } = DNA.noLeEscribas.offer;
  const heroRef = useRef<HTMLElement | null>(null);
  const tenMinuteRef = useRef<HTMLElement | null>(null);
  const [isStickyCtaVisible, setIsStickyCtaVisible] = useState(false);

  useEffect(() => {
    const updateStickyCtaVisibility = () => {
      const tenMinuteBottom = tenMinuteRef.current?.getBoundingClientRect().bottom ?? 0;
      setIsStickyCtaVisible(tenMinuteBottom <= 0);
    };

    updateStickyCtaVisibility();
    window.addEventListener('scroll', updateStickyCtaVisibility, { passive: true });
    window.addEventListener('resize', updateStickyCtaVisibility);

    return () => {
      window.removeEventListener('scroll', updateStickyCtaVisibility);
      window.removeEventListener('resize', updateStickyCtaVisibility);
    };
  }, []);

  return (
    <main className="no-le-escribas-page" style={colorVariables}>
      <SalesTopBar text="Acceso privado · Pago seguro con QR · Garantía 7 días" />

      <section className="nle-hero" ref={heroRef}>
        <div className="nle-container nle-hero-content">
          <div className="nle-hero-copy">
            <SalesBadge icon={<Pause aria-hidden="true" />}>
              Método P.A.U.S.A. · Reto 7 días
            </SalesBadge>
            <h1>
              No le escribas <span>todavía.</span>
            </h1>
            <p className="nle-hero-subheadline">
              Haz una P.A.U.S.A. antes de mandar ese mensaje que mañana puede dolerte.
            </p>
            <p className="nle-hero-text">
              Un kit de emergencia emocional para calmar el impulso, ordenar lo que sientes y
              volver a ti antes de buscarlo desde la ansiedad.
            </p>
            <SalesButton>{ctaLabel}</SalesButton>
            <TrustMicrocopy>Pago por QR · Sin tarjeta · Acceso al área privada</TrustMicrocopy>
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
          <p className="nle-gold-line">Ese mensaje no siempre busca amor.</p>
          <p className="nle-gold-line">A veces solo busca alivio.</p>
          <p className="nle-gold-line">Y ahí es donde necesitas una pausa.</p>
          <p>No una conversación más que te deje peor.</p>
        </div>
      </SalesSection>

      <section className="nle-section nle-ten-minute-section" ref={tenMinuteRef}>
        <div className="nle-container nle-container--narrow">
          <div className="nle-ritual-card">
            <span className="nle-ritual-number">10</span>
            <div className="nle-ritual-copy">
              <h2>Antes de escribirle, date 10 minutos.</h2>
              <p>No tienes que prometer que nunca le vas a escribir.</p>
              <p>No tienes que bloquearlo ahora.</p>
              <p>No tienes que eliminar su número.</p>
              <strong>Solo esto: 10 minutos sin enviar el mensaje.</strong>
              <p>Durante esos 10 minutos, haces una P.A.U.S.A.</p>
            </div>
          </div>
        </div>
      </section>

      <SalesSection className="nle-method-section">
        <SectionHeader
          title={
            <>
              El método P.A.U.S.A.: <span>qué hacer en los 10 minutos antes de escribirle</span>
            </>
          }
          subtitle="No necesitas más fuerza de voluntad. Necesitas un proceso simple para no actuar desde la ansiedad."
        />
        <SalesTimeline items={pauseSteps} />
      </SalesSection>

      <SalesSection className="nle-includes-section">
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
            className="nle-includes-showcase"
            src="/assets/reconociendo-tu-poder/mockup-producto-mujer-no-le-escribas.webp"
          />
          <div className="nle-includes-list">
            <CheckList items={receives} />
          </div>
        </div>
      </SalesSection>

      <SalesSection className="nle-value-section">
        <SectionHeader
          title="Todo lo que recibes al entrar hoy"
          subtitle="Creamos este kit para que no tengas que improvisar cuando el impulso aparece."
        />
        <SalesValueStack
          items={valueStackItems}
          priceLabel={priceLabel}
          regularPriceLabel={regularPriceLabel}
          valueTotalLabel={valueTotalLabel}
        />
      </SalesSection>

      <SalesSection className="nle-price-section" id="pago-qr" width="narrow">
        <SalesPriceBox
          badge="Lanzamiento Bolivia"
          buttonLabel={ctaLabel}
          microcopy="Pago con QR · Sin tarjeta · Acceso al área de miembros premium"
          priceLabel={priceLabel}
          regularPriceLabel={regularPriceLabel}
          title="Hoy entras por solo:"
          valueTotalLabel={valueTotalLabel}
        >
          <p>
            Este precio de lanzamiento está disponible mientras validamos la primera versión del
            reto en Bolivia.
          </p>
          <p className="nle-price-urgency">Disponible durante el lanzamiento en Bolivia.</p>
        </SalesPriceBox>
      </SalesSection>

      <SalesSection className="nle-payment-section">
        <SalesQrPayment
          buttonLabel="Recibir mi QR seguro"
          imageAlt="Pago seguro por QR desde WhatsApp en Bolivia"
          imageSrc="/assets/reconociendo-tu-poder/pago-seguro-por-qr.webp"
          microcopy="El QR se genera según tu orden. No te pediremos datos de tarjeta."
          steps={paymentSteps}
          subtitle="No necesitas tarjeta. No ingresas datos bancarios. Solo dejas tu WhatsApp, recibes tu QR seguro y pagas desde tu app bancaria o billetera móvil."
          title="Pagar en Bolivia es fácil: recibes tu QR por WhatsApp"
        />
      </SalesSection>

      <SalesSection className="nle-guarantee-section" width="narrow">
        <div className="nle-guarantee-card">
          <ShieldCheck aria-hidden="true" />
          <div>
            <h2>Garantía “No era para mí” de 7 días</h2>
            <p>Entra al reto. Haz el Módulo de Emergencia y el Día 1.</p>
            <p>
              Si no sientes que te ayudó a pausar antes de actuar en automático, nos escribes
              dentro de 7 días y te devolvemos tu dinero.
            </p>
          </div>
        </div>
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
          <div className="nle-final-prices">
            <strong>Acceso de lanzamiento: {priceLabel}</strong>
            <span>Precio regular: {regularPriceLabel}</span>
          </div>
          <SalesButton>Quiero recibir mi QR seguro</SalesButton>
          <TrustMicrocopy>
            Pago con QR · Sin tarjeta · Acceso al área de miembros premium
          </TrustMicrocopy>
        </div>
      </SalesSection>

      <StickySalesCta
        ctaLabel="Recibir QR"
        priceLabel={priceLabel}
        regularPriceLabel={regularPriceLabel}
        visible={isStickyCtaVisible}
      />
    </main>
  );
}

export default NoLeEscribasSalesPage;
