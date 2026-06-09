import { getCountryCallingCode, type Country } from 'react-phone-number-input';
import { parsePhoneNumberFromString } from 'libphonenumber-js/min';

export type CheckoutCustomer = {
  name: string;
  whatsapp: string;
  phone: string;
  phoneNational: string;
  phoneCountryCode: string;
  phoneCallingCode: string;
  phoneE164: string;
};

export type CheckoutPhone = Omit<CheckoutCustomer, 'name'>;
export type CheckoutFieldErrors = Partial<Record<'name' | 'whatsapp', string>>;

const FALLBACK_COUNTRY: Country = 'BO';

function normalizeCountryCode(countryCode: string): Country {
  const normalized = countryCode.trim().toUpperCase() as Country;

  try {
    getCountryCallingCode(normalized);
    return normalized;
  } catch {
    return FALLBACK_COUNTRY;
  }
}

export function normalizeCheckoutPhone(value: string, countryCode = FALLBACK_COUNTRY): CheckoutPhone {
  const normalizedCountry = normalizeCountryCode(countryCode);
  const callingCode = getCountryCallingCode(normalizedCountry);
  const rawDigits = value.replace(/\D/g, '');
  const duplicatedPrefix = `${callingCode}${callingCode}`;
  const digits = rawDigits.startsWith(duplicatedPrefix)
    ? rawDigits.slice(callingCode.length)
    : rawDigits;
  const likelyInternationalValue =
    value.trim().startsWith('+') || digits.startsWith(callingCode) ? `+${digits}` : digits;
  const parsed = parsePhoneNumberFromString(likelyInternationalValue, normalizedCountry);
  const phoneNational =
    parsed?.nationalNumber ??
    (digits.startsWith(callingCode) ? digits.slice(callingCode.length) : digits);
  const phoneE164 = parsed?.number ?? `+${callingCode}${phoneNational}`;
  const normalizedDigits = phoneE164.replace(/\D/g, '');

  return {
    whatsapp: normalizedDigits,
    phone: normalizedDigits,
    phoneNational,
    phoneCountryCode: normalizedCountry,
    phoneCallingCode: `+${callingCode}`,
    phoneE164,
  };
}

export function isCheckoutPhoneValid(value: string): boolean {
  return value.replace(/\D/g, '').length >= 7;
}

export function validateCheckoutCustomer(name: string, whatsapp: string): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {};

  if (name.trim().length < 2) {
    errors.name = 'Ingresa tu nombre completo (mínimo 2 caracteres).';
  }

  if (!whatsapp.trim()) {
    errors.whatsapp = 'Ingresa tu número de WhatsApp.';
  } else if (!isCheckoutPhoneValid(whatsapp)) {
    errors.whatsapp = 'Ingresa un WhatsApp válido de al menos 7 dígitos.';
  }

  return errors;
}
