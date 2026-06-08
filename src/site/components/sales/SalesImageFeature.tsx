import type { ReactNode } from 'react';

type SalesImageFeatureProps = {
  children: ReactNode;
  className?: string;
  imageAlt: string;
  imageSrc: string;
  title: ReactNode;
};

export function SalesImageFeature({
  children,
  className = '',
  imageAlt,
  imageSrc,
  title,
}: SalesImageFeatureProps) {
  const classes = ['nle-image-feature', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <h2>{title}</h2>
      <figure>
        <img alt={imageAlt} decoding="async" loading="lazy" src={imageSrc} />
      </figure>
      <div className="nle-image-feature__copy">{children}</div>
    </div>
  );
}
