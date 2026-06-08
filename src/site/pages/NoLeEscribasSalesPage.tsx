import type { CSSProperties, ReactNode } from 'react';
import {
  Check,
  Heart,
  Moon,
  Pause,
  ShieldCheck,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { DNA } from '../current';

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
  ['P', 'Parar el impulso'],
  ['A', 'Aterrizar la emoción'],
  ['U', 'Ubicar la realidad, no la fantasía'],
  ['S', 'Sustituir el mensaje por una acción segura'],
  ['A', 'Acordarte de ti'],
] as const;

const receives = [
  'Kit de emergencia: “No le escribas todavía”',
  'Reto guiado de 7 días',
  'PDF + workbook diario',
  'Audios diarios descargables',
  'Checklist antes de escribirle',
  'Carta que no vas a enviar',
] as const;

const bumpMoments = [
  'Cuando quieres escribirle.',
  'Cuando te deja en visto.',
  'Cuando sube una historia.',
  'Cuando aparece con un “hola perdida”.',
  'Cuando lo extrañas de noche.',
  'Cuando quieres reclamarle.',
  'Cuando quieres pedir cierre.',
  'Cuando sientes que te reemplazó.',
  'Cuando te sientes insuficiente.',
  'Cuando necesitas volver a ti.',
] as const;

