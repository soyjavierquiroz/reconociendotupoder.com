import { afterEach, describe, expect, it, vi } from 'vitest';

interface ScriptMock {
  async: boolean;
  id: string;
  onerror: (() => void) | null;
  onload: (() => void) | null;
  src: string;
}

function installBrowserMocks(pathWithSearch: string) {
  const url = new URL(pathWithSearch, 'https://reconociendotupoder.com');
  const scripts = new Map<string, ScriptMock>();
  const storage = new Map<string, string>();
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 202 });
  const appendChild = vi.fn((script: ScriptMock) => {
    scripts.set(script.id, script);
    script.onload?.();
    return script;
  });
  const storageMock = {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
  };
  const windowMock = {
    location: {
      href: url.toString(),
      pathname: url.pathname,
      protocol: 'https:',
      search: url.search,
    },
    localStorage: storageMock,
    navigator: { userAgent: 'vitest' },
    sessionStorage: storageMock,
  };
  const documentMock = {
    cookie: '',
    createElement: vi.fn(
      (): ScriptMock => ({ async: false, id: '', onerror: null, onload: null, src: '' }),
    ),
    getElementById: vi.fn((id: string) => scripts.get(id) ?? null),
    head: { appendChild },
    referrer: '',
  };

  vi.stubGlobal('window', windowMock);
  vi.stubGlobal('document', documentMock);
  vi.stubGlobal('fetch', fetchMock);

  return { appendChild, fetchMock, scripts, windowMock };
}

async function loadAnalytics() {
  vi.doMock('../config/funnel.config', () => ({
    default: {
      integrations: {
        capiWebhookUrl: 'https://relay.example/v1/events',
        metaPixelId: '123456789',
        siteId: 'RECONOCIENDO_TU_PODER',
        tiktokPixelId: 'TEST_TIKTOK_PIXEL',
      },
    },
  }));
  vi.doMock('../../site/current', () => ({
    DNA: {
      tracking: {
        metaPixelScriptUrl: 'https://connect.facebook.net/en_US/fbevents.js',
        tiktokPixelScriptBaseUrl: 'https://analytics.tiktok.com/i18n/pixel/events.js',
      },
    },
  }));

  return import('./analytics');
}

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
  vi.unstubAllGlobals();
});

