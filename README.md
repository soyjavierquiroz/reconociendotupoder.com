# Reconociendo Tu Poder

Child site for `reconociendotupoder.com`, based on `funnel-boilerplate` tag `parent-clean-v1`.

## Repository Lineage

- Base: `funnel-boilerplate parent-clean-v1`.
- Upstream: `git@github.com:soyjavierquiroz/funnel-boilerplate.git`.
- Origin: `git@github.com:soyjavierquiroz/reconociendotupoder.com.git`.
- Branch: `reconociendotupoder`.

Core engine, routing, analytics, shared components, and `public/capture.php` come from upstream unless a change should apply to every clone.

## Current Site Identity

- Product/event: `Reconociendo Tu Poder`.
- Site id: `RECONOCIENDO_TU_PODER`.
- Domain: `reconociendotupoder.com`.
- Landing slug: `reconociendo-tu-poder`.
- Ads route prefix: `VITE_ADS_ROUTE_PREFIX=/x9m`.
- Capture frontend endpoint: `VITE_CAPTURE_WEBHOOK_URL=/capture.php`.
- Capture remains in dry-run/placeholders until real server env is configured.
- Assets currently point to `public/assets/funnel-placeholder.svg`.

## Editable Surface

Primary RTP-owned edits should stay in:

- `.env`.
- `src/site/**`, especially `src/site/dna.config.ts`.
- `public/assets/reconociendo-tu-poder/**`.
- Server env values prefixed with `CAPTURE_*`.

Do not put secrets, real tokens, or private webhook URLs in committed files.

## Operations

- [Deploy on CyberPanel](OPERATIONS/deploy-cyberpanel.md)
- [Capture server env](OPERATIONS/capture-server-env.md)

## Deploy Safety

Offer deploys publish `dist/` into
`/home/reconociendotupoder.com/public_html/` with `rsync --delete`, so they
must preserve external funnel folders that live under the same domain.

Use these excludes for every offer deploy:

```bash
rsync -av --delete \
  --exclude 'capture.php' \
  --exclude '/fi/' \
  --exclude '/x9m/fi/' \
  dist/ /home/reconociendotupoder.com/public_html/
```

`/fi/` and `/x9m/fi/` belong to external funnels served from
`reconociendotupoder.com`, including MNLE at `/fi/mnle/` and
`/x9m/fi/mnle/`. Do not delete or update those folders from this offer repo;
use the corresponding funnel repo and deploy process instead.

## Temporary No Le Escribas Purchase Flow

`/o/no-le-escribas`, `/x9m/o/no-le-escribas`, `/no-le-escribas`, and
`/x9m/no-le-escribas` currently use the
`temporary_whatsapp_qr` purchase adapter to validate paid demand before the
Jakawi/Drenvex checkout is ready.

- The sales page is intentionally trust-first: early CTAs navigate by section
  anchors, the offer CTA moves to `#pago-qr`, and only the Pago QR CTA opens
  the premium-styled temporary checkout drawer that captures full name and
  phone. Its reusable phone field uses the existing visitor/IP country
  detection and country selector, with Bolivia (`BO`, `+591`) as the fallback.
- No Le Escribas pricing is centralized in `DNA.noLeEscribas.offer`. Change
  `noLeEscribasPrice` in `src/site/dna.config.ts` to derive the offer id,
  visible labels, CTA labels, webhook value, WhatsApp amount, and checkout
  tracking from the same source.
- Phone input is normalized into national, country, calling-code, E.164, and
  digits-only CRM fields without removing the existing `phone` and `whatsapp`
  fields. The landing then calls only `startPurchaseIntent`; WhatsApp
  navigation and QR handoff details stay isolated in `src/site/purchase`.
- `VITE_TEMPORARY_QR_WHATSAPP_URL` configures the public WhatsApp destination.
  An empty value leaves every CTA safe and non-navigating.
- `VITE_PURCHASE_INTENT_WEBHOOK_URL` must accept the `qr_requested` order before
  the adapter can continue. It receives customer data, order metadata, current
  URL, structured attribution, and flat n8n/CRM attribution fields, including
  Meta's `fbp` and `fbc` browser identifiers when available.
- Funnel handoff context is stored separately from attribution in
  `localStorage.rtp_funnel_context_v1`. The `/ordenes` payload includes the
  structured `funnel` object plus flat `from_funnel`, `funnel_sid`,
  `funnel_pattern`, and `vsl_completed` fields for n8n/Sheets convenience.
