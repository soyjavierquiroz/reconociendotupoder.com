type StickySalesCtaProps = {
  hasReachedOffer: boolean;
  visible: boolean;
};

export function StickySalesCta({ hasReachedOffer, visible }: StickySalesCtaProps) {
  const href = hasReachedOffer ? '#pago-qr' : '#como-funciona';
  const label = hasReachedOffer ? 'Quiero entrar al reto' : 'Ver cómo funciona';

  return (
    <div
      className={`nle-sticky-cta${visible ? ' nle-sticky-cta--visible' : ''}`}
      aria-label="Acceso rápido al reto"
    >
      <div>
        <strong>Mujer, No Le Escribas</strong>
        <span>Reto guiado de 7 días</span>
      </div>
      <a data-clarity-label="sticky-primary" data-cta="sticky-primary" href={href}>
        {label}
      </a>
    </div>
  );
}
