import type { ReactNode } from 'react';

type SalesSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  width?: 'default' | 'narrow';
};

export function SalesSection({
  children,
  className = '',
  id,
  width = 'default',
}: SalesSectionProps) {
  const classes = ['nle-section', className].filter(Boolean).join(' ');
  const containerClasses = ['nle-container', width === 'narrow' ? 'nle-container--narrow' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <section className={classes} id={id}>
      <div className={containerClasses}>{children}</div>
    </section>
  );
}
