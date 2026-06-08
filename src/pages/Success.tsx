import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../core/services/analytics';
import funnelConfig from '../core/config/funnel.config';
import { resolveCurrentAttribution, type ResolvedAttribution, type TrafficChannel } from '../core/attribution';
import { DNA } from '../site/current';
import { consumeCaptureCompleteRegistrationMarker } from '../site/tracking/registration';

function trackCompleteRegistrationOnce(channel: TrafficChannel, attribution: ResolvedAttribution) {
  const trackingKey = `${DNA.siteId}.${channel}.success.complete-registration`;

  try {
    if (window.sessionStorage.getItem(trackingKey) === '1') {
      return;
    }

    window.sessionStorage.setItem(trackingKey, '1');
  } catch {
    // If storage is unavailable, still allow the analytics helper to handle the event.
  }

  void analytics.trackEvent('CompleteRegistration', {
    source: 'SuccessPage',
    funnel_type: DNA.funnelType,
    site_id: DNA.siteId,
    traffic_channel: channel,
    attribution,
  });
}

export function Success() {
  const location = useLocation();
  const attribution = useMemo(() => resolveCurrentAttribution(location), [location]);
  const trafficChannel = attribution.channel;
  const channelConfig = funnelConfig.trafficChannels[trafficChannel];
  const successConfig = channelConfig.success;
  const redirectSeconds = Math.max(successConfig.redirectSeconds, 0);
  const successAction = successConfig.action;
  const hasFinalActionUrl = successAction.type !== 'none' && successAction.url.length > 0;
  const [secondsRemaining, setSecondsRemaining] = useState(redirectSeconds);
  const progressPercent =
    redirectSeconds > 0 ? ((redirectSeconds - secondsRemaining) / redirectSeconds) * 100 : 100;

  useEffect(() => {
    if (
      attribution.shouldTrackAds &&
      consumeCaptureCompleteRegistrationMarker(trafficChannel)
    ) {
      trackCompleteRegistrationOnce(trafficChannel, attribution);
    }
  }, [attribution, attribution.shouldTrackAds, trafficChannel]);

  useEffect(() => {
    setSecondsRemaining(redirectSeconds);
  }, [redirectSeconds, trafficChannel]);

  useEffect(() => {
    if (!hasFinalActionUrl) {
      if (successAction.type !== 'none') {
        console.warn(
          `[Success] Final action URL is not configured for action type "${successAction.type}". Redirect disabled.`,
        );
      }
      return;
    }

    const redirectTimer = window.setTimeout(() => {
      window.location.assign(successAction.url);
    }, redirectSeconds * 1000);

    const countdownTimer = window.setInterval(() => {
      setSecondsRemaining((currentSeconds) => Math.max(currentSeconds - 1, 0));
    }, 1000);

    return () => {
      window.clearTimeout(redirectTimer);
      window.clearInterval(countdownTimer);
    };
  }, [hasFinalActionUrl, redirectSeconds, successAction.type, successAction.url]);

  return (
    <div className="theme-expert theme-expert-event min-h-screen bg-event-navy text-text-inverse">
      <main className="flex min-h-screen items-center px-4 py-6 sm:px-6 sm:py-10">
        <section className="mx-auto flex w-full max-w-[620px] flex-col items-center text-center">
          <div className="mb-4 h-12 w-12 rounded-full border border-event-sky/35 bg-event-sky/12 p-2 shadow-[0_14px_36px_rgb(var(--color-event-sky)/0.14)] sm:mb-7 sm:h-16 sm:w-16 sm:p-3 sm:shadow-[0_18px_50px_rgb(var(--color-event-sky)/0.16)]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-event-coral text-xl font-black text-text-inverse sm:text-2xl">
              1
            </div>
          </div>

          <p className="expert-event-kicker text-xs font-bold uppercase text-event-sky">
            {DNA.copy.successPage.eyebrow}
          </p>
          <h1 className="expert-headline mt-2 text-[2rem] leading-[1.02] text-text-inverse sm:mt-4 sm:text-[4rem]">
            {DNA.copy.successPage.title}
          </h1>
          <p className="expert-body mx-auto mt-3 max-w-[540px] text-[0.95rem] leading-6 text-white/82 sm:mt-5 sm:text-lg sm:leading-8">
            {DNA.copy.successPage.description}
          </p>

          <div className="mt-6 w-full rounded-2xl border border-white/12 bg-white/[0.07] p-4 shadow-[0_20px_54px_rgb(0_0_0/0.2)] sm:mt-9 sm:p-7 sm:shadow-[0_24px_70px_rgb(0_0_0/0.22)]">
            {hasFinalActionUrl ? (
              <>
                <p className="expert-body text-sm font-semibold text-white/78">
                  {successConfig.countdownLead}
                </p>
                <div className="mt-2 text-[3.2rem] font-black leading-none text-event-sky sm:mt-3 sm:text-[5rem]">
                  {secondsRemaining}
                </div>

                <div
                  className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/14 sm:mt-5 sm:h-3"
                  role="progressbar"
                  aria-label={successConfig.progressAriaLabel}
                  aria-valuemin={0}
                  aria-valuemax={redirectSeconds}
                  aria-valuenow={redirectSeconds - secondsRemaining}
                >
                  <div
                    className="h-full rounded-full bg-event-coral transition-[width] duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <a
                  href={successAction.url}
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#25D366] px-5 text-sm font-black text-[#062714] shadow-[0_14px_30px_rgb(37_211_102/0.22)] transition hover:bg-[#20bd5a] focus:outline-none focus:ring-4 focus:ring-[#25D366]/35 sm:mt-7 sm:min-h-14 sm:w-auto sm:min-w-[260px] sm:px-6 sm:text-base sm:shadow-[0_16px_36px_rgb(37_211_102/0.24)]"
                >
                  {successConfig.actionLabel}
                </a>
              </>
            ) : (
              <>
                <p className="expert-body text-base font-semibold leading-7 text-white/86">
                  {successConfig.missingActionUrlMessage}
                </p>
                <button
                  type="button"
                  disabled
                  className="mt-5 inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-white/18 px-5 text-sm font-black text-white/55 sm:mt-6 sm:min-h-14 sm:w-auto sm:min-w-[260px] sm:px-6 sm:text-base"
                >
                  {successConfig.actionLabel}
                </button>
              </>
            )}
          </div>

          <p className="expert-body mt-4 text-xs font-semibold uppercase text-white/48 sm:mt-6">
            {DNA.copy.productName}
          </p>
        </section>
      </main>
    </div>
  );
}

export default Success;
