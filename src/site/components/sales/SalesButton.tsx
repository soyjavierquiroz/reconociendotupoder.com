import type { ReactNode } from 'react';

type SalesButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
  hideOnMobile?: boolean;
  href?: string;
  onClick?: () => void;
  dataCta?: string;
  clarityLabel?: string;
};

export function SalesButton({
  children,
  variant = 'primary',
  className = '',
  hideOnMobile = false,
  href,
  onClick,
  dataCta,
  clarityLabel,
}: SalesButtonProps) {
  const styleVariant = variant === 'primary' ? 'solid' : 'outline';
  const classes = [
    'nle-button',
    `nle-button--${styleVariant}`,
    hideOnMobile ? 'mobile-hide-cta' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const trackingAttributes = {
    'data-clarity-label': clarityLabel,
    'data-cta': dataCta,
  };

  if (href) {
    return (
      <a className={classes} href={href} {...trackingAttributes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick} type="button" {...trackingAttributes}>
      {children}
    </button>
  );
}
