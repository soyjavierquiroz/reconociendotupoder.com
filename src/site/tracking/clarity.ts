const CLARITY_SCRIPT_ID = 'microsoft-clarity-script';
const CLARITY_PROJECT_ID_PATTERN = /^[A-Za-z0-9]{5,}$/;

type ClarityQueueEntry = IArguments;

interface ClarityFunction {
  (...args: unknown[]): void;
  q?: ClarityQueueEntry[];
}

declare global {
  interface Window {
    clarity?: ClarityFunction;
  }
}

export function initMicrosoftClarity(projectId?: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const normalizedProjectId = projectId?.trim();

  if (!normalizedProjectId || !CLARITY_PROJECT_ID_PATTERN.test(normalizedProjectId)) {
    return;
  }

  if (!window.clarity) {
    window.clarity = function clarity() {
      // Clarity's loader queues the function's Arguments object verbatim.
      // eslint-disable-next-line prefer-rest-params
      (window.clarity!.q = window.clarity!.q || []).push(arguments);
    };
  }

  if (document.getElementById(CLARITY_SCRIPT_ID)) {
    return;
  }

  const script = document.createElement('script');
  script.id = CLARITY_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${normalizedProjectId}`;
  document.head.appendChild(script);
}
