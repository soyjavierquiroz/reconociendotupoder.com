import { isAdsRoutePath } from '../../core/routing/adsRoute';

export type FunnelContext = {
  from_funnel?: string;
  funnel_slug?: string;
  sid?: string;
  pattern?: string;
  vsl_completed?: boolean;
  entry_path?: string;
  handoff_path?: string;
  completed_at?: string;
  tracking_mode?: 'ads' | 'organic';
};

export const FUNNEL_CONTEXT_STORAGE_KEY = 'rtp_funnel_context_v1';

type StringFunnelContextKey = Exclude<keyof FunnelContext, 'vsl_completed' | 'tracking_mode'>;

const STRING_CONTEXT_KEYS: StringFunnelContextKey[] = [
  'from_funnel',
  'funnel_slug',
  'sid',
  'pattern',
  'entry_path',
  'handoff_path',
  'completed_at',
];

const TRUE_VALUES = new Set(['1', 'true', 'yes']);
const FALSE_VALUES = new Set(['0', 'false', 'no']);
const MAX_CONTEXT_VALUE_LENGTH = 512;

function getCurrentUrl(): URL | null {
  if (typeof window === 'undefined' || !window.location) {
    return null;
  }

  try {
    if (window.location.href) {
      return new URL(window.location.href);
    }
  } catch {
    // Fall back to pathname/search below.
  }

  try {
    return new URL(
      `${window.location.pathname ?? '/'}${window.location.search ?? ''}`,
      'https://funnel.local',
    );
  } catch {
    return null;
  }
}

function cleanContextValue(value: string | null): string | undefined {
  const trimmed = value
    ?.trim()
    .split('')
    .filter((character) => {
      const code = character.charCodeAt(0);

      return code > 31 && code !== 127;
    })
    .join('');

  return trimmed ? trimmed.slice(0, MAX_CONTEXT_VALUE_LENGTH) : undefined;
}

function parseBooleanContextValue(value: string | null): boolean | undefined {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    return undefined;
  }

  if (TRUE_VALUES.has(normalized)) {
    return true;
  }

  if (FALSE_VALUES.has(normalized)) {
    return false;
  }

  return undefined;
}

function parseTrackingMode(value: string | null): FunnelContext['tracking_mode'] {
  const normalized = value?.trim().toLowerCase();

  return normalized === 'ads' || normalized === 'organic' ? normalized : undefined;
}

function readContextFromStorage(): FunnelContext | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawContext = window.localStorage.getItem(FUNNEL_CONTEXT_STORAGE_KEY);

    if (!rawContext) {
      return null;
    }

    const parsedContext = JSON.parse(rawContext) as Partial<FunnelContext>;
    const context: FunnelContext = {};

    STRING_CONTEXT_KEYS.forEach((key) => {
      const value = cleanContextValue(
        typeof parsedContext[key] === 'string' ? parsedContext[key] : null,
      );

      if (value) {
        context[key] = value;
      }
    });

    if (typeof parsedContext.vsl_completed === 'boolean') {
      context.vsl_completed = parsedContext.vsl_completed;
    }

    if (parsedContext.tracking_mode === 'ads' || parsedContext.tracking_mode === 'organic') {
      context.tracking_mode = parsedContext.tracking_mode;
    }

    return Object.keys(context).length > 0 ? context : null;
  } catch {
    return null;
  }
}

function readContextFromUrl(url: URL): FunnelContext | null {
  const params = url.searchParams;
  const context: FunnelContext = {};
  let hasExplicitContext = false;

  STRING_CONTEXT_KEYS.forEach((key) => {
    const value = cleanContextValue(params.get(key));

    if (value) {
      context[key] = value;
      hasExplicitContext = true;
    }
  });

  const vslCompleted = parseBooleanContextValue(params.get('vsl_completed'));

  if (typeof vslCompleted === 'boolean') {
    context.vsl_completed = vslCompleted;
    hasExplicitContext = true;
  }

  const trackingMode = parseTrackingMode(params.get('tracking_mode'));

  if (trackingMode) {
    context.tracking_mode = trackingMode;
    hasExplicitContext = true;
  }

  if (!context.funnel_slug && context.from_funnel) {
    context.funnel_slug = context.from_funnel;
  }

  if (hasExplicitContext && !context.tracking_mode) {
    context.tracking_mode = isAdsRoutePath(url.pathname) ? 'ads' : 'organic';
  }

  return hasExplicitContext ? context : null;
}

export function getFunnelContext(): FunnelContext | null {
  const url = getCurrentUrl();
  const urlContext = url ? readContextFromUrl(url) : null;

  return urlContext ?? readContextFromStorage();
}

export function persistFunnelContextFromUrl(): FunnelContext | null {
  const url = getCurrentUrl();
  const context = url ? readContextFromUrl(url) : null;

  if (!context || typeof window === 'undefined') {
    return context;
  }

  try {
    window.localStorage.setItem(FUNNEL_CONTEXT_STORAGE_KEY, JSON.stringify(context));
  } catch {
    // Funnel context is additive; checkout remains usable when storage is unavailable.
  }

  return context;
}
