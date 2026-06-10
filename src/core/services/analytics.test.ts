import { afterEach, describe, expect, it, vi } from 'vitest';

interface ScriptMock {
  async: boolean;
  id: string;
  onerror: (() => void) | null;
  onload: (() => void) | null;
  src: string;
}

function installBrowserMocks(pathname: string) {
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
      href: `https://reconociendotupoder.com${pathname}`,
      pathname,
      protocol: 'https:',
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
        siteId: 'test-site',
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
    const { appendChild, fetchMock, scripts, windowMock } = installBrowserMocks('/no-le-escribas');
    const { trackEvent } = await loadAnalytics();

    const pageView = await trackEvent('PageView', { trackingEnabled: true });
    const viewContent = await trackEvent('ViewContent', { trackingEnabled: true });

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
    expect(scripts.has('boilerplate-meta-pixel-script')).toBe(false);
    expect(scripts.has('boilerplate-tiktok-pixel-script')).toBe(false);
    expect(appendChild).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(windowMock).not.toHaveProperty('fbq');
  });

  it('loads Meta and permits PageView, ViewContent, and CAPI on the ads sales route', async () => {
    const { fetchMock, scripts, windowMock } = installBrowserMocks('/x9m/no-le-escribas');
    const { trackEvent } = await loadAnalytics();

    const pageView = await trackEvent('PageView');
    const viewContent = await trackEvent('ViewContent');

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
    expect(windowMock).toHaveProperty('fbq');
  });
});
