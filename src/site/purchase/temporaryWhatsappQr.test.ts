import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ResolvedAttribution } from '../../core/attribution';
import {
  buildTemporaryPurchaseIntent,
  buildTemporaryWhatsappQrMessage,
  startTemporaryWhatsappQrIntent,
} from './temporaryWhatsappQr';

const attribution: ResolvedAttribution = {
  channel: 'ads',
  source: 'clickid',
  paidPlatform: 'meta',
  landingPath: '/x9m/no-le-escribas',
  currentPath: '/x9m/no-le-escribas',
  clickIds: { fbclid: 'fb-test' },
  utms: { utm_campaign: 'launch' },
  shouldTrackAds: true,
};

const input = {
  productId: 'NO_LE_ESCRIBAS',
  offerId: 'NLE_LAUNCH_BOB_29',
  productName: 'Mujer, No Le Escribas',
  value: 29,
  currency: 'BOB',
  source: 'hero_cta',
  ctaLabel: 'Solicitar QR por Bs 29',
  customer: {
    name: 'Test RTP',
    whatsapp: '59169430776',
    phone: '59169430776',
    phoneNational: '69430776',
    phoneCountryCode: 'BO',
    phoneCallingCode: '+591',
    phoneE164: '+59169430776',
  },
};

const trackResult = {
  eventId: 'event-test',
  metaBrowserSent: false,
  tiktokBrowserSent: false,
  capiSent: false,
  capiStatus: null,
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('buildTemporaryWhatsappQrMessage', () => {
  it('includes the bold product name, customer, order code, and amount', () => {
    expect(
      buildTemporaryWhatsappQrMessage(
        'Mujer, No Le Escribas',
        'NLE-0608-LW55',
        'Bs 29',
        'Test RTP',
        '+59169430776',
      ),
    ).toBe(
      [
        'Hola, quiero recibir mi QR para *Mujer, No Le Escribas.*',
        '',
        'Nombre: Test RTP',
        'Código de pedido: NLE-0608-LW55',
        'Monto: Bs 29',
        'WhatsApp: +59169430776',
      ].join('\n'),
    );
  });
});

describe('buildTemporaryPurchaseIntent', () => {
  it('includes customer, status, flow, and flat attribution fields', () => {
    expect(
      buildTemporaryPurchaseIntent(
        input,
        attribution,
        'NLE-0608-LW55',
        'https://reconociendotupoder.com/x9m/no-le-escribas',
      ),
    ).toMatchObject({
      orderId: 'NLE-0608-LW55',
      status: 'qr_requested',
      purchaseFlow: 'temporary_whatsapp_qr',
      customer: input.customer,
      name: 'Test RTP',
      phone: '59169430776',
      whatsapp: '59169430776',
      phone_national: '69430776',
      phone_country_code: 'BO',
      phone_calling_code: '+591',
      phone_e164: '+59169430776',
      traffic_channel: 'ads',
      attribution_source: 'clickid',
      paid_platform: 'meta',
      fbclid: 'fb-test',
      landing_path: '/x9m/no-le-escribas',
      current_path: '/x9m/no-le-escribas',
    });
  });
});

describe('startTemporaryWhatsappQrIntent', () => {
  it('does not track or navigate when the webhook fails', async () => {
    vi.stubGlobal('window', {});
    const track = vi.fn(async () => trackResult);
    const navigate = vi.fn();

    const result = await startTemporaryWhatsappQrIntent(input, {
      attribution,
      intentWebhookUrl: 'https://webhook.example/orders',
      whatsappUrl: 'https://wa.me/59160000000',
      fetch: vi.fn(async () => new Response(null, { status: 500 })),
      navigate,
      track,
    });

    expect(result).toMatchObject({
      status: 'webhook_failed',
      message: 'No pudimos crear tu pedido. Intenta de nuevo en unos segundos.',
    });
    expect(track).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('tracks InitiateCheckout and navigates only after a 202 webhook response', async () => {
    vi.stubGlobal('window', {});
    const calls: string[] = [];
    const track = vi.fn(async () => {
      calls.push('track');
      return trackResult;
    });
    const navigate = vi.fn(() => calls.push('navigate'));
    const fetchImplementation = vi.fn(async () => {
      calls.push('webhook');
      return new Response(null, { status: 202 });
    });

    const result = await startTemporaryWhatsappQrIntent(input, {
      attribution,
      intentWebhookUrl: 'https://webhook.example/orders',
      whatsappUrl: 'https://wa.me/59160000000',
      fetch: fetchImplementation,
      navigate,
      track,
    });

    expect(result.status).toBe('opened');
    expect(calls).toEqual(['webhook', 'track', 'navigate']);
    expect(track).toHaveBeenCalledWith(
      'InitiateCheckout',
      expect.objectContaining({
        customer_name: 'Test RTP',
        customer_whatsapp: '59169430776',
        phone_country_code: 'BO',
        phone_calling_code: '+591',
        phone_e164: '+59169430776',
        order_id: expect.stringMatching(/^NLE-\d{4}-[A-HJ-NP-Z2-9]{4}$/),
      }),
    );
  });

  it('returns a safe error and does not navigate when checkout config is missing', async () => {
    const navigate = vi.fn();
    const track = vi.fn(async () => trackResult);

    const result = await startTemporaryWhatsappQrIntent(input, {
      attribution,
      intentWebhookUrl: '',
      whatsappUrl: '',
      navigate,
      track,
    });

    expect(result).toEqual({
      status: 'not_configured',
      orderId: null,
      message: 'El checkout temporal no está configurado.',
    });
    expect(track).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('creates the order but does not track or navigate when WhatsApp is missing', async () => {
    vi.stubGlobal('window', {});
    const navigate = vi.fn();
    const track = vi.fn(async () => trackResult);

    const result = await startTemporaryWhatsappQrIntent(input, {
      attribution,
      intentWebhookUrl: 'https://webhook.example/orders',
      whatsappUrl: '',
      fetch: vi.fn(async () => new Response(null, { status: 200 })),
      navigate,
      track,
    });

    expect(result).toMatchObject({
      status: 'not_configured',
      orderId: expect.stringMatching(/^NLE-\d{4}-[A-HJ-NP-Z2-9]{4}$/),
      message: 'WhatsApp de pedidos no está configurado.',
    });
    expect(track).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});
