import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ResolvedAttribution } from '../../core/attribution';
import { DNA } from '../current';
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
  productId: DNA.noLeEscribas.offer.productId,
  offerId: DNA.noLeEscribas.offer.offerId,
  productName: 'Mujer, No Le Escribas',
  value: DNA.noLeEscribas.offer.value,
  currency: DNA.noLeEscribas.offer.currency,
  source: 'hero_cta',
  ctaLabel: DNA.noLeEscribas.offer.ctaLabel,
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
        DNA.noLeEscribas.offer.priceLabel,
        'Test RTP',
        '+59169430776',
      ),
    ).toBe(
      [
        'Hola, quiero recibir mi QR para *Mujer, No Le Escribas.*',
        '',
        'Nombre: Test RTP',
        'Código de pedido: NLE-0608-LW55',
        `Monto: ${DNA.noLeEscribas.offer.priceLabel}`,
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
        {
          fbp: 'fb.1.1710000000000.1234567890',
          fbc: 'fb.1.1710000000000.fb-test',
        },
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
      fbp: 'fb.1.1710000000000.1234567890',
      fbc: 'fb.1.1710000000000.fb-test',
      metaBrowserIds: {
        fbp: 'fb.1.1710000000000.1234567890',
        fbc: 'fb.1.1710000000000.fb-test',
      },
      landing_path: '/x9m/no-le-escribas',
      current_path: '/x9m/no-le-escribas',
      funnel: null,
      from_funnel: '',
      funnel_sid: '',
      funnel_pattern: '',
      vsl_completed: '',
    });
  });

  it('includes funnel context as structured and flat order fields', () => {
    const storedFunnelContext = {
      from_funnel: 'mnle',
      funnel_slug: 'mnle',
      sid: 'abc123',
      pattern: 'abandono',
      vsl_completed: true,
      entry_path: '/x9m/fi/mnle/',
      handoff_path: '/x9m/o/no-le-escribas',
      tracking_mode: 'ads',
      completed_at: '2026-06-16T19:27:19.000Z',
      offer_received_at: '2026-06-16T19:28:19.000Z',
    };

    vi.stubGlobal('window', {
      location: {
        href: 'https://reconociendotupoder.com/x9m/o/no-le-escribas?from_funnel=mnle&sid=abc123&pattern=abandono&vsl_completed=1',
        pathname: '/x9m/o/no-le-escribas',
        search: '?from_funnel=mnle&sid=abc123&pattern=abandono&vsl_completed=1',
      },
      localStorage: {
        getItem: vi.fn(() => JSON.stringify(storedFunnelContext)),
        setItem: vi.fn(),
      },
    });

    expect(
      buildTemporaryPurchaseIntent(
        input,
        {
          ...attribution,
          landingPath: '/x9m/o/no-le-escribas',
          currentPath: '/x9m/o/no-le-escribas',
        },
        'NLE-0608-LW55',
        'https://reconociendotupoder.com/x9m/o/no-le-escribas?from_funnel=mnle&sid=abc123&pattern=abandono&vsl_completed=1',
        {
          fbp: 'fb.1.1710000000000.1234567890',
          fbc: 'fb.1.1710000000000.fb-test',
        },
      ),
    ).toMatchObject({
      funnel: {
        from_funnel: 'mnle',
        funnel_slug: 'mnle',
        sid: 'abc123',
        pattern: 'abandono',
        vsl_completed: true,
        entry_path: '/x9m/fi/mnle/',
        handoff_path: '/x9m/o/no-le-escribas',
        tracking_mode: 'ads',
        completed_at: '2026-06-16T19:27:19.000Z',
        offer_received_at: '2026-06-16T19:28:19.000Z',
      },
      from_funnel: 'mnle',
      funnel_sid: 'abc123',
      funnel_pattern: 'abandono',
      vsl_completed: true,
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

  it('tracks InitiateCheckout product data and navigates only after a 202 webhook response', async () => {
    const localStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
    };
    const sessionStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
    };
    vi.stubGlobal('window', { localStorage, sessionStorage });
    const calls: string[] = [];
    const track = vi.fn(async (_eventName: string, _data?: Record<string, unknown>) => {
      void _eventName;
      void _data;
      calls.push('track');
      return trackResult;
    });
    const navigate = vi.fn(() => calls.push('navigate'));
    let webhookBody: unknown;
    const fetchImplementation = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      calls.push('webhook');
      webhookBody = JSON.parse(String(init?.body));
      return new Response(null, { status: 202 });
    });

    const result = await startTemporaryWhatsappQrIntent(input, {
      attribution,
      intentWebhookUrl: 'https://webhook.example/orders',
      whatsappUrl: 'https://wa.me/59160000000',
      fetch: fetchImplementation,
      navigate,
      track,
      metaBrowserIds: {
        fbp: 'fb.1.1710000000000.1234567890',
        fbc: 'fb.1.1710000000000.fb-test',
      },
    });

    expect(result.status).toBe('opened');
    expect(calls).toEqual(['webhook', 'track', 'navigate']);
    expect(webhookBody).toMatchObject({
      offerId: DNA.noLeEscribas.offer.offerId,
      value: DNA.noLeEscribas.offer.value,
      currency: DNA.noLeEscribas.offer.currency,
      funnel: null,
      from_funnel: '',
      funnel_sid: '',
      funnel_pattern: '',
      vsl_completed: '',
      fbclid: 'fb-test',
      fbp: 'fb.1.1710000000000.1234567890',
      fbc: 'fb.1.1710000000000.fb-test',
      metaBrowserIds: {
        fbp: 'fb.1.1710000000000.1234567890',
        fbc: 'fb.1.1710000000000.fb-test',
      },
    });
    expect(JSON.parse(String(localStorage.setItem.mock.calls[0]?.[1]))[0]).toMatchObject({
      fbp: 'fb.1.1710000000000.1234567890',
      fbc: 'fb.1.1710000000000.fb-test',
    });
    expect(JSON.parse(String(sessionStorage.setItem.mock.calls[0]?.[1]))[0]).toMatchObject({
      fbp: 'fb.1.1710000000000.1234567890',
      fbc: 'fb.1.1710000000000.fb-test',
    });
    expect(track).toHaveBeenCalledWith(
      'InitiateCheckout',
      expect.objectContaining({
        content_ids: [DNA.noLeEscribas.offer.productId],
        content_name: 'Mujer, No Le Escribas',
        content_type: 'product',
        num_items: 1,
        offer_id: DNA.noLeEscribas.offer.offerId,
        value: DNA.noLeEscribas.offer.value,
        currency: DNA.noLeEscribas.offer.currency,
        order_id: expect.stringMatching(/^NLE-\d{4}-[A-HJ-NP-Z2-9]{4}$/),
        userData: {
          phone: '+59169430776',
        },
      }),
    );
    const trackedData = track.mock.calls[0]?.[1] as Record<string, unknown>;

    expect(trackedData).not.toHaveProperty('customer_name');
    expect(trackedData).not.toHaveProperty('customer_whatsapp');
    expect(trackedData).not.toHaveProperty('phone');
    expect(trackedData).not.toHaveProperty('whatsapp');
    expect(trackedData).not.toHaveProperty('phone_e164');
    expect(trackedData).not.toHaveProperty('customer');
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
