import type { ResolvedAttribution } from '../../core/attribution';
import type { FunnelContext } from '../funnel/funnelContext';
import type { MetaBrowserIds } from '../tracking/metaBrowserIds';
import type { VisitorOrderMetadata } from '../tracking/visitorUserData';

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
  visitor?: VisitorOrderMetadata;
}

export interface PurchaseIntent extends Omit<StartPurchaseIntentInput, 'visitor'> {
  orderId: string;
  status: 'qr_requested';
  purchaseFlow: 'temporary_whatsapp_qr';
  attribution: ResolvedAttribution;
  funnel: FunnelContext | null;
  createdAt: string;
  currentUrl: string;
  name: string;
  phone: string;
  whatsapp: string;
  phone_national: string;
  phone_country_code: string;
  phone_calling_code: string;
  phone_e164: string;
  visitor: VisitorOrderMetadata['visitor'];
  client_ip_address: string;
  client_user_agent: string;
  visitor_country: string;
  visitor_country_name: string;
  traffic_channel: ResolvedAttribution['channel'];
  attribution_source: ResolvedAttribution['source'];
  paid_platform: ResolvedAttribution['paidPlatform'];
  fbclid: string;
  ttclid: string;
  gclid: string;
  fbp: string;
  fbc: string;
  metaBrowserIds: MetaBrowserIds;
  landing_path: string;
  current_path: string;
  from_funnel: string;
  funnel_sid: string;
  funnel_pattern: string;
  vsl_completed: boolean | '';
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
