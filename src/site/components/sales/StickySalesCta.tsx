import type { ButtonHTMLAttributes } from 'react';

type StickySalesCtaProps = {
  visible: boolean;
  priceLabel: string;
  regularPriceLabel?: string;
  ctaLabel: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
};

export function StickySalesCta({
  visible,
  priceLabel,
  regularPriceLabel,
  ctaLabel,
  onClick,
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
      <button onClick={onClick} type="button">{ctaLabel}</button>
    </div>
  );
}
