type StickySalesCtaProps = {
  visible: boolean;
  priceLabel: string;
  regularPriceLabel?: string;
  ctaLabel: string;
};

export function StickySalesCta({
  visible,
  priceLabel,
  regularPriceLabel,
  ctaLabel,
}: StickySalesCtaProps) {
  return (
    <div
      className={`nle-sticky-cta${visible ? ' nle-sticky-cta--visible' : ''}`}
      aria-label="Acceso rápido a la oferta"
    >
      <div>
        <strong>Hoy {priceLabel}</strong>
        <span>{regularPriceLabel ? `Luego ${regularPriceLabel}` : 'Acceso privado'}</span>
      </div>
      <button type="button">{ctaLabel}</button>
    </div>
  );
}
