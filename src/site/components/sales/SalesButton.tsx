import type { ButtonHTMLAttributes, ReactNode } from 'react';

type SalesButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
  hideOnMobile?: boolean;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
};

export function SalesButton({
  children,
  variant = 'primary',
  className = '',
  hideOnMobile = false,
  onClick,
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

  return (
    <button className={classes} onClick={onClick} type="button">
      {children}
    </button>
  );
}
