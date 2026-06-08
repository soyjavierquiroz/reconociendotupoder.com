import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { SalesBadge } from './SalesBadge';
import { SalesButton } from './SalesButton';
import { TrustMicrocopy } from './TrustMicrocopy';

type SalesPriceBoxProps = {
  badge: string;
  buttonLabel: string;
  onButtonClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  children: ReactNode;
  microcopy: string;
  priceLabel: string;
  regularPriceLabel?: string;
  title: string;
  valueTotalLabel?: string;
};

export function SalesPriceBox({
  badge,
  buttonLabel,
  onButtonClick,
  children,
  microcopy,
  priceLabel,
  regularPriceLabel,
  title,
  valueTotalLabel,
}: SalesPriceBoxProps) {
  return (
    <div className="nle-price-card">
      <SalesBadge>{badge}</SalesBadge>
      {valueTotalLabel || regularPriceLabel ? (
        <div className="nle-price-anchors">
          {valueTotalLabel ? (
            <p>
              Valor total del kit: <s>{valueTotalLabel}</s>
            </p>
          ) : null}
          {regularPriceLabel ? (
            <p>
              Precio regular: <strong>{regularPriceLabel}</strong>
            </p>
          ) : null}
        </div>
      ) : null}
      <h2>{title}</h2>
      <p className="nle-big-price">{priceLabel}</p>
      <div className="nle-price-copy">{children}</div>
      <SalesButton hideOnMobile onClick={onButtonClick}>{buttonLabel}</SalesButton>
      <TrustMicrocopy>{microcopy}</TrustMicrocopy>
    </div>
  );
}
