# Reconociendo Tu Poder Site Boundary

`src/site/**` is the active customization boundary for the Reconociendo Tu Poder child site.

## Files

- `dna.config.ts`: active site config with the minimal Reconociendo Tu Poder identity.
- `current.ts`: official runtime export consumed by pages and components.
- `pages/NoLeEscribasSalesPage.tsx`: RTP-owned visual sales letter for the first offer.

## Current Identity

- Product/event: `Reconociendo Tu Poder`.
- Site id: `RECONOCIENDO_TU_PODER`.
- Domain: `reconociendotupoder.com`.
- Landing slug: `reconociendo-tu-poder`.
- Tracking source: `rtp-event`.
- Product ids: `RTP_MAIN`, `RTP_BUMP`, `RTP_CONTINUITY`, `RTP_VIP`.
- Assets still point to `/assets/funnel-placeholder.svg` until brand media is added.
- First offer routes: `/o/no-le-escribas`, `/x9m/o/no-le-escribas`,
  `/no-le-escribas`, and `/x9m/no-le-escribas`.

## Site Guidance

Replace site-specific copy, assets, tracking, checkout, capture, offer, event, and success behavior here when RTP is ready for those layers. Keep shared components generic unless a change belongs upstream for all clones.
