type StickySalesCtaProps = {
  visible: boolean;
};

export function StickySalesCta({ visible }: StickySalesCtaProps) {
  return (
    <div
      className={`nle-sticky-cta${visible ? ' nle-sticky-cta--visible' : ''}`}
      aria-label="Acceso rápido a la oferta"
    >
      <div>
        <strong>Mujer, No Le Escribas</strong>
        <span>Reto guiado de 7 días</span>
      </div>
      <a data-clarity-label="sticky-ver-oferta" data-cta="sticky-ver-oferta" href="#oferta">
        Ver la oferta
      </a>
    </div>
  );
}
