import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Check, LockKeyhole, UserRound, X } from 'lucide-react';
import type { Country } from 'react-phone-number-input';
import {
  normalizeCheckoutPhone,
  validateCheckoutCustomer,
  type CheckoutCustomer,
  type CheckoutFieldErrors,
} from './checkoutCustomer';
import { createCheckoutSubmitLock } from './checkoutSubmitLock';
import { SalesPhoneField } from './SalesPhoneField';

type SalesCheckoutDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CheckoutCustomer) => Promise<void> | void;
  productName: string;
  priceLabel: string;
  regularPriceLabel?: string;
  submitLabel: string;
  loading?: boolean;
  error?: string | null;
};

export function SalesCheckoutDrawer({
  open,
  onClose,
  onSubmit,
  productName,
  priceLabel,
  regularPriceLabel,
  submitLabel,
  loading = false,
  error = null,
}: SalesCheckoutDrawerProps) {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [countryCode, setCountryCode] = useState<Country>('BO');
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const submitLockRef = useRef(createCheckoutSubmitLock());
  const isBusy = loading || isSubmitting;

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (window.matchMedia('(min-width: 768px)').matches) {
      window.setTimeout(() => nameInputRef.current?.focus(), 0);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isBusy) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isBusy, onClose, open]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading || submitLockRef.current.isLocked()) {
      return;
    }

    const validationErrors = validateCheckoutCustomer(name, whatsapp);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstInvalidFieldId = validationErrors.name
        ? 'nle-checkout-name'
        : 'nle-checkout-whatsapp';

      window.requestAnimationFrame(() => {
        const firstInvalidField = document.getElementById(firstInvalidFieldId);
        firstInvalidField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalidField?.focus({ preventScroll: true });
      });
      return;
    }

    await submitLockRef.current.run(async () => {
      setIsSubmitting(true);

      try {
        await onSubmit({
          name: name.trim(),
          ...normalizeCheckoutPhone(whatsapp, countryCode),
        });
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <div
      aria-label="Checkout"
      aria-modal="true"
      className="nle-checkout-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isBusy) {
          onClose();
        }
      }}
      role="dialog"
    >
      <section className="nle-checkout-drawer">
        <header className="nle-checkout-header">
          <div className="nle-checkout-heading">
            <div className="nle-checkout-progress">
              <span>Finaliza tu pedido</span>
              <strong>Paso 1 de 2</strong>
            </div>
            <h2>Genera tu QR seguro</h2>
            <p>
              <span className="nle-checkout-copy-mobile">
                Déjanos tus datos y abriremos WhatsApp para recibir tu QR.
              </span>
              <span className="nle-checkout-copy-desktop">
                Déjanos tus datos para generar tu QR. Recibirás la confirmación por WhatsApp y tu
                acceso al área privada después del pago.
              </span>
            </p>
          </div>
          <button
            aria-label="Cerrar checkout"
            className="nle-checkout-close"
            disabled={isBusy}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" />
          </button>
        </header>

        <form
          aria-busy={isBusy}
          className="nle-checkout-form"
          id="nle-checkout-form"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="nle-checkout-content">
            <div className="nle-checkout-summary">
              <div className="nle-checkout-summary-copy">
                <span className="nle-checkout-offer-badge">Lanzamiento Bolivia</span>
                <strong>{productName}</strong>
                <span>Acceso al área de miembros premium</span>
              </div>
              <div className="nle-checkout-price">
                {regularPriceLabel ? <s>{regularPriceLabel}</s> : null}
                <strong>{priceLabel}</strong>
              </div>
            </div>

            <div className="nle-checkout-fields">
              <label className="nle-checkout-field">
                <span className="nle-checkout-field-label">Nombre completo</span>
                <div className="nle-checkout-input-wrap">
                  <UserRound aria-hidden="true" />
                  <input
                    aria-invalid={Boolean(fieldErrors.name)}
                    autoComplete="name"
                    disabled={isBusy}
                    id="nle-checkout-name"
                    onChange={(event) => {
                      setName(event.target.value);
                      setFieldErrors((current) => ({ ...current, name: undefined }));
                    }}
                    placeholder="Ej. María Gómez"
                    ref={nameInputRef}
                    type="text"
                    value={name}
                  />
                </div>
                {fieldErrors.name ? (
                  <small className="nle-checkout-field-error" role="alert">{fieldErrors.name}</small>
                ) : null}
              </label>

              <SalesPhoneField
                countryCode={countryCode}
                disabled={isBusy}
                error={fieldErrors.whatsapp}
                onChange={(nextValue) => {
                  setWhatsapp(nextValue);
                  setFieldErrors((current) => ({ ...current, whatsapp: undefined }));
                }}
                onCountryChange={setCountryCode}
                value={whatsapp}
              />

              {error ? <p className="nle-checkout-error" role="alert">{error}</p> : null}
            </div>
          </div>

          <footer className="nle-checkout-footer">
            <p className="nle-checkout-microcopy nle-checkout-copy-desktop">
              Al continuar, crearemos tu pedido y abriremos WhatsApp para recibir tu QR.
            </p>
            <button
              className="nle-button nle-button--solid nle-checkout-submit"
              disabled={isBusy}
              type="submit"
            >
              {isBusy ? 'Generando pedido...' : submitLabel}
            </button>
            <p className="nle-checkout-security nle-checkout-copy-mobile">
              <LockKeyhole aria-hidden="true" />
              Pago por QR · Datos solo para gestionar tu pedido
            </p>
            <div className="nle-checkout-security-list nle-checkout-copy-desktop">
              <p className="nle-checkout-security">
                <LockKeyhole aria-hidden="true" />
                No necesitas tarjeta. Pagas con QR desde tu app bancaria.
              </p>
              <p className="nle-checkout-security">
                <Check aria-hidden="true" />
                Tus datos se usan solo para gestionar este pedido.
              </p>
            </div>
          </footer>
        </form>
      </section>
    </div>
  );
}
