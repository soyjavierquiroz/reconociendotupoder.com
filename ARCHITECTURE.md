# Architecture

This repository is a parent funnel boilerplate. Runtime code reads the active site through the site boundary in `src/site/current.ts`, which re-exports from `src/site/dna.config.ts`.

## Boundaries

- `src/site/dna.config.ts`: active clone-owned config, copy, prices, product ids, assets, tracking defaults, capture settings, offer copy, event copy, and success behavior.
- `src/site/current.ts`: official import boundary for pages and components.
- `src/core/attribution`: pure traffic attribution resolver plus browser storage adapter.
- `src/core/services/analytics.ts`: analytics, browser pixel, and CAPI helper that enriches event data from `ResolvedAttribution`.
- `src/core/routing/adsRoute.ts`: normalizes the public `VITE_ADS_ROUTE_PREFIX` and composes ads route paths.
- `public/assets/funnel-placeholder.svg`: neutral default asset used by the parent.
- `public/capture.php`: generic capture relay configured with `CAPTURE_*` server env only.

The old root config facade was removed. New code should import site config through `src/site/current.ts` or `src/site/dna.config.ts` when editing the active site boundary.

## Operational Shape

The parent intentionally does not ship a deploy script or Docker stack for a real site. A clone should document its own deploy path outside the shared boilerplate unless the flow is genuinely generic.

This child site shares the production web root with external immersive funnels.
The offer deploy copies `dist/` into
`/home/reconociendotupoder.com/public_html/` with `rsync --delete`, so the
deployment contract must always exclude:

```bash
--exclude 'capture.php'
--exclude '/fi/'
--exclude '/x9m/fi/'
```

`/fi/` and `/x9m/fi/` are not owned by this offer repo. They are external
funnel publish roots on the same domain, including the MNLE funnel. Updating
those folders must happen from the funnel-specific repository, not from this
offer deployment.

## Clone Rule

A child site owns identity, assets, env, checkout, capture destinations, tracking ids, and launch documentation. Shared engine code should remain product-agnostic.

Ads and organic pages share the same visual routes, but ads routes are separated with `VITE_ADS_ROUTE_PREFIX`. The parent fallback is `/x9m`; clones may choose another public prefix that starts with `/`, is not `/`, and has no trailing slash.

Traffic channel is not route-only. `src/core/attribution` resolves channel with this priority:

1. Ads route prefix.
2. `fbclid`.
3. `ttclid`.
4. `gclid`.
5. `utm_medium=paid`.
6. Stored attribution.
7. Organic default.

The ads route prefix remains the strongest signal. Click IDs mark ads even on organic paths, and `utm_medium=paid` marks ads with no specific paid platform. Paid attribution is persisted in browser `localStorage` as `funnel_attribution` with a 30 day TTL. The stored value is used only when no stronger signal exists and is not overwritten by organic/default traffic. This is intentionally single-touch attribution; multi-touch modeling is not part of the core engine yet.

Analytics and capture payloads treat `ResolvedAttribution` as the canonical source for `traffic_channel`, `attribution_source`, `paid_platform`, `click_ids`, `utms`, `landing_path`, and `current_path`. Analytics should accept caller-provided attribution when available and resolve the current browser attribution only as a fallback. Meta Pixel, TikTok Pixel, and CAPI ads tracking are hard-gated by the current ads-prefixed path; attribution signals and explicit component flags cannot enable them on organic paths.

Meta event deduplication is owned inside `src/core/services/analytics.ts`: one generated event id is reused for browser Pixel `eventID`, TikTok `event_id`, and CAPI relay `event_id` for each tracked event.

New tracking and capture surfaces should use `resolveCurrentAttribution` plus `buildAttributionEventFields`. Route-only helpers such as `getTrafficChannel` remain for compatibility and are not sufficient for new tracking/capture decisions because plain pathname calls do not include click IDs, UTMs, or stored attribution. Legacy VSL components that submit capture or checkout events must be adapted before they are treated as clone-safe.
