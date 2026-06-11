import type { MouseEvent } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import type { FunnelOfferConfig } from '../../../../core/config/funnel.config';
import type { ResolvedAttribution } from '../../../../core/attribution';
import type { TrafficChannel } from '../../../../core/routing/channel';
import { isOfferCheckoutConfigured } from './offerUtils';

interface ExpertOfferCtaProps {
  offer: FunnelOfferConfig;
  trackingEnabled: boolean;
  trafficChannel: TrafficChannel;
  attribution: ResolvedAttribution;
  className?: string;
  compact?: boolean;
}

export function ExpertOfferCta({
  offer,
  className = '',
  compact = false,
}: ExpertOfferCtaProps) {
  const isConfigured = isOfferCheckoutConfigured(offer.checkoutUrl);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isConfigured) {
      event.preventDefault();
      return;
    }
  };

  const baseClasses = [
    'expert-headline inline-flex w-full items-center justify-center gap-2 rounded-lg text-center font-black uppercase tracking-wide transition duration-300 sm:w-auto',
    compact ? 'min-h-[48px] px-5 py-3 text-[0.78rem]' : 'min-h-[56px] px-6 py-4 text-[0.86rem] sm:px-8 sm:text-[0.92rem]',
    className,
  ].join(' ');

  if (!isConfigured) {
    return (
      <button
        type="button"
        disabled
        className={[
          baseClasses,
          'cursor-not-allowed border border-event-navy/15 bg-event-muted/20 text-event-muted',
        ].join(' ')}
      >
        <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
        {offer.ctaPendingLabel}
      </button>
    );
  }

  return (
    <a
      href={offer.checkoutUrl}
      target={offer.checkoutUrl.startsWith('http') ? '_blank' : undefined}
      rel={offer.checkoutUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      className={[
        baseClasses,
        'bg-cta text-[rgb(var(--color-cta-text))] shadow-[0_16px_38px_rgb(var(--color-event-coral)/0.34)] hover:-translate-y-0.5 hover:bg-cta-hover hover:shadow-[0_20px_48px_rgb(var(--color-event-coral)/0.42)] focus:outline-none focus:ring-2 focus:ring-event-coral/35',
      ].join(' ')}
    >
      {offer.ctaLabel}
      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
    </a>
  );
}

export default ExpertOfferCta;
