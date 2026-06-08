import type { ReactNode } from 'react';
import { SalesBadge } from './SalesBadge';
import { SalesButton } from './SalesButton';
import { TrustMicrocopy } from './TrustMicrocopy';

type SalesPriceBoxProps = {
  badge: string;
  buttonLabel: string;
  children: ReactNode;
  microcopy: string;
  priceLabel: string;
  title: string;
};

export function SalesPriceBox({
  badge,
  buttonLabel,
  children,
  microcopy,
  priceLabel,
  title,
}: SalesPriceBoxProps) {
  return (
    <div className="nle-price-card">
      <SalesBadge>{badge}</SalesBadge>
      <h2>{title}</h2>
      <p className="nle-big-price">{priceLabel}</p>
      <div className="nle-price-copy">{children}</div>
      <SalesButton>{buttonLabel}</SalesButton>
      <TrustMicrocopy>{microcopy}</TrustMicrocopy>
    </div>
  );
}
