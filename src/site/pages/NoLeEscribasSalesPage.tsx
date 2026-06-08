import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Check, Pause, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';
import { DNA } from '../current';
import {
  SalesBadge,
  SalesButton,
  SalesFaq,
  SalesLegalNote,
  SalesMediaShowcase,
  SalesPriceBox,
  SalesSection,
  SalesTimeline,
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

const pauseSteps = [
  {
    letter: 'P',
    title: 'Parar el impulso',
    text: 'Detienes el movimiento antes de escribir, revisar o reclamar.',
  },
  {
    letter: 'A',
    title: 'Aterrizar la emoción',
    text: 'Nombras lo que sientes sin juzgarte.',
  },
  {
    letter: 'U',
    title: 'Ubicar la realidad',
    text: 'Separas lo que pasó de lo que tu ansiedad está imaginando.',
  },
  {
    letter: 'S',
    title: 'Sustituir el mensaje',
    text: 'Cambias el impulso por una acción segura.',
  },
  {
    letter: 'A',
    title: 'Acordarte de ti',
    text: 'Vuelves a tu centro antes de volver a su chat.',
  },
] as const;

const receives = [
  'Módulo de emergencia para empezar justo cuando estás a punto de escribirle',
  'Reto guiado de 7 días para sostener la pausa y recuperar tu centro',
  'Lecciones y ejercicios para entender lo que sientes sin actuar desde la ansiedad',
  'Workbook y herramientas prácticas para aterrizar tu emoción',
  'Audios de acompañamiento para momentos de impulso, noches difíciles y recaídas',
  'Checklist P.A.U.S.A. para usar antes de mandar ese mensaje',
  'Carta de liberación para soltar lo que necesitas decir sin volver a caer',
  'Plan anti-recaída para que no vuelvas al mismo ciclo',
] as const;

const paymentSteps = [
  'Dejas tu nombre y WhatsApp',
  'Recibes tu QR seguro',
  'Pagas desde tu app bancaria',
  'Confirmamos tu pago',
  'Recibes tu acceso al área de miembros',
] as const;

const faqs = [
  {
    question: '¿Esto es terapia?',
    answer:
      'No. Es una herramienta de acompañamiento emocional y autocuidado para ayudarte a pausar, escribir con claridad y elegir una acción más segura.',
  },
  {
    question: '¿Esto hará que él vuelva?',
    answer:
      'No prometemos controlar lo que otra persona haga. El foco del reto es que tú recuperes calma, dignidad y claridad antes de actuar desde ansiedad.',
  },
  {
    question: '¿Qué pasa si ya le escribí?',
    answer:
      'Puedes empezar igual. El reto también te ayuda a ordenar lo que pasó, bajar la urgencia y decidir tu siguiente paso con más cuidado.',
  },
  {
    question: '¿Cuándo recibo el acceso?',
    answer:
      'La experiencia está pensada para darte acceso al área privada después de confirmar el pago por QR cuando el checkout esté activo.',
  },
  {
    question: '¿Necesito tarjeta?',
    answer:
      'No. La carta está preparada para pago con QR en Bolivia, sin pedir datos de tarjeta.',
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
  const { ctaLabel, priceLabel } = DNA.noLeEscribas.offer;
  const heroRef = useRef<HTMLElement | null>(null);
  const [isStickyCtaVisible, setIsStickyCtaVisible] = useState(false);

  useEffect(() => {
    const updateStickyCtaVisibility = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0;
      setIsStickyCtaVisible(heroBottom <= 0);
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
          <p className="nle-gold-line">Y ahí es donde necesitas una pausa.</p>
          <p>No una conversación más que te deje peor.</p>
        </div>
      </SalesSection>

      <SalesSection className="nle-ten-minute-section" width="narrow">
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
      </SalesSection>

      <SalesSection className="nle-method-section">
        <SectionHeader
          eyebrow="Método P.A.U.S.A."
          title="Un camino corto para salir del impulso."
          subtitle="No tienes que resolver toda tu historia en una noche. Solo necesitas volver a tierra antes de volver al chat."
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
              subtitle="Dentro del área de miembros tendrás una guía completa para acompañarte durante 7 días, ayudarte a frenar el impulso, ordenar lo que sientes y volver a ti con más claridad y calma."
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

      <SalesSection className="nle-price-section" id="pago-qr" width="narrow">
        <SalesPriceBox
          badge="Lanzamiento Bolivia"
          buttonLabel={ctaLabel}
          microcopy="Pago con QR · Sin tarjeta · Acceso al área privada"
          priceLabel={priceLabel}
          title="Empieza hoy por solo"
        >
          <p>
            No porque valga poco. Sino porque queremos que puedas entrar hoy, justo antes de
            mandar ese mensaje que tal vez mañana te duela.
          </p>
        </SalesPriceBox>
      </SalesSection>

      <SalesSection className="nle-payment-section">
        <div className="nle-payment-card">
          <div className="nle-payment-copy">
            <SectionHeader title="Pagar en Bolivia es fácil: recibes tu QR por WhatsApp" />
            <p>
              No necesitas tarjeta. No ingresas datos bancarios. Solo dejas tu WhatsApp, recibes
              tu QR y pagas desde tu app bancaria o billetera móvil.
            </p>
            <ol className="nle-steps">
              {paymentSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <SalesButton>Recibir mi QR seguro</SalesButton>
          </div>
          <div className="nle-payment-mockup" aria-label="Placeholder visual de pago QR Bolivia" role="img">
            <Smartphone aria-hidden="true" />
            <span>
              Aquí irá el mockup: WhatsApp + QR de pago + confirmación de acceso
            </span>
          </div>
        </div>
      </SalesSection>

      <SalesSection className="nle-guarantee-section" width="narrow">
        <div className="nle-guarantee-card">
          <ShieldCheck aria-hidden="true" />
          <div>
            <h2>Garantía “No era para mí” de 7 días</h2>
            <p>Entra al reto. Haz el Módulo de Emergencia y el Día 1.</p>
            <p>
              Si sientes que no te ayudó a pausar el impulso y ordenar lo que estabas sintiendo,
              nos escribes dentro de 7 días y te devolvemos tu dinero.
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
          <p>No tienes que decidir toda tu historia hoy. Solo empieza con una P.A.U.S.A.</p>
          <strong>Acceso de lanzamiento: {priceLabel}</strong>
          <SalesButton>{ctaLabel}</SalesButton>
          <TrustMicrocopy>Pago con QR · Sin tarjeta · Acceso al área privada</TrustMicrocopy>
        </div>
      </SalesSection>

      <StickySalesCta
        ctaLabel={ctaLabel}
        priceLabel={priceLabel}
        visible={isStickyCtaVisible}
      />
    </main>
  );
}

export default NoLeEscribasSalesPage;
