import { describe, expect, it } from 'vitest';
import { buildTemporaryWhatsappQrMessage } from './temporaryWhatsappQr';

describe('buildTemporaryWhatsappQrMessage', () => {
  it('creates the three-line WhatsApp message with a bold product name', () => {
    expect(
      buildTemporaryWhatsappQrMessage('Mujer, No Le Escribas', 'NLE-0608-LW55', 'Bs 29'),
    ).toBe(
      [
        'Hola, quiero recibir mi QR para *Mujer, No Le Escribas.*',
        'Código de pedido: NLE-0608-LW55',
        'Monto: Bs 29',
      ].join('\n'),
    );
  });
});
