type StickySalesCtaProps = {
  visible: boolean;
  priceLabel: string;
  ctaLabel: string;
};

export function StickySalesCta({ visible, priceLabel, ctaLabel }: StickySalesCtaProps) {
  return (
    <div
      className={`nle-sticky-cta${visible ? ' nle-sticky-cta--visible' : ''}`}
      aria-label="Acceso rápido a la oferta"
    >
      <div>
        <strong>{priceLabel}</strong>
        <span>Acceso privado</span>
      </div>
      <button type="button">{ctaLabel}</button>
    </div>
  );
}
