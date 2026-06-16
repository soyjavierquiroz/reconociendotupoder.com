import { describe, expect, it } from 'vitest';
import { resolveAttribution } from './resolver';
import type { StoredAttribution } from './types';

const ADS_ROUTE_PREFIX = '/x9m';
const NOW = 1_700_000_000_000;

const freshStoredAttribution: StoredAttribution = {
  channel: 'ads',
  source: 'clickid',
  paidPlatform: 'meta',
  landingPath: '/stored-landing',
  clickIds: { fbclid: 'stored_fbclid' },
  utms: { utm_campaign: 'stored_campaign' },
  resolvedAt: NOW - 1_000,
  expiresAt: NOW + 1_000,
};

const expiredStoredAttribution: StoredAttribution = {
  ...freshStoredAttribution,
  expiresAt: NOW - 1,
};

function resolve(url: string, storedAttribution?: StoredAttribution | null) {
  return resolveAttribution({
    url,
    adsRoutePrefix: ADS_ROUTE_PREFIX,
    storedAttribution,
    now: NOW,
  });
}

describe('resolveAttribution', () => {
  it('resolves organic default traffic when no paid signals exist', () => {
    expect(resolve('/')).toMatchObject({
      channel: 'organic',
      source: 'default',
      paidPlatform: null,
      shouldTrackAds: false,
      landingPath: '/',
      currentPath: '/',
    });

    expect(resolve('/oferta')).toMatchObject({
      channel: 'organic',
      source: 'default',
      shouldTrackAds: false,
      landingPath: '/oferta',
    });
  });

  it('resolves ads route traffic', () => {
    expect(resolve('/x9m')).toMatchObject({
      channel: 'ads',
      source: 'route',
      shouldTrackAds: true,
      landingPath: '/x9m',
      currentPath: '/x9m',
    });

    expect(resolve('/x9m/oferta')).toMatchObject({
      channel: 'ads',
      source: 'route',
      shouldTrackAds: true,
      landingPath: '/x9m/oferta',
    });
  });

  it('resolves paid click ids on organic-looking paths', () => {
    expect(resolve('/oferta?fbclid=abc')).toMatchObject({
      channel: 'ads',
      source: 'clickid',
      paidPlatform: 'meta',
      clickIds: { fbclid: 'abc' },
      shouldTrackAds: false,
    });

    expect(resolve('/oferta?ttclid=abc')).toMatchObject({
      channel: 'ads',
      source: 'clickid',
      paidPlatform: 'tiktok',
      clickIds: { ttclid: 'abc' },
      shouldTrackAds: false,
    });

    expect(resolve('/oferta?gclid=abc')).toMatchObject({
      channel: 'ads',
      source: 'clickid',
      paidPlatform: 'google',
      clickIds: { gclid: 'abc' },
      shouldTrackAds: false,
    });
  });

  it('resolves paid UTM medium values without a specific paid platform', () => {
    expect(resolve('/oferta?utm_medium=paid')).toMatchObject({
      channel: 'ads',
      source: 'utm',
      paidPlatform: null,
      utms: { utm_medium: 'paid' },
      shouldTrackAds: false,
    });

    expect(resolve('/oferta?utm_medium=cpc')).toMatchObject({
      channel: 'ads',
      source: 'utm',
      paidPlatform: null,
      utms: { utm_medium: 'cpc' },
      shouldTrackAds: false,
    });
  });

  it('keeps route as the strongest source while preserving click ids and platform', () => {
    expect(resolve('/x9m/oferta?fbclid=abc')).toMatchObject({
      channel: 'ads',
      source: 'route',
      paidPlatform: 'meta',
      clickIds: { fbclid: 'abc' },
      landingPath: '/x9m/oferta',
      currentPath: '/x9m/oferta',
    });
  });

  it('uses fresh stored attribution when there are no current paid signals', () => {
    expect(resolve('/oferta', freshStoredAttribution)).toMatchObject({
      channel: 'ads',
      source: 'stored',
      paidPlatform: 'meta',
      landingPath: '/stored-landing',
      currentPath: '/oferta',
      clickIds: { fbclid: 'stored_fbclid' },
      utms: { utm_campaign: 'stored_campaign' },
      shouldTrackAds: false,
    });
  });

  it('ignores expired stored attribution', () => {
    expect(resolve('/oferta', expiredStoredAttribution)).toMatchObject({
      channel: 'organic',
      source: 'default',
      paidPlatform: null,
      landingPath: '/oferta',
      clickIds: {},
      utms: {},
      shouldTrackAds: false,
    });
  });

  it('lets current click ids win over stored attribution', () => {
    expect(resolve('/oferta?ttclid=current', freshStoredAttribution)).toMatchObject({
      channel: 'ads',
      source: 'clickid',
      paidPlatform: 'tiktok',
      landingPath: '/oferta',
      clickIds: { ttclid: 'current' },
      utms: {},
      shouldTrackAds: false,
    });
  });

  it('uses the ads route exclusively to enable ads tracking', () => {
    expect(resolve('/no-le-escribas?fbclid=abc', freshStoredAttribution).shouldTrackAds).toBe(false);
    expect(resolve('/o/no-le-escribas?fbclid=abc', freshStoredAttribution).shouldTrackAds).toBe(
      false,
    );
    expect(resolve('/x9m/no-le-escribas').shouldTrackAds).toBe(true);
    expect(resolve('/x9m/o/no-le-escribas?fbclid=abc').shouldTrackAds).toBe(true);
  });
});
