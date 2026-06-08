import type { ReactNode } from 'react';

type SalesMediaShowcaseProps = {
  alt?: string;
  caption?: ReactNode;
  children?: ReactNode;
  className?: string;
  src?: string;
};

export function SalesMediaShowcase({
  alt = '',
  caption,
  children,
  className = '',
  src,
}: SalesMediaShowcaseProps) {
  const classes = [
    'nle-media-showcase',
    src ? 'nle-media-showcase--image' : 'nle-media-showcase--placeholder',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (src) {
    return (
      <figure className={classes}>
        <div className="nle-media-showcase__frame">
          <img
            alt={alt}
            className="nle-media-showcase__image"
            decoding="async"
            loading="lazy"
            src={src}
          />
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    );
  }

  return (
    <div
      aria-label={alt || 'Espacio reservado para mockup del producto'}
      className={classes}
      role="img"
    >
      <div className="nle-media-showcase__frame">
        <span>{children}</span>
      </div>
      {caption ? <p>{caption}</p> : null}
    </div>
  );
}