describe('ads tracking route gate', () => {
  it('does not load Meta or call CAPI on the organic sales route', async () => {
    const { appendChild, fetchMock, scripts, windowMock } = installBrowserMocks(
      '/o/no-le-escribas?fbclid=test',
    );
    const { trackEvent } = await loadAnalytics();

    const pageView = await trackEvent('PageView', { trackingEnabled: true });
    const viewContent = await trackEvent('ViewContent', { trackingEnabled: true });
    const initiateCheckout = await trackEvent('InitiateCheckout', { trackingEnabled: true });

    expect(pageView).toMatchObject({
      capiSent: false,
      metaBrowserSent: false,
      tiktokBrowserSent: false,
    });
    expect(viewContent).toMatchObject({
      capiSent: false,
      metaBrowserSent: false,
      tiktokBrowserSent: false,
    });
    expect(initiateCheckout).toMatchObject({
      capiSent: false,
      metaBrowserSent: false,
      tiktokBrowserSent: false,
    });
    expect(scripts.has('boilerplate-meta-pixel-script')).toBe(false);
    expect(scripts.has('boilerplate-tiktok-pixel-script')).toBe(false);
    expect(appendChild).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(windowMock).not.toHaveProperty('fbq');
  });

  it('loads Meta and permits PageView, ViewContent, and CAPI on the ads sales route', async () => {
    const { fetchMock, scripts, windowMock } = installBrowserMocks(
      '/x9m/o/no-le-escribas?fbclid=test',
    );
    const { trackEvent } = await loadAnalytics();

    const pageView = await trackEvent('PageView');
    const viewContent = await trackEvent('ViewContent', {
      userData: {
        client_ip_address: '203.0.113.42',
        client_user_agent: 'visitor-agent',
      },
    });

    expect(scripts.get('boilerplate-meta-pixel-script')?.src).toBe(
      'https://connect.facebook.net/en_US/fbevents.js',
    );
    expect(scripts.get('boilerplate-tiktok-pixel-script')?.src).toContain(
      'https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=TEST_TIKTOK_PIXEL',
    );
    expect(pageView).toMatchObject({
      capiSent: true,
      metaBrowserSent: true,
      tiktokBrowserSent: true,
    });
    expect(viewContent).toMatchObject({
      capiSent: true,
      metaBrowserSent: true,
      tiktokBrowserSent: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const viewContentPayload = JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body));

    expect(viewContentPayload).toMatchObject({
      event_name: 'ViewContent',
      user_data: {
        client_ip_address: '203.0.113.42',
        client_user_agent: 'visitor-agent',
      },
    });
    expect(viewContentPayload.custom_data).not.toHaveProperty('client_ip_address');
    expect(viewContentPayload.custom_data).not.toHaveProperty('client_user_agent');
    expect(windowMock).toHaveProperty('fbq');
  });

  it('keeps the legacy sales aliases behind the same ads tracking gate', async () => {
    const organic = installBrowserMocks('/no-le-escribas?fbclid=test');
    const organicAnalytics = await loadAnalytics();

    await expect(organicAnalytics.trackEvent('PageView')).resolves.toMatchObject({
      capiSent: false,
      metaBrowserSent: false,
      tiktokBrowserSent: false,
    });
    expect(organic.fetchMock).not.toHaveBeenCalled();

    vi.resetModules();
    vi.unstubAllGlobals();

    const ads = installBrowserMocks('/x9m/no-le-escribas?fbclid=test');
    const adsAnalytics = await loadAnalytics();

    await expect(adsAnalytics.trackEvent('PageView')).resolves.toMatchObject({
      capiSent: true,
      metaBrowserSent: true,
      tiktokBrowserSent: true,
    });
    expect(ads.fetchMock).toHaveBeenCalledTimes(1);
  });

  it('drops invalid visitor IPs from CAPI user_data', async () => {
    const { fetchMock } = installBrowserMocks('/x9m/o/no-le-escribas?fbclid=test');
    const { trackEvent } = await loadAnalytics();

    await trackEvent('ViewContent', {
      userData: {
        client_ip_address: 'not-an-ip',
        client_user_agent: 'visitor-agent',
      },
    });

    const capiPayload = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));

    expect(capiPayload.user_data).not.toHaveProperty('client_ip_address');
    expect(capiPayload.user_data).toMatchObject({
      client_user_agent: 'visitor-agent',
    });
  });

  it('deduplicates InitiateCheckout by sharing one event id across Meta Pixel and CAPI', async () => {
    const { fetchMock, windowMock } = installBrowserMocks(
      '/x9m/no-le-escribas?fbclid=TEST_DEDUPE_001&debug_tracking=1',
    );
    const consoleInfo = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'event-shared-1'),
    });
    const { trackEvent } = await loadAnalytics();

    const result = await trackEvent('InitiateCheckout', {
      content_name: 'Mujer, No Le Escribas',
      content_ids: ['NO_LE_ESCRIBAS'],
      content_type: 'product',
      num_items: 1,
      value: 39,
      currency: 'BOB',
      userData: {
        client_ip_address: '203.0.113.77',
        client_user_agent: 'checkout-agent',
        phone: '+59169430776',
      },
    });

    expect(result).toMatchObject({
      eventId: 'event-shared-1',
      capiSent: true,
      metaBrowserSent: true,
    });
    const fbqQueue = (windowMock as { fbq?: { queue?: unknown[] } }).fbq?.queue;

    expect(fbqQueue).toContainEqual([
      'track',
      'InitiateCheckout',
      expect.objectContaining({
        content_name: 'Mujer, No Le Escribas',
        content_ids: ['NO_LE_ESCRIBAS'],
        content_type: 'product',
        num_items: 1,
        value: 39,
        currency: 'BOB',
      }),
      { eventID: 'event-shared-1' },
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const capiPayload = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));

    expect(capiPayload).toMatchObject({
      siteId: 'RECONOCIENDO_TU_PODER',
      event_name: 'InitiateCheckout',
      event_id: 'event-shared-1',
      event_source_url:
        'https://reconociendotupoder.com/x9m/no-le-escribas?fbclid=TEST_DEDUPE_001&debug_tracking=1',
      action_source: 'website',
      user_data: {
        client_ip_address: '203.0.113.77',
        client_user_agent: 'checkout-agent',
        fbp: expect.stringMatching(/^fb\.1\.\d+\.\d+$/),
        fbc: expect.stringContaining('TEST_DEDUPE_001'),
        ph: expect.any(String),
      },
      custom_data: {
        content_name: 'Mujer, No Le Escribas',
        content_ids: ['NO_LE_ESCRIBAS'],
        content_type: 'product',
        num_items: 1,
        value: 39,
        currency: 'BOB',
      },
    });
    expect(capiPayload.custom_data).not.toHaveProperty('userData');
    expect(capiPayload.custom_data).not.toHaveProperty('client_ip_address');
    expect(capiPayload.custom_data).not.toHaveProperty('client_user_agent');
    expect(capiPayload.custom_data).not.toHaveProperty('phone');
    expect(capiPayload.data).not.toHaveProperty('userData');
    expect(capiPayload).not.toHaveProperty('eventId');
    expect(consoleInfo).toHaveBeenCalledWith(
      '[tracking] Meta Pixel InitiateCheckout eventID=event-shared-1',
    );
    expect(consoleInfo).toHaveBeenCalledWith(
      '[tracking] CAPI InitiateCheckout event_id=event-shared-1',
    );
  });
});
