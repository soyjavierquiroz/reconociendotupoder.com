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
  tracking_mode?: 'ads' | 'organic' | string;
  offer_received_at?: string;
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
  'offer_received_at',
];

const TRUE_VALUES = new Set(['1', 'true', 'yes']);
const FALSE_VALUES = new Set(['0', 'false', 'no']);
const VALID_PATTERNS = new Set([
  'abandono',
  'validacion',
  'cierre',
  'culpa',
  'nostalgia',
  'ansiedad-silencio',
]);
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

  return normalized ? normalized.slice(0, MAX_CONTEXT_VALUE_LENGTH) : undefined;
}

function stripAccents(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normalizePattern(value: string | null): string | undefined {
  const normalized = stripAccents(value?.trim().toLowerCase() ?? '')
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-');

  return VALID_PATTERNS.has(normalized) ? normalized : undefined;
}

function assignStringContextValue(
  context: FunnelContext,
  key: StringFunnelContextKey,
  value: string | null,
): boolean {
  const cleanedValue = cleanContextValue(value);

  if (!cleanedValue) {
    return false;
  }

  context[key] = cleanedValue;
  return true;
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
      assignStringContextValue(
        context,
        key,
        typeof parsedContext[key] === 'string' ? parsedContext[key] : null,
      );
    });

    const normalizedPattern = normalizePattern(
      typeof parsedContext.pattern === 'string' ? parsedContext.pattern : null,
    );

    if (normalizedPattern) {
      context.pattern = normalizedPattern;
    } else {
      delete context.pattern;
    }

    if (typeof parsedContext.vsl_completed === 'boolean') {
      context.vsl_completed = parsedContext.vsl_completed;
    }

    if (typeof parsedContext.tracking_mode === 'string') {
      context.tracking_mode = parseTrackingMode(parsedContext.tracking_mode);
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

  hasExplicitContext =
    assignStringContextValue(context, 'from_funnel', params.get('from_funnel')) ||
    hasExplicitContext;
  hasExplicitContext =
    assignStringContextValue(context, 'funnel_slug', params.get('funnel_slug')) ||
    hasExplicitContext;
  hasExplicitContext =
    assignStringContextValue(context, 'sid', params.get('sid') ?? params.get('funnel_sid')) ||
    hasExplicitContext;
  hasExplicitContext =
    assignStringContextValue(context, 'entry_path', params.get('entry_path')) ||
    hasExplicitContext;
  hasExplicitContext =
    assignStringContextValue(context, 'handoff_path', params.get('handoff_path')) ||
    hasExplicitContext;
  hasExplicitContext =
    assignStringContextValue(context, 'completed_at', params.get('completed_at')) ||
    hasExplicitContext;

  const normalizedPattern = normalizePattern(
    params.get('pattern') ?? params.get('funnel_pattern'),
  );

  if (normalizedPattern) {
    context.pattern = normalizedPattern;
    hasExplicitContext = true;
  }

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

function mergeFunnelContext(
  storedContext: FunnelContext | null,
  urlContext: FunnelContext | null,
  url: URL | null,
  options: { markOfferReceived?: boolean } = {},
): FunnelContext | null {
  const context = {
    ...(storedContext ?? {}),
    ...(urlContext ?? {}),
  };

  if (!context.funnel_slug && context.from_funnel) {
    context.funnel_slug = context.from_funnel;
  }

  if (url && isAdsRoutePath(url.pathname)) {
    context.tracking_mode = 'ads';
  } else if (!context.tracking_mode && url) {
    context.tracking_mode = isAdsRoutePath(url.pathname) ? 'ads' : 'organic';
  }

  if (options.markOfferReceived && Object.keys(context).length > 0 && !context.offer_received_at) {
    context.offer_received_at = new Date().toISOString();
  }

  return Object.keys(context).length > 0 ? context : null;
}

export function getFunnelContext(): FunnelContext | null {
  const url = getCurrentUrl();

  return mergeFunnelContext(readContextFromStorage(), url ? readContextFromUrl(url) : null, url);
}

export function persistFunnelContextFromUrl(): FunnelContext | null {
  const url = getCurrentUrl();
  const context = mergeFunnelContext(readContextFromStorage(), url ? readContextFromUrl(url) : null, url, {
    markOfferReceived: true,
  });

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
