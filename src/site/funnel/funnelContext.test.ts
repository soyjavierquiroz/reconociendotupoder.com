import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  FUNNEL_CONTEXT_STORAGE_KEY,
  getFunnelContext,
  persistFunnelContextFromUrl,
} from './funnelContext';

function installWindowMock(href: string, storedContext?: unknown) {
  const storage = new Map<string, string>();

  if (storedContext) {
    storage.set(FUNNEL_CONTEXT_STORAGE_KEY, JSON.stringify(storedContext));
  }

  const url = new URL(href, 'https://reconociendotupoder.com');
  const localStorage = {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
    removeItem: vi.fn((key: string) => storage.delete(key)),
  };

  vi.stubGlobal('window', {
    location: {
      href: url.toString(),
      pathname: url.pathname,
      search: url.search,
    },
    localStorage,
  });

  return { localStorage, storage };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('funnel context', () => {
  it('reads query params and normalizes the funnel slug and completed flag', () => {
    installWindowMock(
      '/x9m/o/no-le-escribas?from_funnel=mnle&sid=abc123&pattern=abandono&vsl_completed=1&entry_path=/x9m/fi/mnle&handoff_path=/x9m/o/no-le-escribas&completed_at=2026-06-16T10:00:00Z',
    );

    expect(getFunnelContext()).toEqual({
      from_funnel: 'mnle',
      funnel_slug: 'mnle',
      sid: 'abc123',
      pattern: 'abandono',
      vsl_completed: true,
      entry_path: '/x9m/fi/mnle',
      handoff_path: '/x9m/o/no-le-escribas',
      completed_at: '2026-06-16T10:00:00Z',
      tracking_mode: 'ads',
    });
  });

  it('reads localStorage when the current URL has no context params', () => {
    installWindowMock('/o/no-le-escribas', {
      from_funnel: 'mnle',
      funnel_slug: 'mnle',
      sid: 'stored-sid',
      pattern: 'validacion',
      vsl_completed: true,
      tracking_mode: 'organic',
    });

    expect(getFunnelContext()).toEqual({
      from_funnel: 'mnle',
      funnel_slug: 'mnle',
      sid: 'stored-sid',
      pattern: 'validacion',
      vsl_completed: true,
      tracking_mode: 'organic',
    });
  });

  it('lets query params win over localStorage', () => {
    installWindowMock('/x9m/o/no-le-escribas?from_funnel=mnle&sid=query-sid', {
      from_funnel: 'old',
      funnel_slug: 'old',
      sid: 'stored-sid',
      tracking_mode: 'organic',
    });

    expect(getFunnelContext()).toMatchObject({
      from_funnel: 'mnle',
      funnel_slug: 'mnle',
      sid: 'query-sid',
      tracking_mode: 'ads',
    });
  });

  it('persists recognized funnel context keys from the URL without sensitive fields', () => {
    const { localStorage } = installWindowMock(
      '/x9m/o/no-le-escribas?from_funnel=mnle&sid=abc123&email=test@example.com&vsl_completed=yes',
    );

    const context = persistFunnelContextFromUrl();

    expect(context).toMatchObject({
      from_funnel: 'mnle',
      funnel_slug: 'mnle',
      sid: 'abc123',
      vsl_completed: true,
      tracking_mode: 'ads',
      offer_received_at: expect.any(String),
    });
    expect(JSON.parse(String(localStorage.setItem.mock.calls[0]?.[1]))).toEqual(context);
    expect(localStorage.setItem.mock.calls[0]?.[1]).not.toContain('test@example.com');
  });

  it('merges query params over existing storage while preserving full funnel handoff context', () => {
    const { localStorage } = installWindowMock(
      '/x9m/o/no-le-escribas?from_funnel=mnle&funnel_slug=mnle&sid=mnle-123&pattern=abandono&vsl_completed=1',
      {
        from_funnel: 'mnle',
        funnel_slug: 'mnle',
        sid: 'mnle-123',
        pattern: 'abandono',
        vsl_completed: true,
        entry_path: '/x9m/fi/mnle/',
        handoff_path: '/x9m/o/no-le-escribas',
        tracking_mode: 'ads',
        completed_at: '2026-06-16T19:27:19.000Z',
      },
    );

    const context = persistFunnelContextFromUrl();

    expect(context).toMatchObject({
      from_funnel: 'mnle',
      funnel_slug: 'mnle',
      sid: 'mnle-123',
      pattern: 'abandono',
      vsl_completed: true,
      entry_path: '/x9m/fi/mnle/',
      handoff_path: '/x9m/o/no-le-escribas',
      tracking_mode: 'ads',
      completed_at: '2026-06-16T19:27:19.000Z',
      offer_received_at: expect.any(String),
    });
    expect(JSON.parse(String(localStorage.setItem.mock.calls[0]?.[1]))).toEqual(context);
  });

  it('supports flat alias params for sid and pattern', () => {
    installWindowMock(
      '/o/no-le-escribas?from_funnel=mnle&funnel_sid=alias-sid&funnel_pattern=nostalgia&vsl_completed=false',
    );

    expect(getFunnelContext()).toMatchObject({
      from_funnel: 'mnle',
      funnel_slug: 'mnle',
      sid: 'alias-sid',
      pattern: 'nostalgia',
      vsl_completed: false,
      tracking_mode: 'organic',
    });
  });
});
