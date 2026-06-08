const ORDER_PREFIX = 'RTP-NLE';
const RANDOM_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function formatDate(date: Date): string {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('');
}

function createRandomSuffix(length = 4): string {
  const randomBytes = new Uint8Array(length);

  if (typeof globalThis.crypto !== 'undefined') {
    globalThis.crypto.getRandomValues(randomBytes);
  } else {
    for (let index = 0; index < length; index += 1) {
      randomBytes[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(randomBytes, (value) => RANDOM_ALPHABET[value % RANDOM_ALPHABET.length]).join('');
}

export function createTemporaryOrderId(date = new Date()): string {
  return `${ORDER_PREFIX}-${formatDate(date)}-${createRandomSuffix()}`;
}
