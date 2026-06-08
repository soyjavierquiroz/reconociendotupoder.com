import { describe, expect, it } from 'vitest';
import { createTemporaryOrderId } from './orderId';

describe('createTemporaryOrderId', () => {
  it('creates a short No Le Escribas order id with a UTC month/day and suffix', () => {
    const orderId = createTemporaryOrderId(new Date('2026-06-08T23:59:59.000Z'));

    expect(orderId).toMatch(/^NLE-0608-[A-HJ-NP-Z2-9]{4}$/);
  });
});
