import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DNA } from '../../../../site/current';
import funnelConfig from '../../../../core/config/funnel.config';
import { resolveCurrentAttribution, type TrafficChannel } from '../../../../core/attribution';
import analytics, {
  buildAttributionEventFields,
  type AttributionEventFields,
} from '../../../../core/services/analytics';
import { useVisitor } from '../../../../core/visitor/VisitorContext';
import { buildVisitorPayload, type VisitorPayload } from '../../../../core/visitor/visitorPayload';
import { markCaptureCompleteRegistrationPending } from '../../../../site/tracking/registration';

interface FormErrors {
  firstName?: string;
  email?: string;
}

interface EventLeadPayload extends VisitorPayload, AttributionEventFields {
  first_name: string;
  name: string;
  email: string;
  list: string;
  traffic_channel: TrafficChannel;
  capture_list_slug: string;
  confirmation_path: string;
  source: string;
  funnel_type: string;
  theme: string;
  landing_slug: string;
  page_url: string;
  submitted_at: string;
  event_name: string;
  meta: {
    ip?: string;
    ciudad?: string;
    pais?: string;
    zona_horaria?: string;
    moneda?: string;
  };
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ExpertEventRegistrationForm() {
  const location = useLocation();
  const attribution = useMemo(() => resolveCurrentAttribution(location), [location]);
  const trafficChannel = attribution.channel;
  const channelConfig = funnelConfig.trafficChannels[trafficChannel];
  const content = funnelConfig.content.event;
  const capture = funnelConfig.forms.capture;
  const formCopy = DNA.copy.captureForm;
  const { visitorData } = useVisitor();

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = !isSubmitting;

  const handleInputChange = (
    setter: (value: string) => void,
    field: keyof FormErrors,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setter(event.target.value);
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedFirstName = firstName.trim();
    const trimmedEmail = email.trim();
    const nextErrors: FormErrors = {};

    if (!trimmedFirstName) {
      nextErrors.firstName = formCopy.requiredError;
    }

    if (!trimmedEmail) {
      nextErrors.email = formCopy.emailRequiredError;
    } else if (!isValidEmail(trimmedEmail)) {
      nextErrors.email = formCopy.invalidEmailError;
    }

    setErrors(nextErrors);
    setSubmitError('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setFirstName(trimmedFirstName);
    setEmail(trimmedEmail);

    if (!capture.webhookUrl) {
      console.error('[ExpertEventRegistrationForm] missing VITE_CAPTURE_WEBHOOK_URL configuration');
      setSubmitError(formCopy.submitError);
      return;
    }

    const captureListSlug = channelConfig.captureListSlug.trim();

    setIsSubmitting(true);

    const submittedAt = new Date().toISOString();
    const pageUrl = window.location.href;
    const visitorPayload = buildVisitorPayload(visitorData);
    const attributionFields = buildAttributionEventFields(attribution);
    const payload: EventLeadPayload = {
      first_name: trimmedFirstName,
      name: trimmedFirstName,
      email: trimmedEmail,
      list: captureListSlug,
      capture_list_slug: captureListSlug,
      confirmation_path: channelConfig.confirmationPath,
      source: capture.tracking.source,
      funnel_type: funnelConfig.attribution.funnelType,
      theme: funnelConfig.attribution.theme,
      landing_slug: funnelConfig.attribution.landingSlug,
      page_url: pageUrl,
      submitted_at: submittedAt,
      event_name: capture.tracking.payloadEventName,
      ...attributionFields,
      ...visitorPayload,
      meta: {
        ip: visitorPayload.visitor_ip,
        ciudad: visitorPayload.visitor_city,
        pais: visitorPayload.visitor_country,
        zona_horaria: visitorPayload.visitor_timezone,
        moneda: visitorPayload.visitor_currency,
      },
    };

    try {
      const response = await fetch(capture.webhookUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with ${response.status}`);
      }

      if (attribution.shouldTrackAds) {
        try {
          await analytics.trackEvent(capture.tracking.eventName, {
            lead: {
              nombre: payload.first_name,
              email: payload.email,
            },
            meta: payload.meta,
            list: payload.list,
            traffic_channel: payload.traffic_channel,
            capture_list_slug: payload.capture_list_slug,
            confirmation_path: payload.confirmation_path,
            source: payload.source,
            page_url: payload.page_url,
            submitted_at: payload.submitted_at,
            event_name: payload.event_name,
            form_id: capture.tracking.formId,
            content_name: funnelConfig.brandName,
            status: capture.tracking.status,
            attribution,
          });
        } catch (trackingError) {
          console.warn('[ExpertEventRegistrationForm] lead tracking failed', trackingError);
        }
      }

      markCaptureCompleteRegistrationPending(trafficChannel);
      window.location.assign(channelConfig.confirmationPath);
    } catch (error) {
      console.error('[ExpertEventRegistrationForm] webhook submission failed', error);
      setSubmitError(formCopy.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-event-navy/10 bg-event-surface p-4 shadow-[0_0_0_1px_rgb(var(--color-event-surface)/0.5),0_22px_62px_rgb(var(--color-event-ink)/0.18),0_0_40px_rgb(var(--color-event-coral)/0.12)] sm:p-6">
      <form className="space-y-3.5" onSubmit={handleSubmit} aria-label={content.hero.formTitle} noValidate>
        <div>
          <label htmlFor="event-first-name" className="sr-only">
            {formCopy.firstNameLabel}
          </label>
          <input
            id="event-first-name"
            type="text"
            value={firstName}
            onChange={(nextEvent) => handleInputChange(setFirstName, 'firstName', nextEvent)}
            className={[
              'expert-input h-[48px] w-full rounded-xl border bg-event-soft px-4 text-base text-event-ink sm:h-[52px]',
              'placeholder:text-event-muted focus:outline-none focus:ring-2',
              errors.firstName
                ? 'border-error focus:border-error focus:ring-error/30'
                : 'border-event-navy/20 focus:border-event-coral focus:ring-event-coral/25',
            ].join(' ')}
            placeholder={formCopy.firstNamePlaceholder}
          />
          {errors.firstName ? <p className="mt-2 text-xs text-error">{errors.firstName}</p> : null}
        </div>

        <div>
          <label htmlFor="event-email" className="sr-only">
            {formCopy.emailLabel}
          </label>
          <input
            id="event-email"
            type="email"
            value={email}
            onChange={(nextEvent) => handleInputChange(setEmail, 'email', nextEvent)}
            className={[
              'expert-input h-[48px] w-full rounded-xl border bg-event-soft px-4 text-base text-event-ink sm:h-[52px]',
              'placeholder:text-event-muted focus:outline-none focus:ring-2',
              errors.email
                ? 'border-error focus:border-error focus:ring-error/30'
                : 'border-event-navy/20 focus:border-event-coral focus:ring-event-coral/25',
            ].join(' ')}
            placeholder={formCopy.emailPlaceholder}
          />
          {errors.email ? <p className="mt-2 text-xs text-error">{errors.email}</p> : null}
        </div>

        <input type="hidden" name="visitor_ip" value={visitorData?.ip || ''} />
        <input type="hidden" name="visitor_city" value={visitorData?.city || ''} />
        <input type="hidden" name="visitor_country_name" value={visitorData?.country_name || ''} />
        <input type="hidden" name="visitor_timezone" value={visitorData?.timezone || ''} />
        <input type="hidden" name="visitor_currency" value={visitorData?.currency || ''} />

        {submitError ? (
          <div className="rounded-xl border border-error/40 bg-error/10 p-3 text-sm text-error">
            {submitError}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className={[
            'expert-headline cta-pick-me min-h-[50px] w-full rounded-xl bg-cta px-5 py-3.5 text-center text-[0.82rem] sm:min-h-[54px] sm:px-6 sm:py-4 sm:text-sm',
            'font-black uppercase tracking-wide text-[rgb(var(--color-cta-text))]',
            'shadow-[0_0_0_1px_rgb(var(--color-event-coral)/0.28),0_16px_42px_rgb(var(--color-event-coral)/0.42),0_0_34px_rgb(var(--color-event-coral)/0.2)]',
            'transition duration-300 hover:-translate-y-1 hover:bg-cta-hover',
            'hover:shadow-[0_0_0_1px_rgb(var(--color-event-coral)/0.34),0_22px_54px_rgb(var(--color-event-coral)/0.48),0_0_46px_rgb(var(--color-event-coral)/0.28)]',
            'focus:outline-none focus:ring-2 focus:ring-event-coral/35 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
          ].join(' ')}
        >
          {isSubmitting ? content.hero.submittingLabel : content.finalCta.ctaLabel}
        </button>
      </form>
    </div>
  );
}

export default ExpertEventRegistrationForm;
