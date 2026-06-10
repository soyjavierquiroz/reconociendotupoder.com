import { describe, expect, it } from 'vitest';
import { normalizeCheckoutPhone, validateCheckoutCustomer } from './checkoutCustomer';
import { createCheckoutSubmitLock } from './checkoutSubmitLock';

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
  it('rejects empty checkout data before purchase intent can be submitted', () => {
    expect(validateCheckoutCustomer('', '')).toEqual({
      name: 'Ingresa tu nombre completo (mínimo 2 caracteres).',
      whatsapp: 'Ingresa tu número de WhatsApp.',
    });
  });

  it('rejects a short phone number', () => {
    expect(validateCheckoutCustomer('Javier Sueldo', '12345')).toMatchObject({
      whatsapp: 'Ingresa un WhatsApp válido de al menos 7 dígitos.',
    });
  });
});

describe('createCheckoutSubmitLock', () => {
  it('allows only one submit while the first one is in progress', async () => {
    let releaseSubmit: (() => void) | undefined;
    let submitCalls = 0;
    const lock = createCheckoutSubmitLock();
    const pendingSubmit = lock.run(
      () =>
        new Promise<void>((resolve) => {
          submitCalls += 1;
          releaseSubmit = resolve;
        }),
    );

    const duplicateSubmit = await lock.run(() => {
      submitCalls += 1;
    });

    expect(duplicateSubmit).toBe(false);
    expect(submitCalls).toBe(1);

    releaseSubmit?.();
    await pendingSubmit;
  });
});
