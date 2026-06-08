import { resolveCurrentAttribution } from '../../core/attribution';
import { trackEvent } from '../../core/services/analytics';
import { DNA } from '../current';
import { createTemporaryOrderId } from './orderId';
import { storePurchaseIntent } from './storage';
import type {
  PurchaseIntent,
  StartPurchaseIntentInput,
  StartPurchaseIntentResult,
} from './types';

function getCurrentUrl(): string {
  return typeof window === 'undefined' ? '' : window.location.href;
}

function buildWhatsappUrl(baseUrl: string, message: string): string | null {
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

function sendIntentToWebhook(intent: PurchaseIntent, webhookUrl: string): void {
  if (!webhookUrl) {
    return;
  }

  try {
    void fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(intent),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // The temporary webhook must never block the WhatsApp handoff.
  }
}

export function startTemporaryWhatsappQrIntent(
  input: StartPurchaseIntentInput,
): StartPurchaseIntentResult {
  const attribution = resolveCurrentAttribution();
  const orderId = createTemporaryOrderId();
  const intent: PurchaseIntent = {
    ...input,
    orderId,
    attribution,
    createdAt: new Date().toISOString(),
    currentUrl: getCurrentUrl(),
  };

  storePurchaseIntent(intent);

  void trackEvent('InitiateCheckout', {
    content_name: input.productName,
    content_category: 'sales_page',
    content_type: 'product',
    product_id: input.productId,
    offer_id: input.offerId,
    order_id: orderId,
    value: input.value,
    currency: input.currency,
    source: input.source,
    cta_label: input.ctaLabel,
    attribution,
  }).catch(() => undefined);

  sendIntentToWebhook(intent, DNA.noLeEscribas.purchase.intentWebhookUrl);

  const message = [
    `Hola, quiero recibir mi QR para ${input.productName}.`,
    '',
    `Código de pedido: ${orderId}`,
    `Monto: ${DNA.noLeEscribas.offer.priceLabel}`,
  ].join('\n');
  const whatsappUrl = buildWhatsappUrl(DNA.noLeEscribas.purchase.whatsappUrl, message);

  if (!whatsappUrl || typeof window === 'undefined') {
    return {
      status: 'not_configured',
      orderId,
      message: 'WhatsApp temporal no está configurado.',
    };
  }

  try {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  } catch {
    return {
      status: 'not_configured',
      orderId,
      message: 'No se pudo abrir WhatsApp de forma segura.',
    };
  }

  return {
    status: 'opened',
    orderId,
  };
}
