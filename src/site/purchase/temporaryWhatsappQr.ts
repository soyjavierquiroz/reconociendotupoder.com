import { resolveCurrentAttribution } from '../../core/attribution';
import { trackEvent } from '../../core/services/analytics';
import { DNA } from '../current';
import { getFunnelContext } from '../funnel/funnelContext';
import { getMetaBrowserIds, type MetaBrowserIds } from '../tracking/metaBrowserIds';
import { createTemporaryOrderId } from './orderId';
import { storePurchaseIntent } from './storage';
import type {
  PurchaseIntent,
  StartPurchaseIntentInput,
  StartPurchaseIntentResult,
} from './types';

const CHECKOUT_NOT_CONFIGURED_MESSAGE = 'El checkout temporal no está configurado.';
const WHATSAPP_NOT_CONFIGURED_MESSAGE = 'WhatsApp de pedidos no está configurado.';
const WEBHOOK_FAILED_MESSAGE = 'No pudimos crear tu pedido. Intenta de nuevo en unos segundos.';

type TemporaryWhatsappQrDependencies = {
  attribution?: ReturnType<typeof resolveCurrentAttribution>;
  intentWebhookUrl?: string;
  whatsappUrl?: string;
  fetch?: typeof fetch;
  navigate?: (url: string) => void;
  track?: typeof trackEvent;
  metaBrowserIds?: MetaBrowserIds;
};

function getCurrentUrl(): string {
  return typeof window === 'undefined' ? '' : window.location?.href ?? '';
}

export function buildTemporaryWhatsappQrUrl(baseUrl: string, message: string): string | null {
  try {
    const url = new URL(baseUrl);

    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return null;
    }

    url.searchParams.set('text', message);
    return url.toString();
  } catch {
    return null;
  }
}

async function sendIntentToWebhook(
  intent: PurchaseIntent,
  webhookUrl: string,
  fetchImplementation: typeof fetch,
): Promise<boolean> {
  try {
    const response = await fetchImplementation(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(intent),
      keepalive: true,
    });

    return response.status === 200 || response.status === 201 || response.status === 202;
  } catch {
    return false;
  }
}

export function buildTemporaryWhatsappQrMessage(
  productName: string,
  orderId: string,
  priceLabel: string,
  customerName: string,
  customerWhatsapp?: string,
): string {
  return [
    `Hola, quiero recibir mi QR para *${productName}.*`,
    '',
    `Nombre: ${customerName}`,
    `Código de pedido: ${orderId}`,
    `Monto: ${priceLabel}`,
    ...(customerWhatsapp ? [`WhatsApp: ${customerWhatsapp}`] : []),
  ].join('\n');
}

export function buildTemporaryPurchaseIntent(
  input: StartPurchaseIntentInput,
  attribution = resolveCurrentAttribution(),
  orderId = createTemporaryOrderId(),
  currentUrl = getCurrentUrl(),
  metaBrowserIds = getMetaBrowserIds(attribution.clickIds.fbclid),
): PurchaseIntent {
  const funnelContext = getFunnelContext();

  return {
    ...input,
    orderId,
    status: 'qr_requested',
    purchaseFlow: 'temporary_whatsapp_qr',
    attribution,
    funnel: funnelContext,
    createdAt: new Date().toISOString(),
    currentUrl,
    name: input.customer.name,
    phone: input.customer.phone,
    whatsapp: input.customer.whatsapp,
    phone_national: input.customer.phoneNational,
    phone_country_code: input.customer.phoneCountryCode,
    phone_calling_code: input.customer.phoneCallingCode,
    phone_e164: input.customer.phoneE164,
    traffic_channel: attribution.channel,
    attribution_source: attribution.source,
    paid_platform: attribution.paidPlatform,
    fbclid: attribution.clickIds.fbclid ?? '',
    ttclid: attribution.clickIds.ttclid ?? '',
    gclid: attribution.clickIds.gclid ?? '',
    fbp: metaBrowserIds.fbp,
    fbc: metaBrowserIds.fbc,
    metaBrowserIds,
    landing_path: attribution.landingPath,
    current_path: attribution.currentPath,
    from_funnel: funnelContext?.from_funnel ?? '',
    funnel_sid: funnelContext?.sid ?? '',
    funnel_pattern: funnelContext?.pattern ?? '',
    vsl_completed:
      typeof funnelContext?.vsl_completed === 'boolean' ? funnelContext.vsl_completed : '',
  };
}

function defaultNavigate(url: string): void {
  window.location.assign(url);
}

export async function startTemporaryWhatsappQrIntent(
  input: StartPurchaseIntentInput,
  dependencies: TemporaryWhatsappQrDependencies = {},
): Promise<StartPurchaseIntentResult> {
  const intentWebhookUrl =
    dependencies.intentWebhookUrl ?? DNA.noLeEscribas.purchase.intentWebhookUrl;

  if (!intentWebhookUrl) {
    return {
      status: 'not_configured',
      orderId: null,
      message: CHECKOUT_NOT_CONFIGURED_MESSAGE,
    };
  }

  const attribution = dependencies.attribution ?? resolveCurrentAttribution();
  const metaBrowserIds =
    dependencies.metaBrowserIds ?? getMetaBrowserIds(attribution.clickIds.fbclid);
  const intent = buildTemporaryPurchaseIntent(
    input,
    attribution,
    undefined,
    undefined,
    metaBrowserIds,
  );

  storePurchaseIntent(intent);

  const fetchImplementation = dependencies.fetch ?? globalThis.fetch;
  const webhookSucceeded = await sendIntentToWebhook(intent, intentWebhookUrl, fetchImplementation);

  if (!webhookSucceeded) {
    return {
      status: 'webhook_failed',
      orderId: intent.orderId,
      message: WEBHOOK_FAILED_MESSAGE,
    };
  }

  const whatsappUrl = buildTemporaryWhatsappQrUrl(
    dependencies.whatsappUrl ?? DNA.noLeEscribas.purchase.whatsappUrl,
    buildTemporaryWhatsappQrMessage(
      input.productName,
      intent.orderId,
      DNA.noLeEscribas.offer.priceLabel,
      input.customer.name,
      input.customer.phoneE164,
    ),
  );

  if (!whatsappUrl || typeof window === 'undefined') {
    return {
      status: 'not_configured',
      orderId: intent.orderId,
      message: WHATSAPP_NOT_CONFIGURED_MESSAGE,
    };
  }

  const track = dependencies.track ?? trackEvent;

  await track('InitiateCheckout', {
    event_name: 'InitiateCheckout',
    content_ids: [input.productId],
    content_name: input.productName,
    content_category: 'sales_page',
    content_type: 'product',
    num_items: 1,
    product_id: input.productId,
    offer_id: input.offerId,
    order_id: intent.orderId,
    value: input.value,
    currency: input.currency,
    source: input.source,
    cta_label: input.ctaLabel,
    userData: {
      phone: input.customer.phoneE164,
    },
    attribution,
  }).catch(() => undefined);

  try {
    (dependencies.navigate ?? defaultNavigate)(whatsappUrl);
  } catch {
    return {
      status: 'navigation_failed',
      orderId: intent.orderId,
      message: 'No se pudo abrir WhatsApp de forma segura.',
    };
  }

  return {
    status: 'opened',
    orderId: intent.orderId,
  };
}
