import type { TrafficChannel } from '../../core/attribution';
import { DNA } from '../current';

const COMPLETE_REGISTRATION_MARKER_KEY = `${DNA.siteId}.capture.complete-registration.pending`;

export function markCaptureCompleteRegistrationPending(channel: TrafficChannel): void {
  try {
    window.sessionStorage.setItem(
      COMPLETE_REGISTRATION_MARKER_KEY,
      JSON.stringify({ channel, createdAt: new Date().toISOString() }),
    );
  } catch {
    // A missing marker safely disables CompleteRegistration on the success page.
  }
}

export function consumeCaptureCompleteRegistrationMarker(channel: TrafficChannel): boolean {
  try {
    const marker = window.sessionStorage.getItem(COMPLETE_REGISTRATION_MARKER_KEY);

    if (!marker) {
      return false;
    }

    window.sessionStorage.removeItem(COMPLETE_REGISTRATION_MARKER_KEY);
    const parsedMarker: unknown = JSON.parse(marker);

    return (
      typeof parsedMarker === 'object' &&
      parsedMarker !== null &&
      'channel' in parsedMarker &&
      parsedMarker.channel === channel
    );
  } catch {
    return false;
  }
}
