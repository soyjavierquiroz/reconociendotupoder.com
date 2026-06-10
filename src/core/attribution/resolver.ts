import { isAdsRoutePath } from '../routing/adsRoute';
import type {
  AttributionClickIds,
  AttributionSource,
  PaidPlatform,
  ResolvedAttribution,
  ResolveAttributionInput,
  StoredAttribution,
} from './types';

const PAID_UTM_MEDIUM_VALUES = new Set(['paid', 'cpc', 'ppc', 'paid_social', 'paid-search']);

function parseUrl(value: string | URL): URL {
  if (value instanceof URL) {
    return value;
  }

  return new URL(value, 'https://funnel.local');
}

function getFirstSearchParam(params: URLSearchParams, key: string): string | undefined {
  const value = params.get(key)?.trim();

  return value ? value : undefined;
}

export function extractClickIds(params: URLSearchParams): AttributionClickIds {
  return {
    fbclid: getFirstSearchParam(params, 'fbclid'),
    ttclid: getFirstSearchParam(params, 'ttclid'),
    gclid: getFirstSearchParam(params, 'gclid'),
  };
}

export function extractUtms(params: URLSearchParams): Record<string, string> {
  const utms: Record<string, string> = {};

  params.forEach((value, key) => {
    if (key.toLowerCase().startsWith('utm_') && value.trim()) {
      utms[key] = value.trim();
    }
  });

  return utms;
}

export function isStoredAttributionFresh(
  storedAttribution: StoredAttribution | null | undefined,
  now = Date.now(),
): storedAttribution is StoredAttribution {
  return Boolean(
    storedAttribution &&
      storedAttribution.channel === 'ads' &&
      storedAttribution.landingPath &&
      storedAttribution.expiresAt > now,
  );
}

function getPaidPlatformFromClickIds(clickIds: AttributionClickIds): PaidPlatform {
  if (clickIds.fbclid) {
    return 'meta';
  }

  if (clickIds.ttclid) {
    return 'tiktok';
  }

  if (clickIds.gclid) {
    return 'google';
  }

  return null;
}

function isPaidUtm(utms: Record<string, string>): boolean {
  const utmMedium = utms.utm_medium?.toLowerCase();

  return utmMedium ? PAID_UTM_MEDIUM_VALUES.has(utmMedium) : false;
}

export function resolveAttribution(input: ResolveAttributionInput): ResolvedAttribution {
  const now = input.now ?? Date.now();
  const parsedUrl = parseUrl(input.url);
  const currentPath = parsedUrl.pathname || '/';
  const shouldTrackAds = isAdsRoutePath(currentPath, input.adsRoutePrefix);
  const clickIds = extractClickIds(parsedUrl.searchParams);
  const utms = extractUtms(parsedUrl.searchParams);
  const clickIdPlatform = getPaidPlatformFromClickIds(clickIds);
  const freshStoredAttribution = isStoredAttributionFresh(input.storedAttribution, now)
    ? input.storedAttribution
    : null;

  let source: AttributionSource = 'default';
  let paidPlatform: PaidPlatform = null;

  if (shouldTrackAds) {
    source = 'route';
    paidPlatform = clickIdPlatform;
  } else if (clickIds.fbclid) {
    source = 'clickid';
    paidPlatform = 'meta';
  } else if (clickIds.ttclid) {
    source = 'clickid';
    paidPlatform = 'tiktok';
  } else if (clickIds.gclid) {
    source = 'clickid';
    paidPlatform = 'google';
  } else if (isPaidUtm(utms)) {
    source = 'utm';
    paidPlatform = null;
  } else if (freshStoredAttribution) {
    source = 'stored';
    paidPlatform = freshStoredAttribution.paidPlatform;
  }

  const channel = source === 'default' ? 'organic' : 'ads';
  const useStoredLandingPath = source === 'stored' && freshStoredAttribution?.landingPath;

  return {
    channel,
    source,
    paidPlatform,
    landingPath: useStoredLandingPath ? freshStoredAttribution.landingPath : currentPath,
    currentPath,
    clickIds:
      source === 'stored' && freshStoredAttribution
        ? { ...freshStoredAttribution.clickIds }
        : clickIds,
    utms: source === 'stored' && freshStoredAttribution ? { ...freshStoredAttribution.utms } : utms,
    shouldTrackAds,
  };
}
