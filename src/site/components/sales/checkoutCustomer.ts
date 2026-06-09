export function normalizeCheckoutWhatsapp(value: string): string {
  const trimmedValue = value.trim();
  const digits = trimmedValue.replace(/\D/g, '');
  return trimmedValue.startsWith('+') ? `+${digits}` : digits;
}
