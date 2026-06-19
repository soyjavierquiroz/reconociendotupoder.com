type StickySalesCtaProps = {
  hasReachedOffer: boolean;
  label?: string;
  onClick?: () => void;
  subtitle?: string;
  visible: boolean;
};

export function StickySalesCta({
  hasReachedOffer,
  label,
  onClick,
  subtitle = 'Reto guiado de 7 días',
  visible,
}: StickySalesCtaProps) {
  const href = hasReachedOffer ? '#pago-qr' : '#como-funciona';
  const resolvedLabel = label ?? (hasReachedOffer ? 'Quiero entrar al reto' : 'Ver cómo funciona');

  return (
    <div
      className={`nle-sticky-cta${visible ? ' nle-sticky-cta--visible' : ''}`}
      aria-label="Acceso rápido al reto"
    >
      <div>
        <strong>Mujer, No Le Escribas</strong>
        <span>{subtitle}</span>
      </div>
      {onClick ? (
        <button
          data-clarity-label="sticky-primary"
          data-cta="sticky-primary"
          onClick={onClick}
          type="button"
        >
          {resolvedLabel}
        </button>
      ) : (
        <a data-clarity-label="sticky-primary" data-cta="sticky-primary" href={href}>
          {resolvedLabel}
        </a>
      )}
    </div>
  );
}
