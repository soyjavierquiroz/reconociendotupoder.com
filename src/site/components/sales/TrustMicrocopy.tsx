import type { ReactNode } from 'react';

type TrustMicrocopyProps = {
  children: ReactNode;
  className?: string;
};

export function TrustMicrocopy({ children, className = '' }: TrustMicrocopyProps) {
  const classes = ['nle-microcopy', className].filter(Boolean).join(' ');

  return <p className={classes}>{children}</p>;
}
