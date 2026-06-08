import type { PurchaseIntent } from './types';

export const PURCHASE_INTENT_STORAGE_KEY = 'rtp.purchase_intents';
const MAX_STORED_INTENTS = 20;

function appendIntent(storage: Storage, intent: PurchaseIntent): void {
  try {
    const storedValue = storage.getItem(PURCHASE_INTENT_STORAGE_KEY);
    const parsedValue: unknown = storedValue ? JSON.parse(storedValue) : [];
    const intents = Array.isArray(parsedValue) ? parsedValue : [];
    storage.setItem(
      PURCHASE_INTENT_STORAGE_KEY,
      JSON.stringify([...intents, intent].slice(-MAX_STORED_INTENTS)),
    );
  } catch {
    // Storage can be unavailable in private browsing or blocked contexts.
  }
}

export function storePurchaseIntent(intent: PurchaseIntent): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    appendIntent(window.localStorage, intent);
  } catch {
    // Accessing the storage object itself can throw in restricted contexts.
  }

  try {
    appendIntent(window.sessionStorage, intent);
  } catch {
    // Accessing the storage object itself can throw in restricted contexts.
  }
}
