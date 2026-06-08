import { describe, expect, it } from 'vitest';
import { createTemporaryOrderId } from './orderId';

describe('createTemporaryOrderId', () => {
  it('creates an RTP No Le Escribas order id with a UTC date and short suffix', () => {
    const orderId = createTemporaryOrderId(new Date('2026-06-08T23:59:59.000Z'));

    expect(orderId).toMatch(/^RTP-NLE-20260608-[A-HJ-NP-Z2-9]{4}$/);
  });
});
