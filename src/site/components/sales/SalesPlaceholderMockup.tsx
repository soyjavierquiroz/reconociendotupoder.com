type SalesPlaceholderMockupProps = {
  children: string;
  className?: string;
  label?: string;
};

export function SalesPlaceholderMockup({
  children,
  className = '',
  label = 'Espacio reservado para mockup del producto',
}: SalesPlaceholderMockupProps) {
  const classes = ['nle-placeholder-mockup', className].filter(Boolean).join(' ');

  return (
    <div aria-label={label} className={classes} role="img">
      <span>{children}</span>
    </div>
  );
}
