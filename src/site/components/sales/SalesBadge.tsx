import type { ReactNode } from 'react';

type SalesBadgeProps = {
  children: ReactNode;
  icon?: ReactNode;
};

export function SalesBadge({ children, icon }: SalesBadgeProps) {
  return (
    <p className="nle-badge">
      {icon}
      {children}
    </p>
  );
}
