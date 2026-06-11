import { BadgeCheck, Lock, ShieldCheck } from 'lucide-react';
import { useMemo } from 'react';
import { DNA } from '../../../site/current';
import funnelConfig from '../../../core/config/funnel.config';
import { useVisitor } from '../../../core/visitor/VisitorContext';
import { useCheckoutPrices } from '../../../core/hooks/useCheckoutPrices';

export interface PricingCardProps {
  productId: string;
  productName?: string;
}

export function PricingCard({ productId, productName }: PricingCardProps) {
  const { visitorData } = useVisitor();
  const { product, scrapedData, status, hasRequestedProduct } = useCheckoutPrices(productId);

  const countryCode = visitorData?.country_code?.toUpperCase() ?? 'US';
  const currencyCode = visitorData?.currency?.toUpperCase() ?? 'USD';
  const resolvedCheckoutUrl = hasRequestedProduct ? product.checkoutUrl : undefined;
  const resolvedProductName = productName ?? DNA.copy.productName ?? funnelConfig.brandName;
  const basePriceUSD = product.basePriceUSD;
  const pricingCopy = DNA.copy.pricingCard;
  const providerName = DNA.checkout.providerName;
  const title = pricingCopy.title.replace('{productName}', resolvedProductName);

  const countryPricing = useMemo(() => {
    if (!scrapedData) return undefined;
    return scrapedData[countryCode];
  }, [countryCode, scrapedData]);

  const hasLocalizedPrice = status === 'ready' && Boolean(countryPricing?.total);
  const isArgentinaCase = countryCode === 'AR' && hasLocalizedPrice;
  const isStandardScrapedCase = countryCode !== 'AR' && countryCode !== 'US' && hasLocalizedPrice;

  return (
    <section className="glass-surface rounded-[1.75rem] p-6 md:p-8">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.18em] text-accent">{pricingCopy.eyebrow}</p>
        <h3 className="mt-2 text-2xl font-extrabold text-text-main md:text-3xl">
          {title}
        </h3>
        <p className="mt-2 text-sm text-text-muted">
          {pricingCopy.baseValueLabel}: {basePriceUSD} USD
        </p>
      </div>

      <div className="rounded-[1.35rem] border border-border-subtle/15 bg-page/70 p-5">
        {isArgentinaCase ? (
          <div className="space-y-3 text-text-main">
            <p className="text-sm text-text-muted line-through">
              {pricingCopy.basePriceLabel}: {basePriceUSD} USD
            </p>
            <p className="text-base md:text-lg">
              <span className="text-text-muted">{pricingCopy.subtotalLabel}:</span> {basePriceUSD} USD
            </p>
            <p className="text-base md:text-lg">
              <span className="text-text-muted">{pricingCopy.localTaxesLabel}:</span>{' '}
              {countryPricing?.tax ? `${countryPricing.tax} ${currencyCode}` : `${pricingCopy.includedTaxesLabel} ${currencyCode}`}
            </p>
            <p className="text-lg font-bold text-accent md:text-xl">
              {pricingCopy.checkoutTotalLabel.replace('{providerName}', providerName)}: {countryPricing?.total} {currencyCode}
            </p>
          </div>
        ) : null}

        {isStandardScrapedCase ? (
          <div className="space-y-2 text-center">
            <p className="text-sm text-text-muted line-through">{basePriceUSD} USD</p>
            <p className="text-3xl font-extrabold text-accent md:text-4xl">
              {countryPricing?.total} {currencyCode}
            </p>
            <p className="text-xs text-text-muted md:text-sm">
              ({pricingCopy.equivalentLabel.replace('{price}', String(basePriceUSD))})
            </p>
          </div>
        ) : null}

        {!isArgentinaCase && !isStandardScrapedCase ? (
          <div className="text-center">
            <p className="text-3xl font-extrabold text-accent md:text-4xl">{basePriceUSD} USD</p>
            <p className="mt-2 text-xs text-text-muted md:text-sm">{pricingCopy.internationalPriceLabel}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        {resolvedCheckoutUrl ? (
          <a
            href={resolvedCheckoutUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-6 text-base font-bold text-text-inverse transition hover:opacity-95 md:h-14 md:text-lg"
          >
            {pricingCopy.buyButtonLabel}
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center rounded-xl bg-primary/60 px-6 text-base font-bold text-text-inverse opacity-70 md:h-14 md:text-lg"
          >
            {pricingCopy.unavailableLabel}
          </button>
        )}

        <div className="mt-4 grid gap-2 text-xs text-text-muted md:grid-cols-3 md:text-sm">
          <p className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-subtle/15 bg-page/60 px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-accent" />
            {pricingCopy.securePaymentLabel}
          </p>
          <p className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-subtle/15 bg-page/60 px-3 py-2">
            <Lock className="h-4 w-4 text-accent" />
            {pricingCopy.processedByLabel.replace('{providerName}', providerName)}
          </p>
          <p className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-subtle/15 bg-page/60 px-3 py-2">
            <BadgeCheck className="h-4 w-4 text-accent" />
            {pricingCopy.immediateAccessLabel}
          </p>
        </div>
      </div>
    </section>
  );
}

export default PricingCard;
