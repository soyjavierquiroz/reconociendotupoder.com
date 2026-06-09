import type { ResolvedAttribution } from '../../core/attribution';

export type PurchaseFlow = 'temporary_whatsapp_qr' | 'jakawi_drenvex_checkout';

export interface PurchaseCustomer {
  name: string;
  whatsapp: string;
  phone: string;
  phoneNational: string;
  phoneCountryCode: string;
  phoneCallingCode: string;
  phoneE164: string;
}

export interface StartPurchaseIntentInput {
  productId: string;
  offerId: string;
  productName: string;
  value: number;
  currency: string;
  source: string;
  ctaLabel: string;
  customer: PurchaseCustomer;
}

export interface PurchaseIntent extends StartPurchaseIntentInput {
  orderId: string;
  status: 'qr_requested';
  purchaseFlow: 'temporary_whatsapp_qr';
  attribution: ResolvedAttribution;
  createdAt: string;
  currentUrl: string;
  name: string;
  phone: string;
  whatsapp: string;
  phone_national: string;
  phone_country_code: string;
  phone_calling_code: string;
  phone_e164: string;
  traffic_channel: ResolvedAttribution['channel'];
  attribution_source: ResolvedAttribution['source'];
  paid_platform: ResolvedAttribution['paidPlatform'];
  fbclid: string;
  ttclid: string;
  gclid: string;
  landing_path: string;
  current_path: string;
}

export type StartPurchaseIntentResult =
  | {
      status: 'opened';
      orderId: string;
    }
  | {
      status: 'not_configured' | 'unsupported_flow' | 'webhook_failed' | 'navigation_failed';
      orderId: string | null;
      message: string;
    };
