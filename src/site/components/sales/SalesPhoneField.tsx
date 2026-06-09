import { useEffect, useRef } from 'react';
import { type Country } from 'react-phone-number-input';
import { SmartPhoneInput } from '../../../components/common/forms/SmartPhoneInput';
import { useVisitor } from '../../../core/visitor/VisitorContext';

const FALLBACK_COUNTRY: Country = 'BO';
const SUPPORTED_SALES_COUNTRIES = new Set<Country>([
  'BO', 'AR', 'CL', 'CO', 'PE', 'EC', 'UY', 'PY', 'VE', 'MX', 'US', 'ES',
  'CA', 'CR', 'PA', 'DO', 'GT', 'HN', 'SV', 'NI', 'PR', 'GB', 'DE', 'FR',
  'IT', 'PT', 'NL', 'CH', 'SE', 'JP', 'CN', 'KR', 'IN', 'AU', 'NZ',
]);

type SalesPhoneFieldProps = {
  value: string;
  onChange: (value: string) => void;
  countryCode: Country;
  onCountryChange: (countryCode: Country) => void;
  error?: string;
  disabled?: boolean;
};

export function SalesPhoneField({
  value,
  onChange,
  countryCode,
  onCountryChange,
  error,
  disabled = false,
}: SalesPhoneFieldProps) {
  const { visitorData, isLoading } = useVisitor();
  const hasManualCountryChangeRef = useRef(false);

  useEffect(() => {
    if (isLoading || hasManualCountryChangeRef.current) {
      return;
    }

    const detectedCountry = visitorData?.country_code?.toUpperCase() as Country | undefined;
    onCountryChange(
      detectedCountry && SUPPORTED_SALES_COUNTRIES.has(detectedCountry)
        ? detectedCountry
        : FALLBACK_COUNTRY,
    );
  }, [isLoading, onCountryChange, visitorData?.country_code]);

  return (
    <div className="nle-checkout-phone-field">
      <SmartPhoneInput
        autoDetectCountry={false}
        defaultCountry={countryCode}
        disabled={disabled}
        error={error}
        errorTextClassName="nle-checkout-field-error"
        helperTextClassName="nle-checkout-phone-detecting"
        id="nle-checkout-whatsapp"
        key={countryCode}
        label="WhatsApp"
        labelClassName="nle-checkout-field-label"
        onChange={onChange}
        onCountryChange={(nextCountry) => {
          hasManualCountryChangeRef.current = true;
          onCountryChange(nextCountry);
        }}
        phoneInputClassName="nle-checkout-phone-control"
        placeholder="WhatsApp o teléfono"
        required
        value={value}
      />
      {isLoading ? <p className="nle-checkout-phone-detecting">Detectando país por IP...</p> : null}
      <p className="nle-checkout-field-helper">
        Usaremos este número para enviarte el QR y confirmar tu acceso.
      </p>
    </div>
  );
}
