import type { ReactNode } from 'react';

type SalesGuaranteeCardProps = {
  body: ReactNode;
  className?: string;
  imageAlt: string;
  imageSrc: string;
  title: ReactNode;
};

export function SalesGuaranteeCard({
  body,
  className = '',
  imageAlt,
  imageSrc,
  title,
}: SalesGuaranteeCardProps) {
  const classes = ['nle-guarantee-card', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="nle-guarantee-card__copy">
        <h2>{title}</h2>
        {body}
      </div>
      <figure className="nle-guarantee-card__visual">
        <img alt={imageAlt} decoding="async" loading="lazy" src={imageSrc} />
      </figure>
    </div>
  );
}