- n8n should persist `fbp` and `fbc` with the order in Sheets and pass them as
  `user_data.fbp` and `user_data.fbc` from the mark-paid workflow to the relay.
  `Purchase` continues to be emitted only by n8n after payment confirmation.
- The order and customer data are stored in local and session storage before
  the webhook request. A missing or failed webhook leaves the drawer open and
  does not fire `InitiateCheckout` or navigate to WhatsApp.
- A successful QR request fires `InitiateCheckout` after the webhook responds
  with HTTP `200`, `201`, or `202`, then redirects to WhatsApp with the customer
  name, E.164 phone, and short `NLE-MMDD-XXXX` order id. It never fires
  `Purchase`, `Lead`, or `CompleteRegistration`.
- For Meta deduplication, that single `InitiateCheckout` call creates one
  event id and reuses it as browser Pixel `{ eventID }` and CAPI relay
  `event_id`. Add `?debug_tracking=1` or set `localStorage.DEBUG_TRACKING = '1'`
  to log only the Pixel/CAPI event ids while testing.
- Confirmed `Purchase` events must come later from n8n or the final
  Jakawi/Drenvex checkout after payment confirmation.
- `CompleteRegistration` remains a capture conversion only and requires a
  session marker created by a successful event capture.

## Routing

Current public routes are:

- `/`
- `/x9m`
- `/o/no-le-escribas`
- `/x9m/o/no-le-escribas`
- `/no-le-escribas`
- `/x9m/no-le-escribas`
- `/oferta`
- `/x9m/oferta`
- `/confirmacion`
- `/x9m/confirmacion`

`VITE_ADS_ROUTE_PREFIX` is a public browser value used to separate ads routes from organic routes. It must start with `/`, must not be `/`, and must not end with `/`.

Traffic attribution is resolved by upstream code in `src/core/attribution`. The canonical priority is:

1. Ads route prefix.
2. `fbclid`.
3. `ttclid`.
4. `gclid`.
5. `utm_medium=paid`.
6. Stored attribution.
7. Organic default.

`VITE_ADS_ROUTE_PREFIX` remains a strong ads signal, but click IDs can also mark traffic as ads on organic-looking routes such as `/oferta?fbclid=abc`. Paid attribution is stored in `localStorage` under `funnel_attribution` for 30 days so later navigation does not lose the paid channel. This is a single-touch resolver, not a multi-touch attribution system.

Analytics, browser pixels, CAPI relay payloads, and the event capture payload should consume this resolver as the canonical attribution source. `src/core/services/analytics.ts` must not parse click IDs or UTMs independently. Meta Pixel, TikTok Pixel, and CAPI are enabled only when the current path is under `VITE_ADS_ROUTE_PREFIX`; click IDs, paid UTMs, stored attribution, and explicit `trackingEnabled` values cannot enable them on organic paths. Paid attribution may still come from the ads route, a click ID, a paid-like UTM, or fresh stored attribution for reporting.

For the No Le Escribas offer, the canonical organic route is
`/o/no-le-escribas` and the canonical ads route is `/x9m/o/no-le-escribas`.
Legacy aliases `/no-le-escribas` and `/x9m/no-le-escribas` remain internal
route aliases and do not redirect.

For new forms and checkout CTAs, resolve attribution once in the route/component and pass the `ResolvedAttribution` object into analytics. Capture payloads should include the shared `buildAttributionEventFields(attribution)` output. Legacy VSL helpers such as `AdvancedCaptureForm`, `PricingCard`, and `ExpertCtaButton` are not clone-safe capture/tracking templates until they are adapted to that contract.

Keep shared components, analytics helpers, routing, and capture relay generic unless the change should flow back upstream to every clone.

## Validation

Before publishing a clone, run:

`php -l public/capture.php`
`npm run typecheck`
`npm run lint`
`npm run build`
`git diff --check`

Then verify the current routes using the configured ads prefix. With `VITE_ADS_ROUTE_PREFIX=/x9m`, check `/`, `/x9m`, `/oferta`, `/x9m/oferta`, `/confirmacion`, and `/x9m/confirmacion`.
The first RTP sales letter lives at `/o/no-le-escribas`, `/x9m/o/no-le-escribas`, `/no-le-escribas`, and `/x9m/no-le-escribas`; `/oferta` remains available but is not the strategic ads route for this offer.
Also verify `/oferta?fbclid=abc`, `/oferta?ttclid=abc`, `/oferta?gclid=abc`, and `/oferta?utm_medium=paid` resolve as ads, then clear `localStorage.funnel_attribution` and confirm `/oferta` returns to organic/default.
