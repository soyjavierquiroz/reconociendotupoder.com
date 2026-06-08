import type { ButtonHTMLAttributes, ReactNode } from 'react';

type SalesButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
};

export function SalesButton({
  children,
  variant = 'primary',
  className = '',
  onClick,
}: SalesButtonProps) {
  const styleVariant = variant === 'primary' ? 'solid' : 'outline';
  const classes = ['nle-button', `nle-button--${styleVariant}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} onClick={onClick} type="button">
      {children}
    </button>
  );
}
