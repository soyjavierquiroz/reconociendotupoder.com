import { MessageCircle } from 'lucide-react';
import { SalesButton } from './SalesButton';
import { TrustMicrocopy } from './TrustMicrocopy';

type SalesQrPaymentProps = {
  buttonLabel: string;
  imageAlt: string;
  imageSrc: string;
  microcopy: string;
  steps: readonly string[];
  subtitle: string;
  title: string;
};

export function SalesQrPayment({
  buttonLabel,
  imageAlt,
  imageSrc,
  microcopy,
  steps,
  subtitle,
  title,
}: SalesQrPaymentProps) {
  return (
    <div className="nle-payment-card">
      <div className="nle-section-header nle-payment-header">
        <p className="nle-eyebrow">
          <MessageCircle aria-hidden="true" />
          Pago seguro por QR
        </p>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <figure className="nle-payment-visual">
        <img alt={imageAlt} decoding="async" loading="lazy" src={imageSrc} />
      </figure>
      <div className="nle-payment-actions">
        <ol className="nle-steps">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <SalesButton>{buttonLabel}</SalesButton>
        <TrustMicrocopy>{microcopy}</TrustMicrocopy>
      </div>
    </div>
  );
}
