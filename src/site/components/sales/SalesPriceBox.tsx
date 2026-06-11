import type { ReactNode } from 'react';
import { SalesBadge } from './SalesBadge';
import { SalesButton } from './SalesButton';
import { TrustMicrocopy } from './TrustMicrocopy';

type SalesPriceBoxProps = {
  badge: string;
  buttonLabel: string;
  buttonHref?: string;
  buttonDataCta?: string;
  buttonClarityLabel?: string;
  onButtonClick?: () => void;
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
  buttonHref,
  buttonDataCta,
  buttonClarityLabel,
  onButtonClick,
  children,
  microcopy,
  priceLabel,
  regularPriceLabel,
  title,
  valueTotalLabel,
}: SalesPriceBoxProps) {
  const priceSeparatorIndex = priceLabel.lastIndexOf(' ');
  const priceCurrency =
    priceSeparatorIndex >= 0 ? priceLabel.slice(0, priceSeparatorIndex) : '';
  const priceAmount =
    priceSeparatorIndex >= 0 ? priceLabel.slice(priceSeparatorIndex + 1) : priceLabel;

  return (
    <div className="nle-price-card">
      <SalesBadge>{badge}</SalesBadge>
      {valueTotalLabel || regularPriceLabel ? (
        <div className="nle-price-anchors">
          {valueTotalLabel ? (
            <p>
              Valor del kit completo: <strong>{valueTotalLabel}</strong>
            </p>
          ) : null}
          {regularPriceLabel ? (
            <p>
              Precio regular: <s>{regularPriceLabel}</s>
            </p>
          ) : null}
        </div>
      ) : null}
      <h2>{title}</h2>
      <p aria-label={priceLabel} className="nle-big-price">
        {priceCurrency ? <span>{priceCurrency}</span> : null}
        <strong>{priceAmount}</strong>
      </p>
      <div className="nle-price-copy">{children}</div>
      <SalesButton
        clarityLabel={buttonClarityLabel}
        dataCta={buttonDataCta}
        href={buttonHref}
        onClick={onButtonClick}
      >
        {buttonLabel}
      </SalesButton>
      <TrustMicrocopy>{microcopy}</TrustMicrocopy>
    </div>
  );
}