const paymentSteps = [
  'Tocas “Quiero mi acceso”.',
  'Dejas tu nombre y WhatsApp.',
  'Eliges si quieres agregar los audios extra.',
  'Recibes tu QR seguro por WhatsApp.',
  'Pagas desde tu app bancaria y recibes tu acceso.',
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
      'La experiencia está pensada para entregar el acceso por WhatsApp después del pago por QR cuando el checkout esté activo.',
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

function NoopButton({
  children,
  variant = 'solid',
}: {
  children: ReactNode;
  variant?: 'solid' | 'outline';
}) {
  return (
    <button className={`nle-button nle-button--${variant}`} type="button">
      {children}
    </button>
  );
}

function Section({
  children,
  className = '',
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section className={`nle-section ${className}`} id={id}>
      <div className="nle-container">{children}</div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
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

function ProductMockup() {
  return (
    <div className="nle-product-mockup" aria-label="Mockup visual del producto No Le Escribas" role="img">
      <div className="nle-product-cover">
        <span>Método P.A.U.S.A.</span>
        <strong>No Le Escribas</strong>
        <small>Kit de emergencia emocional + reto 7 días</small>
      </div>
      <div className="nle-product-pages">
        <span>Workbook</span>
        <span>Audios</span>
        <span>Checklist</span>
      </div>
    </div>
  );
}

export function NoLeEscribasSalesPage() {
  const price = DNA.noLeEscribas.price;
  const bumpPrice = DNA.noLeEscribas.bumpPrice;

  return (
    <main className="no-le-escribas-page" style={colorVariables}>
      <div className="nle-announcement">
        <span>Pago con QR · Sin tarjeta · Acceso por WhatsApp</span>
      </div>

      <section className="nle-hero">
        <div className="nle-container nle-hero-grid">
          <div className="nle-hero-copy">
            <p className="nle-badge">
              <Pause aria-hidden="true" />
              Método P.A.U.S.A. · Reto 7 días
            </p>
            <h1>No le escribas todavía.</h1>
            <p className="nle-hero-subheadline">
              Haz una P.A.U.S.A. antes de mandar ese mensaje que mañana puede dolerte.
            </p>
            <p className="nle-hero-text">
              Un kit de emergencia emocional + reto guiado de 7 días para calmar el impulso,
              ordenar lo que sientes y volver a ti sin rogar, reclamar ni perseguir migajas.
            </p>
            <p className="nle-price-line">Acceso de lanzamiento: {price}</p>
            <NoopButton>Quiero mi acceso por {price}</NoopButton>
            <p className="nle-microcopy">
              Pago seguro con QR · No necesitas tarjeta · Recibes acceso por WhatsApp
            </p>
          </div>

          <div className="nle-hero-visual" aria-label="Visual emocional de pausa antes de escribir" role="img">
            <div className="nle-phone-frame">
              <div className="nle-phone-top" />
              <div className="nle-chat nle-chat--incoming">¿Y si le escribo?</div>
              <div className="nle-chat nle-chat--outgoing">No. Hoy elijo volver a mí.</div>
              <div className="nle-ritual-card">
                <Moon aria-hidden="true" />
                <span>Respira 10 minutos antes de enviar.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section className="nle-identification">
        <div className="nle-copy-card">
          <SectionHeader title="Tal vez solo querías mandarle un “hola”." />
          <div className="nle-prose">
            <p>Pero tú sabes que no es solo un hola.</p>
            <p>Es ansiedad. Es esperar que responda. Es querer saber si todavía le importas.</p>
            <p>Es revisar si está en línea. Es sentir ese nudo en el pecho y pensar:</p>
            <blockquote>“Si no hago algo, lo pierdo.”</blockquote>
            <p>Antes de enviar ese mensaje, date 10 minutos para volver a ti.</p>
          </div>
          <NoopButton variant="outline">Hacer mi P.A.U.S.A. ahora</NoopButton>
        </div>
      </Section>

      <Section>
        <SectionHeader title="El método P.A.U.S.A." />
        <div className="nle-pause-grid">
          {pauseSteps.map(([letter, label]) => (
            <article className="nle-pause-card" key={letter}>
              <span>{letter}</span>
              <h3>{label}</h3>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="nle-split">
          <div>
            <SectionHeader title="Esto recibes hoy dentro del área de miembros" />
            <CheckList items={receives} />
          </div>
          <ProductMockup />
        </div>
      </Section>

      <Section className="nle-price-section" id="pago-qr">
        <div className="nle-price-card">
          <p className="nle-badge">Lanzamiento Bolivia</p>
          <h2>Empieza hoy por solo</h2>
          <p className="nle-big-price">{price}</p>
          <p>
            No porque valga poco. Sino porque queremos que puedas entrar hoy, justo antes de
            mandar ese mensaje que tal vez mañana te duela.
          </p>
          <NoopButton>Quiero mi acceso por {price}</NoopButton>
          <p className="nle-microcopy">Pago con QR · Sin tarjeta · Acceso por WhatsApp</p>
        </div>
      </Section>

      <Section>
        <div className="nle-bump-card">
          <div className="nle-bump-top">
            <div>
              <p className="nle-eyebrow">Preventa visual</p>
              <h2>Agrega los 10 audios de emergencia</h2>
            </div>
            <div className="nle-fake-checkbox" aria-hidden="true" />
          </div>
          <p>
            Para esos momentos donde no necesitas más teoría. Necesitas una voz que te ayude a pausar.
          </p>
          <CheckList items={bumpMoments} />
          <p className="nle-bump-price">Solo {bumpPrice} adicionales</p>
          <p className="nle-microcopy">
            Esto es visual/preventa. No hay checkbox funcional todavía.
          </p>
        </div>
      </Section>

      <Section>
        <div className="nle-split nle-payment">
          <div>
            <SectionHeader
              title="¿Cómo pago?"
              subtitle="En Bolivia pagas fácil con QR. No necesitas tarjeta de crédito ni débito."
            />
            <ol className="nle-steps">
              {paymentSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className="nle-trust-box">
              <ShieldCheck aria-hidden="true" />
              <p>
                No te pediremos datos de tarjeta. Tu pago se realiza por QR y tu acceso llega por
                WhatsApp.
              </p>
            </div>
            <NoopButton>Recibir mi QR seguro por WhatsApp</NoopButton>
          </div>
          <div className="nle-qr-card" aria-label="Placeholder visual de pago QR Bolivia" role="img">
            <Smartphone aria-hidden="true" />
            <div className="nle-qr-placeholder">
              <span />
              <span />
              <span />
              <span />
            </div>
            <strong>QR Bolivia</strong>
            <small>Pago seguro sin tarjeta</small>
          </div>
        </div>
      </Section>

      <Section>
        <div className="nle-guarantee-card">
          <ShieldCheck aria-hidden="true" />
          <div>
            <h2>Garantía “No era para mí” de 7 días</h2>
            <p>
              Entra al reto. Haz el Módulo de Emergencia y el Día 1. Si sientes que no te ayudó
              a pausar el impulso y ordenar lo que estabas sintiendo, nos escribes dentro de 7
              días y te devolvemos tu dinero.
            </p>
            <small>Sin drama. Sin explicaciones incómodas.</small>
          </div>
        </div>
      </Section>

      <Section>
        <div className="nle-important-card">
          <Heart aria-hidden="true" />
          <div>
            <h2>Importante</h2>
            <p>
              Este reto es una herramienta de acompañamiento emocional y autocuidado. No reemplaza
              terapia, diagnóstico, tratamiento psicológico ni atención profesional.
            </p>
            <p>
              Si estás en una situación de peligro, violencia, amenaza, crisis emocional intensa o
              sientes que podrías hacerte daño, busca ayuda inmediata con una persona de confianza,
              servicios de emergencia de tu país o un profesional de salud mental.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader title="Preguntas frecuentes" />
        <div className="nle-faq-grid">
          {faqs.map((faq) => (
            <article className="nle-faq-card" key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="nle-final-cta">
        <div className="nle-final-card">
          <Sparkles aria-hidden="true" />
          <h2>Antes de volver a él, vuelve a ti.</h2>
          <p>No tienes que decidir toda tu historia hoy. Solo empieza con una P.A.U.S.A.</p>
          <p className="nle-price-line">Acceso de lanzamiento: {price}</p>
          <NoopButton>Quiero mi acceso por {price}</NoopButton>
          <p className="nle-microcopy">Pago seguro con QR · Acceso por WhatsApp</p>
        </div>
      </Section>

      <div className="nle-sticky-cta" aria-label="Acceso rápido a la oferta">
        <div>
          <strong>{price}</strong>
          <span>Pago QR</span>
        </div>
        <button type="button">Obtener acceso</button>
      </div>
    </main>
  );
}

export default NoLeEscribasSalesPage;
