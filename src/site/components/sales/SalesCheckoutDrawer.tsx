import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Check, LockKeyhole, X } from 'lucide-react';
import { normalizeCheckoutWhatsapp } from './checkoutCustomer';

type CheckoutCustomer = {
  name: string;
  whatsapp: string;
};

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

type FieldErrors = Partial<Record<keyof CheckoutCustomer, string>>;

function validateCustomer(name: string, whatsapp: string): FieldErrors {
  const errors: FieldErrors = {};
  const trimmedName = name.trim();
  const trimmedWhatsapp = whatsapp.trim();

  if (trimmedName.length < 2) {
    errors.name = 'Ingresa tu nombre (mínimo 2 caracteres).';
  }

  if (!trimmedWhatsapp) {
    errors.whatsapp = 'Ingresa tu número de WhatsApp.';
  } else if (!/^[\d\s+()-]+$/.test(trimmedWhatsapp) || trimmedWhatsapp.replace(/\D/g, '').length < 7) {
    errors.whatsapp = 'Ingresa un WhatsApp válido.';
  }

  return errors;
}

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => nameInputRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [loading, onClose, open]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateCustomer(name, whatsapp);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    await onSubmit({
      name: name.trim(),
      whatsapp: normalizeCheckoutWhatsapp(whatsapp),
    });
  };

  return (
    <div
      aria-label="Checkout temporal"
      aria-modal="true"
      className="nle-checkout-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
      role="dialog"
    >
      <section className="nle-checkout-drawer">
        <button
          aria-label="Cerrar checkout"
          className="nle-checkout-close"
          disabled={loading}
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" />
        </button>

        <div className="nle-checkout-heading">
          <p className="nle-eyebrow">Pedido temporal por WhatsApp</p>
          <h2>Solicita tu QR seguro</h2>
          <p>
            Déjanos tus datos para crear tu pedido. Te enviaremos el QR y la confirmación de
            acceso por WhatsApp.
          </p>
        </div>

        <div className="nle-checkout-summary">
          <div>
            <strong>{productName}</strong>
            <span>Acceso al área de miembros premium</span>
          </div>
          <div className="nle-checkout-price">
            {regularPriceLabel ? <s>{regularPriceLabel}</s> : null}
            <strong>{priceLabel}</strong>
          </div>
        </div>

        <form className="nle-checkout-form" noValidate onSubmit={handleSubmit}>
          <label>
            <span>Nombre</span>
            <input
              aria-invalid={Boolean(fieldErrors.name)}
              autoComplete="name"
              disabled={loading}
              onChange={(event) => setName(event.target.value)}
              ref={nameInputRef}
              type="text"
              value={name}
            />
            {fieldErrors.name ? <small role="alert">{fieldErrors.name}</small> : null}
          </label>

          <label>
            <span>WhatsApp</span>
            <input
              aria-invalid={Boolean(fieldErrors.whatsapp)}
              autoComplete="tel"
              disabled={loading}
              inputMode="tel"
              onChange={(event) => setWhatsapp(event.target.value)}
              placeholder="Ej. 69430776"
              type="tel"
              value={whatsapp}
            />
            {fieldErrors.whatsapp ? <small role="alert">{fieldErrors.whatsapp}</small> : null}
          </label>

          <p className="nle-checkout-microcopy">
            Al tocar el botón crearemos tu pedido y te llevaremos a WhatsApp para recibir tu QR.
          </p>

          {error ? <p className="nle-checkout-error" role="alert">{error}</p> : null}

          <button className="nle-button nle-button--solid nle-checkout-submit" disabled={loading} type="submit">
            {loading ? 'Creando tu pedido...' : submitLabel}
          </button>

          <p className="nle-checkout-security">
            <LockKeyhole aria-hidden="true" />
            No necesitas tarjeta. Pagas con QR desde tu app bancaria.
          </p>
          <p className="nle-checkout-security">
            <Check aria-hidden="true" />
            Tus datos se usan para gestionar este pedido.
          </p>
        </form>
      </section>
    </div>
  );
}
