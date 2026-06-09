import { describe, expect, it } from 'vitest';
import { normalizeCheckoutPhone, validateCheckoutCustomer } from './checkoutCustomer';

describe('normalizeCheckoutPhone', () => {
  it.each([
    ['79790873', '+59179790873'],
    ['59179790873', '+59179790873'],
    ['+591 79790873', '+59179790873'],
    ['+59159179790873', '+59179790873'],
  ])('normalizes Bolivia phone %s to %s without duplicating its prefix', (input, expected) => {
    expect(normalizeCheckoutPhone(input, 'BO')).toEqual({
      whatsapp: '59179790873',
      phone: '59179790873',
      phoneNational: '79790873',
      phoneCountryCode: 'BO',
      phoneCallingCode: '+591',
      phoneE164: expected,
    });
  });
});

describe('validateCheckoutCustomer', () => {
  it('rejects a short phone number', () => {
    expect(validateCheckoutCustomer('Javier Sueldo', '12345')).toMatchObject({
      whatsapp: 'Ingresa un WhatsApp válido de al menos 7 dígitos.',
    });
  });
});
