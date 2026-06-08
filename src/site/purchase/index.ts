import { DNA } from '../current';
import { startTemporaryWhatsappQrIntent } from './temporaryWhatsappQr';
import type { StartPurchaseIntentInput, StartPurchaseIntentResult } from './types';

export function startPurchaseIntent(input: StartPurchaseIntentInput): StartPurchaseIntentResult {
  if (DNA.noLeEscribas.purchase.flow === 'temporary_whatsapp_qr') {
    return startTemporaryWhatsappQrIntent(input);
  }

  return {
    status: 'unsupported_flow',
    orderId: null,
    message: `Purchase flow "${DNA.noLeEscribas.purchase.flow}" no está implementado.`,
  };
}

export type {
  PurchaseFlow,
  PurchaseIntent,
  StartPurchaseIntentInput,
  StartPurchaseIntentResult,
} from './types';
