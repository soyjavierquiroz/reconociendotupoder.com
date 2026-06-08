import type { ResolvedAttribution } from '../../core/attribution';

export type PurchaseFlow = 'temporary_whatsapp_qr' | 'jakawi_drenvex_checkout';

export interface StartPurchaseIntentInput {
  productId: string;
  offerId: string;
  productName: string;
  value: number;
  currency: string;
  source: string;
  ctaLabel: string;
}

export interface PurchaseIntent extends StartPurchaseIntentInput {
  orderId: string;
  attribution: ResolvedAttribution;
  createdAt: string;
  currentUrl: string;
}

export type StartPurchaseIntentResult =
  | {
      status: 'opened';
      orderId: string;
    }
  | {
      status: 'not_configured' | 'unsupported_flow';
      orderId: string | null;
      message: string;
    };
