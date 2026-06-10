type StickySalesCtaProps = {
  visible: boolean;
  title: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
  dataCta: string;
};

export function StickySalesCta({
  visible,
  title,
  subtitle,
  ctaLabel,
  href,
  dataCta,
}: StickySalesCtaProps) {
  return (
    <div
      className={`nle-sticky-cta${visible ? ' nle-sticky-cta--visible' : ''}`}
      aria-label="Acceso rápido a la oferta"
    >
      <div>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      <a data-clarity-label={dataCta} data-cta={dataCta} href={href}>
        {ctaLabel}
      </a>
    </div>
  );
}
