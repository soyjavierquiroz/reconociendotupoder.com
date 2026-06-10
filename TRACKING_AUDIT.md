# Tracking Audit

Status: neutral parent baseline.

## Current Behavior

- Browser pixels are disabled unless `VITE_META_PIXEL_ID` or `VITE_TIKTOK_PIXEL_ID` are set.
- Server-side event relay is disabled unless `VITE_CAPI_RELAY_URL` is set.
- Default `VITE_SITE_ID` fallback is `EXAMPLE_SITE`.
- Event capture source fallback is `example-event`.
- Capture relay settings are controlled by server `CAPTURE_*` variables.
- `src/core/attribution` is the canonical source for traffic channel, attribution source, paid platform, click IDs, UTMs, landing path, current path, and ads tracking eligibility.
- `src/core/services/analytics.ts` enriches browser pixel and CAPI event data from `ResolvedAttribution`; it should not parse click IDs or UTMs directly.
- An explicit analytics `trackingEnabled` value wins over `ResolvedAttribution.shouldTrackAds`. Without that explicit flag, organic/default attribution does not fire Meta, TikTok, or CAPI ads tracking.
- Paid attribution can come from an ads route, `fbclid`, `ttclid`, `gclid`, paid-like `utm_medium`, or fresh stored attribution.
- New forms should use `resolveCurrentAttribution` and include `buildAttributionEventFields(attribution)` in capture payloads. Legacy VSL capture/checkout helpers are documentation-only starting points until adapted to the resolver contract.

## No Le Escribas Temporary Sales Flow

- `temporary_whatsapp_qr` is a temporary adapter for validating sales through a
  manual WhatsApp and QR handoff. The intended final destination is the
  Jakawi/Drenvex checkout.
- Every No Le Escribas purchase CTA opens a checkout-styled drawer for full
  name and phone. The phone field reuses `SmartPhoneInput` and
  `VisitorContext` for IP-based country detection, with `BO/+591` as fallback.
  On valid submit, `startPurchaseIntent` creates an
  `NLE-MMDD-XXXX` order id, resolves current attribution, stores the
  `qr_requested` intent and customer in local and session storage, and sends
  the enriched payload to the configured n8n webhook.
- The webhook payload keeps structured attribution and includes flat CRM fields
  for name, phone, WhatsApp, national phone, country code, calling code, E.164,
  traffic channel, attribution source, paid platform, click ids, Meta `fbp` and
  `fbc` browser identifiers, landing path, and current path.
- n8n should store `fbp` and `fbc` in the orders Sheet and include them as
  `user_data.fbp` and `user_data.fbc` in the mark-paid relay payload.
- `InitiateCheckout` receives explicit attribution and follows
  `ResolvedAttribution.shouldTrackAds`; it fires only after the n8n webhook
  responds with HTTP `200`, `201`, or `202`. Failed or missing configuration
  does not navigate to WhatsApp or emit the event.
- `ViewContent` uses explicit attribution and is emitted once per session only
  when `shouldTrackAds` is true.
- The landing does not emit `Lead`, `Purchase`, or `CompleteRegistration`.
  Confirmed `Purchase` must be emitted server-side by n8n or the final checkout.
- WhatsApp navigation remains encapsulated in the temporary purchase adapter.
  This drawer and adapter will be replaced by the Jakawi/Drenvex checkout.
- `CompleteRegistration` is not a sales conversion. The confirmation page emits
  it only after consuming a session marker created by a successful event
  capture, so direct confirmation-page visits do not track it.

## Clone Requirements

A clone must set its own site id, pixel ids, relay URL, allowed origins, capture destination, and test payloads. The parent contains no active production tracking identity.

## Validation

Run `npm run build` after env changes and perform a test event only against the clone-owned destination. Verify that capture and analytics payloads share the same `traffic_channel`, `attribution_source`, `paid_platform`, `click_ids`, `utms`, `landing_path`, and `current_path` values.
