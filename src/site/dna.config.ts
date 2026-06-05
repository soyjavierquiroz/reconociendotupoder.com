export type DnaTheme = 'expert' | 'panda';
export type DnaFunnelType = 'vsl' | 'event' | 'tripwire';
export type DnaSuccessActionType = 'whatsapp' | 'url' | 'checkout' | 'zoom' | 'email' | 'none';

const runtimeEnv = ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {});

function readEnv(name: string, fallback = '') {
  const value = runtimeEnv[name]?.trim();
  return value && value.length > 0 ? value : fallback;
}

export interface DnaConfig {
  theme: DnaTheme;
  funnelType: DnaFunnelType;
  landingSlug: string;
  productName: string;
  domain: string;
  siteId: string;
  fonts: {
    sans: string;
    body: string;
  };
  checkoutUrl: string;
  checkout: {
    providerName: string;
    productIds: {
      main: string;
      bump: string;
      continuity: string;
      vip: string;
    };
    successPath: string;
  };
  offer: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    productName: string;
    price: string;
    regularPrice: string;
    currency: string;
    checkoutUrl: string;
    ctaLabel: string;
    ctaPendingLabel: string;
    regularPriceLabel: string;
    checkoutPendingMessage: string;
    heroImage: string;
    heroImageAlt: string;
    bullets: string[];
    announcement: {
      text: string;
    };
    video: {
      eyebrow: string;
      title: string;
      subtitle: string;
      provider: 'youtube' | 'bunnynet' | 'vimeo' | 'wistia' | 'html5';
      videoId: string;
      url: string;
      posterImage: string;
      progressBarColor: string;
      soundPrompt: string;
      placeholderText: string;
    };
    offerCard: {
      eyebrow: string;
      title: string;
      summary: string;
      includes: string[];
      footerNote: string;
    };
    offerBoxes: Array<{
      eyebrow: string;
      title: string;
      summary: string;
      includes: string[];
      footerNote: string;
      badge: string;
    }>;
    credibility: {
      text: string;
      items: Array<{
        value: string;
        label: string;
      }>;
    };
    beliefShift: {
      eyebrow: string;
      title: string;
      paragraphs: string[];
      highlights: string[];
    };
    opportunity: {
      eyebrow: string;
      title: string;
      intro: string;
      paragraphs: string[];
      bullets: string[];
      callout: string;
    };
    identityShift: {
      eyebrow: string;
      title: string;
      subtitle: string;
      oldIdentityTitle: string;
      newIdentityTitle: string;
      oldItems: string[];
      newItems: string[];
      closing: string;
    };
    story: {
      eyebrow: string;
      title: string;
      paragraphs: string[];
      highlight: string;
      image: string;
      imageAlt: string;
    };
    proofGrid: {
      eyebrow: string;
      title: string;
      subtitle: string;
      items: Array<{
        eyebrow: string;
        title: string;
        name: string;
        detail: string;
        quote: string;
        image: string;
        imageAlt: string;
      }>;
    };
    proofWallLarge: {
      eyebrow: string;
      title: string;
      subtitle: string;
      featured: {
        eyebrow: string;
        title: string;
        quote: string;
        name: string;
        detail: string;
        image: string;
        imageAlt: string;
      };
      items: Array<{
        eyebrow: string;
        title: string;
        quote: string;
        name: string;
        detail: string;
        image: string;
        imageAlt: string;
      }>;
    };
    repeatedCtas: Array<{
      eyebrow: string;
      title: string;
      subtitle: string;
      priceLine: string;
    }>;
    repeatedOffers: Array<{
      eyebrow: string;
      title: string;
      subtitle: string;
      priceLine: string;
      offerBoxIndex: number;
    }>;
    valueStack: {
      eyebrow: string;
      title: string;
      subtitle: string;
      totalValueLabel: string;
      totalValue: string;
      todayPriceLabel: string;
      includedLabel: string;
      stackSections: Array<{
        eyebrow: string;
        title: string;
        description: string;
        items: string[];
      }>;
      items: Array<{
        title: string;
        description: string;
        value: string;
      }>;
    };
    bonuses: {
      eyebrow: string;
      title: string;
      subtitle: string;
      valueLabel: string;
      items: Array<{
        title: string;
        description: string;
        value?: string;
      }>;
    };
    guarantee: {
      eyebrow: string;
      title: string;
      description: string;
      bullets: string[];
    };
    scarcity: {
      eyebrow: string;
      title: string;
      description: string;
    };
    fascinations: {
      eyebrow: string;
      title: string;
      subtitle: string;
      items: string[];
      closing: string;
    };
    faq: {
      eyebrow: string;
      title: string;
      items: Array<{
        question: string;
        answer: string;
      }>;
    };
    finalCta: {
      eyebrow: string;
      title: string;
      subtitle: string;
      priceLine: string;
    };
  };
  vslVideoId: string;
  videos: {
    vsl: {
      provider: 'youtube' | 'bunnynet' | 'vimeo' | 'wistia' | 'html5';
      videoId: string;
      revealAtSeconds: number;
      progressBarColor: string;
      posterImage: string;
      ctaDisplayAtSeconds: number;
    };
  };
  tracking: {
    siteId: string;
    metaPixelId: string;
    tiktokPixelId: string;
    capiWebhookUrl: string;
    visitorApiUrl: string;
    metaPixelScriptUrl: string;
    tiktokPixelScriptBaseUrl: string;
  };
  seo: {
    title: string;
    description: string;
    socialImage: string;
  };
  colors: {
    primary: string;
    accent: string;
    highlight: string;
    success: string;
    warning: string;
    error: string;
  };
  surface: {
    page: string;
    panel: string;
    muted: string;
    bump: string;
  };
  text: {
    main: string;
    muted: string;
    subtle: string;
    inverse: string;
    onPrimary: string;
    onAccent: string;
  };
  cta: {
    bg: string;
    text: string;
    hoverBg: string;
  };
  prices: {
    main: string;
    bump: string;
    totalValue: string;
    regular: string;
    regularPrice: string;
    vip: string;
  };
  assets: {
    productImage: string;
    salesLetterImage: string;
    bonusImage: string;
    bundleWideImage: string;
    socialImage: string;
    event: {
      logo: string;
      hero: string;
      agenda1: string;
      agenda2: string;
      agenda3: string;
      pain: string;
      authority: string;
      authorityCarousel: readonly string[];
      finalCta: string;
      heroImage: string;
      agendaImages: string[];
      painImage: string;
      authorityImage: string;
      finalCtaImage: string;
      insecureDriverImage: string;
      confidentDriverImage: string;
      parkedCarImage: string;
      motherWithChildrenImage: string;
      expertTeachingImage: string;
    };
  };
  forms: {
    captureWebhookUrl: string;
    captureListSlug: string;
    successRedirectType: 'url' | 'whatsapp';
    successRedirectUrl: string;
    whatsappGroupUrl: string;
    whatsappRedirectBaseUrl: string;
    captureFields: {
      firstName: boolean;
      lastName: boolean;
      email: boolean;
      whatsapp: boolean;
    };
    captureTracking: {
      eventName: string;
      formId: string;
      status: string;
      source: string;
      payloadEventName: string;
    };
  };
  success: {
    action: {
      type: DnaSuccessActionType;
      url: string;
    };
    redirectSeconds: number;
  };
  copy: {
    productName: string;
    headline: string;
    headlineHighlight: string;
    subheadline: string;
    ctaText: string;
    checkoutCtaText: string;
    orderBumpTitle: string;
    salesLetter: {
      title: string;
      part1: string[];
      highlight: string;
      part2: string[];
      image: string;
      ctaText: string;
    };
    offerStackTitle: string;
    benefits: string[];
    specialOfferTitle: string;
    specialOfferSubtitle: string;
    specialOfferGuarantee: string;
    specialOfferImage: string;
    presentationPreTitle: string;
    presentationTitle: string;
    confidenceBooster: {
      headline: string;
      paragraphs: string[];
      bullets: string[];
      includedLabel: string;
    };
    sewingBonus: {
      eyebrow: string;
      title: string;
      image: string;
      description: string;
    };
    painPoints: {
      headline: string;
      subtitle: string;
      bullets: string[];
      transitionText: string;
    };
    modules: Array<{
      title: string;
      value: string;
      description: string;
      image: string;
    }>;
    fastActionBonus: {
      timeLimit: string;
      title: string;
      subtitle: string;
    };
    offerSummary: {
      title: string;
      countdownLabel: string;
      opportunityExpiresLabel: string;
      bundleImageAlt: string;
      totalValueLabel: string;
      todayPriceLabel: string;
      regularPriceLabel: string;
      includedBadgeLabel: string;
      realValueLabel: string;
      ctaLabel: string;
      ctaSubLabel: string;
      offerAvailableLabel: string;
      specialPriceLabel: string;
      todayOnlyLabel: string;
      originalPriceLabel: string;
      valuedAtLabel: string;
    };
    certaintyItems: Array<{
      id: string;
      label: string;
    }>;
    orderForm: {
      eyebrow: string;
      description: string;
    };
    successPage: {
      eyebrow: string;
      title: string;
      description: string;
      backLabel: string;
      whatsappLabel: string;
      countdownLead: string;
      missingWhatsappUrlMessage: string;
      progressAriaLabel: string;
    };
    captureForm: {
      eyebrow: string;
      headlineFallback: string;
      headlineWithLocation: string;
      description: string;
      firstNameLabel: string;
      firstNamePlaceholder: string;
      lastNameLabel: string;
      lastNamePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      whatsappLabel: string;
      whatsappPlaceholder: string;
      requiredError: string;
      emailRequiredError: string;
      invalidEmailError: string;
      whatsappRequiredError: string;
      invalidWhatsappError: string;
      submitError: string;
      submitLabel: string;
      submittingLabel: string;
    };
    event: {
      registrationAnchorId: string;
      startsAtIso: string;
      footer: {
        logoAlt: string;
      };
      hero: {
        eyebrow: string;
        eventName: string;
        dateLabel: string;
        headline: string;
        subheadline: string;
        quickBenefits: string[];
        imageAlt: string;
        formTitle: string;
        primaryCtaLabel: string;
        secondaryCtaLabel: string;
        submittingLabel: string;
      };
      socialProof: string;
      countdown: {
        label: string;
        expiredLabel: string;
        units: {
          days: string;
          hours: string;
          minutes: string;
          seconds: string;
        };
      };
      foundation: {
        sectionEyebrow: string;
        sectionTitle: string;
        sectionText: string;
        cardTitle: string;
        cardText: string;
      };
      promise: {
        title: string;
        image: string;
        imageAlt: string;
        bullets: string[];
        ctaLabel: string;
      };
      transformation: {
        eyebrow: string;
        title: string;
        beforeTitle: string;
        afterTitle: string;
        beforeItems: string[];
        afterItems: string[];
      };
      agenda: {
        title: string;
        items: Array<{
          label: string;
          title: string;
          description: string;
          image: string;
          imageAlt: string;
        }>;
        ctaLabel: string;
      };
      whyFearPersists: {
        eyebrow: string;
        title: string;
        paragraphs: string[];
        highlights: string[];
      };
      pain: {
        title: string;
        imageAlt: string;
        intro: string;
        bullets: string[];
        phrases: string[];
        ctaLabel: string;
      };
      testimonials: {
        eyebrow: string;
        title: string;
        subtitle: string;
        items: Array<{
          name: string;
          location?: string;
          role?: string;
          quote: string;
          image?: string;
          result?: string;
        }>;
      };
      authority: {
        title: string;
        imageAlt: string;
        intro: string;
        bio: string;
        paragraphs: string[];
        badges: string[];
        quote: string;
        ctaLabel: string;
      };
      finalCta: {
        eyebrow: string;
        headline: string;
        imageAlt: string;
        subheadline: string;
        bullets: string[];
        text: string;
        ctaLabel: string;
      };
    };
    pricingCard: {
      eyebrow: string;
      title: string;
      baseValueLabel: string;
      basePriceLabel: string;
      subtotalLabel: string;
      localTaxesLabel: string;
      includedTaxesLabel: string;
      checkoutTotalLabel: string;
      equivalentLabel: string;
      internationalPriceLabel: string;
      buyButtonLabel: string;
      unavailableLabel: string;
      securePaymentLabel: string;
      processedByLabel: string;
      immediateAccessLabel: string;
    };
    video: {
      smartPosterEyebrow: string;
      smartPosterTitle: string;
      smartPosterDescription: string;
      smartPosterButtonText: string;
      ctaEyebrow: string;
      ctaHeadline: string;
      ctaButtonText: string;
      soundPrompt: string;
      placeholderText: string;
    };
    testimonials: {
      headline: string;
      subtitle: string;
      items: Array<{
        name: string;
        quote: string;
        image: string;
      }>;
    };
    faq: {
      title: string;
      items: Array<{
        question: string;
        answer: string;
      }>;
    };
  };
}

function parsePrice(value: string) {
  const normalizedValue = value.replace(/,/g, '').trim();
  const parsedValue = Number(normalizedValue);

  if (!Number.isFinite(parsedValue)) {
    throw new Error(`[DNA] Invalid price value: "${value}"`);
  }

  return parsedValue;
}

function hexToRgbTriplet(hex: string) {
  const normalizedHex = hex.replace('#', '').trim();

  if (!/^[\da-f]{6}$/i.test(normalizedHex)) {
    throw new Error(`[DNA] Invalid hex color value: "${hex}"`);
  }

  const red = Number.parseInt(normalizedHex.slice(0, 2), 16);
  const green = Number.parseInt(normalizedHex.slice(2, 4), 16);
  const blue = Number.parseInt(normalizedHex.slice(4, 6), 16);

  return `${red} ${green} ${blue}`;
}

function normalizeColorValue(value: string) {
  const normalizedValue = value.trim();

  if (normalizedValue.startsWith('#')) {
    return hexToRgbTriplet(normalizedValue);
  }

  if (/^\d{1,3}\s+\d{1,3}\s+\d{1,3}(?:\s*\/\s*(?:\d{1,3}%|0?\.\d+|1(?:\.0+)?))?$/.test(normalizedValue)) {
    return normalizedValue.replace(/\s+/g, ' ');
  }

  throw new Error(`[DNA] Invalid color value: "${value}"`);
}

function toRgbTriplet(value: string) {
  const normalizedValue = normalizeColorValue(value);
  const [triplet] = normalizedValue.split('/');
  return triplet.trim();
}

const productName = 'Reconociendo Tu Poder';
const eventName = 'Reconociendo Tu Poder';
const eventCaptureSource = 'rtp-event';
const domain = readEnv('VITE_DOMAIN', 'reconociendotupoder.com');
const siteId = readEnv('VITE_SITE_ID', 'RECONOCIENDO_TU_PODER');
const checkoutUrl = readEnv('VITE_CHECKOUT_URL', 'https://example.com/rtp-checkout-placeholder');
const offerCheckoutUrl = readEnv('VITE_OFFER_CHECKOUT_URL', checkoutUrl);
const vslVideoId = readEnv('VITE_VSL_VIDEO_ID', 'REPLACE_WITH_VSL_VIDEO_ID');
const offerVideoUrl = readEnv('VITE_OFFER_VIDEO_URL', 'https://example.com/rtp-offer-video-placeholder.m3u8');
const successActionType = readEnv('VITE_SUCCESS_ACTION_TYPE', 'url') as DnaSuccessActionType;
const placeholderAsset = '/assets/funnel-placeholder.svg';

const eventAssets = {
  logo: placeholderAsset,
  hero: placeholderAsset,
  agenda1: placeholderAsset,
  agenda2: placeholderAsset,
  agenda3: placeholderAsset,
  pain: placeholderAsset,
  authority: placeholderAsset,
  finalCta: placeholderAsset,
  authorityCarousel: [placeholderAsset, placeholderAsset, placeholderAsset],
} as const;

export const DNA = {
  theme: 'expert',
  funnelType: 'event',
  landingSlug: readEnv('VITE_LANDING_SLUG', 'reconociendo-tu-poder'),
  productName,
  domain,
  siteId,
  fonts: {
    sans: 'Montserrat',
    body: 'Open Sans',
  },
  checkoutUrl,
  checkout: {
    providerName: readEnv('VITE_CHECKOUT_PROVIDER_NAME', 'Checkout'),
    productIds: {
      main: 'RTP_MAIN',
      bump: 'RTP_BUMP',
      continuity: 'RTP_CONTINUITY',
      vip: 'RTP_VIP',
    },
    successPath: '/confirmacion',
  },
  offer: {
    eyebrow: 'Registro gratuito',
    headline: 'Reconecta con tu poder personal',
    subheadline: 'Un espacio para recuperar claridad, calma y direccion.',
    productName: eventName,
    price: '$27',
    regularPrice: '$97',
    currency: 'USD',
    checkoutUrl: offerCheckoutUrl,
    ctaLabel: 'Reserva tu lugar',
    ctaPendingLabel: 'CONFIGURACION PENDIENTE',
    regularPriceLabel: 'Precio regular',
    checkoutPendingMessage: 'Checkout pendiente de configurar.',
    heroImage: eventAssets.hero,
    heroImageAlt: 'Placeholder visual de Reconociendo Tu Poder',
    bullets: [
      'Un primer paso simple para reconectar contigo',
      'Claridad para ordenar lo que hoy necesita atencion',
      'Placeholders seguros hasta configurar la oferta final',
    ],
    announcement: {
      text: 'Registro gratuito con placeholders seguros hasta configurar el siguiente paso',
    },
    video: {
      eyebrow: 'Presentacion pendiente',
      title: 'Reconociendo Tu Poder tendra aqui su presentacion principal',
      subtitle: 'Este bloque conserva placeholders seguros hasta definir el video y la oferta final.',
      provider: 'bunnynet',
      videoId: offerVideoUrl,
      url: offerVideoUrl,
      posterImage: eventAssets.hero,
      progressBarColor: '#e88c8c',
      soundPrompt: 'Activa el sonido para ver la presentacion',
      placeholderText: 'Video de la oferta pendiente de configurar',
    },
    offerCard: {
      eyebrow: 'Siguiente paso',
      title: 'Reconociendo Tu Poder',
      summary:
        'Un placeholder de marca para validar el render mientras se define la oferta final.',
      includes: [
        'Registro gratuito placeholder',
        'Recurso de apoyo configurable',
        'Materiales pendientes de definir',
        'Pago seguro desde el checkout configurado',
      ],
      footerNote: 'Sin formulario en esta pagina. El boton te lleva directo al checkout cuando este configurado.',
    },
    offerBoxes: [
      {
        eyebrow: 'Registro principal',
        title: 'Reconociendo Tu Poder',
        summary: 'El bloque principal queda como placeholder hasta definir entregables y oferta final.',
        includes: [
          'Registro gratuito',
          'Guia configurable',
          'Recursos pendientes de definir',
          'Acceso inmediato al completar checkout',
        ],
        footerNote: 'Sin formulario en esta pagina. El boton te lleva directo al checkout cuando este configurado.',
        badge: 'Oferta principal',
      },
      {
        eyebrow: 'Resumen',
        title: 'Tu proceso empieza con una decision simple',
        summary: 'Un bloque temporal para validar estructura, estado del checkout y siguiente paso.',
        includes: ['Primer paso configurable', 'Recursos descargables pendientes', 'Plan placeholder', 'Mapa de seguimiento configurable'],
        footerNote: 'El precio y el checkout se controlan desde configuracion.',
        badge: 'Incluye bonos',
      },
      {
        eyebrow: 'Final decision',
        title: 'Reserva tu lugar',
        summary: 'Recordatorio temporal para mantener clara la accion mientras se prepara el contenido real.',
        includes: ['Acceso al registro', 'Bonos configurables', 'Herramientas pendientes', 'Pago seguro al checkout configurado'],
        footerNote: 'Si falta la URL de checkout, el boton aparecera deshabilitado.',
        badge: 'Ultimo recordatorio',
      },
    ],
    credibility: {
      text: 'Una franja placeholder para prueba real cuando exista.',
      items: [
        { value: 'RTP', label: 'identidad minima' },
        { value: 'Seguro', label: 'placeholders activos' },
        { value: 'Dry-run', label: 'capture sin webhook real' },
      ],
    },
    beliefShift: {
      eyebrow: 'Base de marca',
      title: 'Reconociendo Tu Poder debe renderizar sin inventar una oferta final.',
      paragraphs: [
        'Reconociendo Tu Poder abre con una identidad minima y placeholders seguros.',
        'La oferta final, prueba, assets, checkout y capture real se configuraran despues sin tocar componentes compartidos.',
      ],
      highlights: ['La marca ya esta identificada.', 'El contenido final sigue pendiente.'],
    },
    opportunity: {
      eyebrow: 'Siguiente configuracion',
      title: 'Completa Reconociendo Tu Poder desde la superficie del sitio.',
      intro: 'Esta seccion conserva estructura sin crear todavia un funnel psicologico definitivo.',
      paragraphs: [
        'Usa este mismo DNA para incorporar despues la oferta, el evento, el checkout, la prueba y los assets reales.',
        'Mantiene las decisiones del hijo en variables de entorno, configuracion de sitio y assets propios.',
      ],
      bullets: [
        'Agregar media de marca cuando exista.',
        'Configurar checkout y capture real desde env.',
        'Validar precios y product IDs antes de lanzar.',
        'Ejecutar el checklist del hijo antes de publicar.',
      ],
      callout: 'Esta es identidad minima de hijo, no copy final de produccion.',
    },
    identityShift: {
      eyebrow: 'Cambio de estado',
      title: 'De placeholder seguro a oferta real cuando corresponda.',
      subtitle: 'Este bloque existe para validar render sin definir todavia la promesa final.',
      oldIdentityTitle: 'Ahora',
      newIdentityTitle: 'Despues',
      oldItems: [
        'La pagina usa copy placeholder.',
        'Los assets siguen siendo genericos.',
        'Checkout URLs usan placeholders seguros.',
        'Tracking IDs quedan vacios salvo env local.',
      ],
      newItems: [
        'La oferta tendra audiencia y promesa reales.',
        'Media y prueba calzaran con la marca.',
        'Checkout y capture estaran configurados.',
        'Los checks confirmaran que el core sigue intacto.',
      ],
      closing: 'Las superficies del hijo se actualizan sin mover el engine compartido.',
    },
    story: {
      eyebrow: 'Historia placeholder',
      title: 'Reconociendo Tu Poder tendra aqui su narrativa real.',
      paragraphs: [
        'Esta historia temporal mantiene el layout completo y evita promesas no validadas.',
        'El contenido final debe incorporar narrativa, prueba, lenguaje de audiencia y configuracion operativa real.',
        'Por ahora, el sitio solo declara una identidad minima de marca.',
      ],
      highlight: 'La identidad minima permite renderizar sin inventar la historia final.',
      image: eventAssets.agenda3,
      imageAlt: 'Placeholder de historia de Reconociendo Tu Poder',
    },
    proofGrid: {
      eyebrow: 'Prueba configurable',
      title: 'Reemplaza estas tarjetas con prueba real antes de publicar.',
      subtitle: 'El contenido actual es placeholder para no inventar resultados.',
      items: [
        {
          eyebrow: 'Video corto',
          title: 'Resultado placeholder',
          name: 'Persona A',
          detail: 'Audiencia placeholder',
          quote: 'Este placeholder muestra donde podria aparecer una cita breve y verificada.',
          image: eventAssets.agenda1,
          imageAlt: 'Placeholder proof card image',
        },
        {
          eyebrow: 'Screenshot',
          title: 'Mensaje placeholder',
          name: 'Persona B',
          detail: 'Segmento placeholder',
          quote: 'Reemplaza esto con un mensaje real, screenshot o cita verificada.',
          image: eventAssets.agenda2,
          imageAlt: 'Placeholder screenshot proof',
        },
        {
          eyebrow: 'Historia',
          title: 'Historia placeholder',
          name: 'Persona C',
          detail: 'Region placeholder',
          quote: 'Una historia mas larga puede vivir aqui cuando exista prueba real.',
          image: eventAssets.agenda3,
          imageAlt: 'Placeholder story proof',
        },
        {
          eyebrow: 'Resultado practico',
          title: 'Resultado practico placeholder',
          name: 'Persona D',
          detail: 'Caso placeholder',
          quote: 'Usa aqui un resultado especifico cuando exista prueba validada.',
          image: eventAssets.authority,
          imageAlt: 'Placeholder outcome proof',
        },
        {
          eyebrow: 'Mensaje',
          title: 'Mensaje placeholder',
          name: 'Persona E',
          detail: 'Audiencia placeholder',
          quote: 'Un mensaje breve puede volver la oferta mas concreta cuando sea real.',
          image: eventAssets.pain,
          imageAlt: 'Placeholder customer message',
        },
        {
          eyebrow: 'Perspectiva',
          title: 'Cambio de perspectiva placeholder',
          name: 'Persona F',
          detail: 'Canal placeholder',
          quote: 'Reemplaza esta tarjeta con prueba alineada a la promesa real.',
          image: eventAssets.finalCta,
          imageAlt: 'Placeholder perspective proof',
        },
      ],
    },
    proofWallLarge: {
      eyebrow: 'Casos y prueba',
      title: 'La prueba puede ser simple, pero debe ser real antes de lanzar.',
      subtitle: 'Usa este muro para historias, mensajes, resultados practicos o aprendizajes verificados.',
      featured: {
        eyebrow: 'Caso destacado',
        title: 'Resultado destacado placeholder',
        quote: 'Esta cita destacada es placeholder. Reemplazala con la prueba mas fuerte disponible.',
        name: 'Persona destacada',
        detail: 'Configurable placeholder case',
        image: eventAssets.agenda3,
        imageAlt: 'Featured placeholder proof image',
      },
      items: [
        {
          eyebrow: 'Mensaje',
          title: 'Mensaje placeholder',
          quote: 'Una prueba breve puede vivir aqui cuando el sitio tenga inputs reales.',
          name: 'Persona G',
          detail: 'Prueba placeholder',
          image: eventAssets.agenda1,
          imageAlt: 'Placeholder message proof image',
        },
        {
          eyebrow: 'Resultado',
          title: 'Resultado medible placeholder',
          quote: 'Agrega numeros, plazos o contexto antes/despues cuando existan.',
          name: 'Persona H',
          detail: 'Metrica placeholder',
          image: eventAssets.agenda2,
          imageAlt: 'Placeholder metric proof image',
        },
        {
          eyebrow: 'Cambio',
          title: 'Cambio placeholder',
          quote: 'Esto puede convertirse en una historia concreta de la audiencia objetivo.',
          name: 'Persona I',
          detail: 'Historia placeholder',
          image: eventAssets.finalCta,
          imageAlt: 'Placeholder behavior proof image',
        },
        {
          eyebrow: 'Proceso',
          title: 'Proceso placeholder',
          quote: 'Describe aqui un cambio de proceso, decision o habito cuando sea real.',
          name: 'Persona J',
          detail: 'Proceso placeholder',
          image: eventAssets.pain,
          imageAlt: 'Placeholder process proof image',
        },
      ],
    },
    repeatedCtas: [
      {
        eyebrow: 'Registro',
        title: 'Reserva tu lugar en Reconociendo Tu Poder.',
        subtitle: 'Este texto queda como placeholder hasta definir el siguiente paso real.',
        priceLine: 'Hoy {price}. Precio regular {regularPrice}.',
      },
      {
        eyebrow: 'Resumen',
        title: 'Tu proceso empieza con una decision simple.',
        subtitle: 'Haz clic cuando estes listo para ir al checkout. Si la URL no esta configurada, veras el boton deshabilitado.',
        priceLine: 'Acceso especial {price}.',
      },
    ],
    repeatedOffers: [
      {
        eyebrow: 'Oferta placeholder',
        title: 'Accede al siguiente paso cuando el checkout este configurado.',
        subtitle: 'Usa este bloque para reiterar la promesa real cuando la oferta este definida.',
        priceLine: 'Hoy {price}. Precio regular {regularPrice}.',
        offerBoxIndex: 0,
      },
      {
        eyebrow: 'Recordatorio',
        title: 'Reconociendo Tu Poder muestra estructura; la oferta final se definira despues.',
        subtitle: 'Mantener este texto especifico a la audiencia real antes de publicar.',
        priceLine: 'Acceso especial {price}.',
        offerBoxIndex: 1,
      },
      {
        eyebrow: 'Despues del stack',
        title: 'Cada seccion debe apoyar una accion clara.',
        subtitle: 'Reemplaza este lenguaje placeholder con resultados, prueba y mecanica real de oferta.',
        priceLine: 'Valor total {regularPrice}. Hoy {price}.',
        offerBoxIndex: 1,
      },
      {
        eyebrow: 'Antes de continuar',
        title: 'Antes de lanzar, haz que este CTA coincida con el checkout real.',
        subtitle: 'El siguiente paso es sencillo: ir al checkout configurado y empezar con el material completo.',
        priceLine: 'Acceso hoy {price}.',
        offerBoxIndex: 2,
      },
    ],
    valueStack: {
      eyebrow: 'Lo que recibes',
      title: 'Stack placeholder de Reconociendo Tu Poder',
      subtitle: 'Cada item es placeholder de un modulo, recurso, bono o componente real.',
      totalValueLabel: 'Valor total',
      totalValue: '$221',
      todayPriceLabel: 'Precio de hoy',
      includedLabel: 'Incluido',
      stackSections: [
        {
          eyebrow: 'Fase 1',
          title: 'Aclarar la promesa',
          description: 'Define la audiencia, el resultado especifico y la razon de esta oferta.',
          items: ['Notas de audiencia y resultado', 'Mecanica placeholder', 'Accion principal'],
        },
        {
          eyebrow: 'Fase 2',
          title: 'Preparar la oferta',
          description: 'Lista entregables centrales y pasos practicos para quien se registre.',
          items: ['Modulo central placeholder', 'Recurso configurable', 'Soporte o seguimiento placeholder'],
        },
        {
          eyebrow: 'Fase 3',
          title: 'Apoyar el siguiente paso',
          description: 'Agrega recursos que hagan la accion mas clara y facil.',
          items: ['Registro semanal', 'Recurso bonus', 'Checklist de inicio'],
        },
      ],
      items: [
        { title: 'Registro principal RTP', description: 'El placeholder central que luego debe convertirse en la oferta real.', value: '$97' },
        { title: 'Recurso de implementacion', description: 'Una guia, checklist, workbook o template configurable.', value: '$47' },
        { title: 'Plan de accion', description: 'Un plan simple para ayudar a tomar el siguiente paso.', value: '$37' },
        { title: 'Mapa de seguimiento', description: 'Un recurso placeholder de seguimiento.', value: '$40' },
      ],
    },
    bonuses: {
      eyebrow: 'Bonos incluidos',
      title: 'Los bonos son opcionales y configurables',
      subtitle: 'Reemplaza estos placeholders con recursos reales cuando existan.',
      valueLabel: 'Valor',
      items: [
        { title: 'Bonus 1: Checklist de inicio', description: 'Un recurso simple para orientar el primer paso.', value: '$27' },
        { title: 'Bonus 2: Ejercicios configurables', description: 'Prompts o ejercicios placeholder para convertir claridad en accion.', value: '$27' },
        { title: 'Bonus 3: Seguimiento semanal', description: 'Una hoja placeholder de seguimiento.', value: '$17' },
      ],
    },
    guarantee: {
      eyebrow: 'Garantia configurable',
      title: 'Agrega la garantia real antes de publicar',
      description: 'Este placeholder mantiene la seccion funcional sin crear una promesa de produccion.',
      bullets: ['Configura plazo y condiciones', 'Aclara soporte o reembolso', 'Alinea el texto con el checkout'],
    },
    scarcity: {
      eyebrow: 'Disponibilidad',
      title: 'Configura urgencia real solo cuando corresponda',
      description: 'Placeholder: configura fechas, cupos o condiciones reales solo cuando la oferta este definida.',
    },
    fascinations: {
      eyebrow: 'Lo que descubriras',
      title: 'Ideas placeholder para Reconociendo Tu Poder',
      subtitle: 'Usa esta lista para crear interes sin hacer claims que el sitio no pueda sostener.',
      items: [
        'Por que este espacio existe ahora.',
        'Que recibe la persona despues de registrarse.',
        'Como se diferencia el enfoque cuando este definido.',
        'Que hace simple el primer paso.',
        'Que prueba real apoyara la promesa.',
        'Que debe pasar despues del registro o checkout.',
      ],
      closing: 'Reemplaza esta lista por curiosidades especificas del nuevo funnel.',
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      title: 'Questions to answer before checkout',
      items: [
        {
          question: 'What should a clone replace first?',
          answer: 'Start with env values, site config, assets, checkout URLs, capture settings, and launch copy.',
        },
        {
          question: 'Is checkout active by default?',
          answer: 'No. The default checkout URL is a safe placeholder and should be replaced before publishing.',
        },
        {
          question: 'Este texto ya es copy final de produccion?',
          answer: 'It is functional for rendering only. Production sites should use their own audience, proof, and offer language.',
        },
      ],
    },
    finalCta: {
      eyebrow: 'Ready to configure',
      title: 'Prepara la oferta real antes de publicar',
      subtitle: 'Reemplaza placeholders, verifica env, ejecuta checks y conecta el checkout cuando el sitio este listo.',
      priceLine: 'Precio placeholder {price}.',
    },
  },
  vslVideoId,
  videos: {
    vsl: {
      provider: 'youtube',
      videoId: vslVideoId,
      revealAtSeconds: 0,
      progressBarColor: '#e88c8c',
      posterImage: placeholderAsset,
      ctaDisplayAtSeconds: 0,
    },
  },
  tracking: {
    siteId,
    metaPixelId: readEnv('VITE_META_PIXEL_ID'),
    tiktokPixelId: readEnv('VITE_TIKTOK_PIXEL_ID'),
    capiWebhookUrl: readEnv('VITE_CAPI_RELAY_URL'),
    visitorApiUrl: readEnv('VITE_VISITOR_API_URL', 'https://ipapi.co/json/'),
    metaPixelScriptUrl: readEnv('VITE_META_PIXEL_SCRIPT_URL', 'https://connect.facebook.net/en_US/fbevents.js'),
    tiktokPixelScriptBaseUrl: readEnv('VITE_TIKTOK_PIXEL_SCRIPT_BASE_URL', 'https://analytics.tiktok.com/i18n/pixel/events.js'),
  },
  seo: {
    title: readEnv('VITE_SITE_TITLE', productName + ' | ' + eventName),
    description: readEnv('VITE_SITE_DESCRIPTION', 'Espacio de crecimiento personal y reconexion interior.'),
    socialImage: readEnv('VITE_SOCIAL_IMAGE', 'https://' + domain + '/assets/funnel-placeholder.svg'),
  },
  colors: {
    primary: '13 59 102',
    accent: '232 140 140',
    highlight: '77 168 218',
    success: '49 151 112',
    warning: '191 128 38',
    error: '190 58 58',
  },
  surface: {
    page: '247 240 232',
    panel: '255 255 255',
    muted: '245 233 220',
    bump: '255 255 255',
  },
  text: {
    main: '31 37 44',
    muted: '86 94 104',
    subtle: '122 130 139',
    inverse: '255 255 255',
    onPrimary: '255 255 255',
    onAccent: '255 255 255',
  },
  cta: {
    bg: '232 140 140',
    text: '255 255 255',
    hoverBg: '210 117 117',
  },
  prices: {
    main: '27',
    bump: '0',
    totalValue: '221',
    regular: '97',
    regularPrice: '97',
    vip: '0',
  },
  assets: {
    productImage: placeholderAsset,
    salesLetterImage: placeholderAsset,
    bonusImage: placeholderAsset,
    bundleWideImage: placeholderAsset,
    socialImage: placeholderAsset,
    event: {
      ...eventAssets,
      heroImage: eventAssets.hero,
      agendaImages: [eventAssets.agenda1, eventAssets.agenda2, eventAssets.agenda3],
      painImage: eventAssets.pain,
      authorityImage: eventAssets.authority,
      finalCtaImage: eventAssets.finalCta,
      insecureDriverImage: eventAssets.hero,
      confidentDriverImage: eventAssets.agenda3,
      parkedCarImage: eventAssets.pain,
      motherWithChildrenImage: eventAssets.finalCta,
      expertTeachingImage: eventAssets.authority,
    },
  },
  forms: {
    captureWebhookUrl: readEnv('VITE_CAPTURE_WEBHOOK_URL'),
    captureListSlug: readEnv('VITE_CAPTURE_LIST_SLUG'),
    successRedirectType: 'url',
    successRedirectUrl: '/confirmacion',
    whatsappGroupUrl: readEnv('VITE_WHATSAPP_GROUP_URL'),
    whatsappRedirectBaseUrl: readEnv('VITE_WHATSAPP_REDIRECT_BASE_URL', 'https://wa.me'),
    captureFields: {
      firstName: true,
      lastName: false,
      email: true,
      whatsapp: false,
    },
    captureTracking: {
      eventName: 'Lead',
      formId: 'expert_event_registration_form',
      status: 'submitted',
      source: eventCaptureSource,
      payloadEventName: eventName,
    },
  },
  success: {
    action: {
      type: successActionType,
      url: readEnv('VITE_SUCCESS_URL', '/'),
    },
    redirectSeconds: 10,
  },
  copy: {
    productName,
    headline: 'Reconecta con tu poder personal',
    headlineHighlight: 'con claridad, calma y direccion',
    subheadline: 'Un espacio para recuperar claridad, calma y direccion.',
    ctaText: 'Reserva tu lugar',
    checkoutCtaText: 'Reserva tu lugar',
    orderBumpTitle: '',
    salesLetter: {
      title: 'Historia de transformacion',
      part1: [
        'Usa este bloque para conectar con el problema actual de tu audiencia.',
        'Manten la estructura persuasiva y reemplaza el texto con la historia del nuevo funnel.',
      ],
      highlight: 'Despues, muestra el descubrimiento que cambia el camino.',
      part2: [
        'Explica por que la oferta existe y como ayuda a avanzar con claridad.',
        'Cierra el bloque invitando a tomar accion con el producto configurado.',
      ],
      image: placeholderAsset,
      ctaText: 'Quiero continuar',
    },
    offerStackTitle: 'Lo que recibes hoy',
    benefits: [
      'Beneficio principal configurable',
      'Resultado esperado configurable',
      'Acceso a materiales configurables',
      'Acompanamiento o soporte configurable',
    ],
    specialOfferTitle: 'Oferta especial',
    specialOfferSubtitle: 'Reemplaza esta frase por el resumen de la oferta de <strong>Reconociendo Tu Poder</strong> cuando este definida.',
    specialOfferGuarantee: 'Pago seguro - Acceso inmediato',
    specialOfferImage: placeholderAsset,
    presentationPreTitle: 'Te presento:',
    presentationTitle: '<span style="color: rgb(var(--color-brand-primary))">Reconociendo Tu Poder</span>',
    confidenceBooster: {
      headline: 'Refuerza la confianza antes de la decision',
      paragraphs: ['Explica por que la persona puede avanzar aunque empiece desde cero.', 'Muestra que el proceso esta ordenado y que cada paso tiene una razon.'],
      bullets: ['Checklist o guia configurable', 'Recursos de apoyo configurables'],
      includedLabel: 'Incluye:',
    },
    sewingBonus: {
      eyebrow: 'Bono configurable',
      title: 'Bono configurable',
      image: placeholderAsset,
      description: 'Describe aqui el bono que aumenta el valor percibido de la oferta.',
    },
    painPoints: {
      headline: 'Te suena familiar?',
      subtitle: 'Configura aqui los puntos de dolor reales del nuevo mercado.',
      bullets: ['Punto de dolor configurable 1.', 'Punto de dolor configurable 2.', 'Punto de dolor configurable 3.', 'Punto de dolor configurable 4.'],
      transitionText: 'Entonces este puede ser el siguiente paso.',
    },
    modules: [
      { title: 'Modulo configurable 1', value: '$0', description: 'Describe el primer entregable del producto.', image: placeholderAsset },
      { title: 'Modulo configurable 2', value: '$0', description: 'Describe el segundo entregable del producto.', image: placeholderAsset },
      { title: 'Bono configurable', value: '$0', description: 'Describe un bono o recurso adicional.', image: placeholderAsset },
    ],
    fastActionBonus: {
      timeLimit: 'Si tomas accion en los proximos 60 minutos',
      title: 'Bono de accion rapida',
      subtitle: 'Configura aqui el beneficio de actuar ahora.',
    },
    offerSummary: {
      title: 'Todo lo que recibes con {productName} hoy',
      countdownLabel: 'La oferta vence en:',
      opportunityExpiresLabel: 'Esta oportunidad expira en:',
      bundleImageAlt: 'Paquete completo de la oferta con bonos incluidos',
      totalValueLabel: 'Valor total',
      todayPriceLabel: 'Precio de hoy',
      regularPriceLabel: 'Precio regular',
      includedBadgeLabel: 'Incluido gratis',
      realValueLabel: 'Valor real',
      ctaLabel: 'Si, quiero activar {productName}',
      ctaSubLabel: 'Hoy por ${price} - Acceso inmediato y seguro',
      offerAvailableLabel: 'La oferta esta disponible',
      specialPriceLabel: 'Precio especial: ${price}',
      todayOnlyLabel: 'Hoy solo',
      originalPriceLabel: 'Precio original',
      valuedAtLabel: 'Valorado en',
    },
    certaintyItems: [
      { id: 'secure-payment', label: 'Pago seguro' },
      { id: 'guarantee', label: 'Garantia configurable' },
      { id: 'ssl', label: 'Checkout protegido' },
    ],
    orderForm: {
      eyebrow: 'Checkout placeholder',
      description: 'Este bloque se conserva como placeholder temporal. El CTA principal usa la URL de checkout definida en DNA.',
    },
    successPage: {
      eyebrow: 'CONFIRMACION',
      title: 'Tu registro fue recibido',
      description: 'Esta pagina confirma la accion del visitante. Configura el siguiente paso real antes de publicar.',
      backLabel: 'Volver al inicio',
      whatsappLabel: 'Continuar',
      countdownLead: 'Seras redirigido automaticamente en...',
      missingWhatsappUrlMessage: 'El enlace de destino aun no esta configurado.',
      progressAriaLabel: 'Progreso de redireccion',
    },
    captureForm: {
      eyebrow: 'Formulario enriquecido',
      headlineFallback: 'Tambien puedes participar desde tu ciudad',
      headlineWithLocation: 'Tambien puedes participar desde {city} y pagar en {currency}',
      description: 'Completa tus datos para continuar con {productName} y conservar el contexto de tu pais.',
      firstNameLabel: 'Nombre',
      firstNamePlaceholder: 'Tu nombre',
      lastNameLabel: 'Apellido',
      lastNamePlaceholder: 'Tu apellido',
      emailLabel: 'Email',
      emailPlaceholder: 'tu@email.com',
      whatsappLabel: 'WhatsApp',
      whatsappPlaceholder: '79790873',
      requiredError: 'Completa este campo.',
      emailRequiredError: 'Por favor, ingresa tu email.',
      invalidEmailError: 'Ingresa un email valido.',
      whatsappRequiredError: 'Por favor, ingresa tu WhatsApp.',
      invalidWhatsappError: 'Ingresa un numero de WhatsApp valido en formato internacional.',
      submitError: 'No pudimos procesar tu solicitud en este momento. Intentalo nuevamente.',
      submitLabel: 'Validar y enviar',
      submittingLabel: 'Enviando...',
    },
    event: {
      registrationAnchorId: 'final-registration',
      startsAtIso: readEnv('VITE_EVENT_STARTS_AT', '2026-07-01T12:00:00-05:00'),
      footer: {
        logoAlt: eventName,
      },
      hero: {
        eyebrow: 'Registro gratuito',
        eventName,
        dateLabel: 'PROXIMAMENTE',
        headline: 'Reconecta con tu poder personal',
        subheadline: 'Un espacio para recuperar claridad, calma y direccion.',
        quickBenefits: ['Registro gratuito', 'Online', 'Contenido pendiente de configurar'],
        imageAlt: 'Placeholder visual de Reconociendo Tu Poder',
        formTitle: 'Reserva tu lugar',
        primaryCtaLabel: 'Reserva tu lugar',
        secondaryCtaLabel: 'Ver detalles',
        submittingLabel: 'Reservando...',
      },
      socialProof: 'Tu proceso empieza con una decision simple.',
      countdown: {
        label: 'El evento inicia en:',
        expiredLabel: 'El evento ya comenzo',
        units: {
          days: 'Dias',
          hours: 'Horas',
          minutes: 'Min',
          seconds: 'Seg',
        },
      },
      foundation: {
        sectionEyebrow: 'Base visual',
        sectionTitle: 'Un espacio para recuperar claridad, calma y direccion.',
        sectionText: 'Esta primera version conserva placeholders seguros mientras se define el contenido final de Reconociendo Tu Poder.',
        cardTitle: 'Base de registro',
        cardText: 'Reserva tu acceso gratuito y recibe los recordatorios del evento en tu correo.',
      },
      promise: {
        title: 'Esto es lo que encontraras en este espacio:',
        image: eventAssets.agenda3,
        imageAlt: 'Neutral placeholder for the event promise section',
        bullets: [
          'Un primer acercamiento a tu claridad personal',
          'Una pausa para observar que necesitas ordenar',
          'Placeholders seguros hasta definir el contenido final',
          'Capture y checkout en modo seguro hasta configurar el servidor',
        ],
        ctaLabel: 'QUIERO RESERVAR MI CUPO GRATIS',
      },
      transformation: {
        eyebrow: 'Antes vs Despues',
        title: 'Tu proceso empieza con una decision simple.',
        beforeTitle: 'Antes de reservar',
        afterTitle: 'Despues de reservar',
        beforeItems: [
          'Aun estas explorando el siguiente paso',
          'La oferta final todavia no esta definida',
          'Los enlaces reales siguen pendientes',
          'Los assets de marca se agregaran despues',
        ],
        afterItems: [
          'Tu registro queda encaminado',
          'El sitio conserva una identidad minima de marca',
          'Los assets finales podran sumarse sin tocar el core',
          'La captura sigue en dry-run hasta configurar server env real',
        ],
      },
      agenda: {
        title: 'Lo que veremos durante el evento',
        items: [
          {
            label: 'Paso 1',
            title: 'Reconectar',
            description: 'Abrir un espacio para observar con mas calma donde estas y que necesitas ordenar.',
            image: eventAssets.agenda1,
            imageAlt: 'Neutral placeholder for agenda item one',
          },
          {
            label: 'Paso 2',
            title: 'Aclarar',
            description: 'Recuperar direccion con un lenguaje simple, sin promesas fuertes ni claims terapeuticos.',
            image: eventAssets.agenda2,
            imageAlt: 'Neutral placeholder for agenda item two',
          },
          {
            label: 'Paso 3',
            title: 'Decidir',
            description: 'Tomar el siguiente paso cuando el contenido final y la oferta esten listos.',
            image: eventAssets.agenda3,
            imageAlt: 'Neutral placeholder for agenda item three',
          },
        ],
        ctaLabel: 'RESERVAR MI CUPO GRATUITO',
      },
      whyFearPersists: {
        eyebrow: 'Por que importa',
        title: 'Reconocer tu poder empieza por hacer espacio.',
        paragraphs: [
          'Esta pagina mantiene una identidad minima para que el sitio renderice sin inventar una oferta definitiva.',
          'Los placeholders protegen capture, checkout y assets hasta que exista configuracion real de servidor.',
        ],
        highlights: ['Registro gratuito.', 'Placeholders seguros hasta configurar produccion.'],
      },
      pain: {
        title: 'A veces el primer paso es volver a escucharte.',
        imageAlt: 'Placeholder de la seccion de claridad personal',
        intro: 'Tal vez hoy:',
        bullets: [
          'Sientes que necesitas pausar y ordenar tus ideas',
          'Quieres recuperar claridad sin forzar respuestas',
          'Necesitas una direccion mas simple para avanzar',
          'El contenido final aun esta pendiente de definir',
          'La captura seguira segura hasta configurar el servidor',
          'Los assets finales se incorporaran despues',
        ],
        phrases: ['Tu proceso empieza con una decision simple.', 'Reserva tu lugar.', 'Reconecta con tu poder personal.'],
        ctaLabel: 'Reserva tu lugar',
      },
      testimonials: {
        eyebrow: 'Testimonios placeholder',
        title: 'Este bloque se reemplazara con prueba real antes de publicar.',
        subtitle: 'Estos testimonios son placeholders editables desde el DNA hasta incorporar historias reales del evento.',
        items: [
          { name: 'Persona 1', location: 'Placeholder', quote: 'Testimonio pendiente de validar para Reconociendo Tu Poder.' },
          { name: 'Persona 2', location: 'Placeholder', quote: 'Reemplaza este texto con prueba real cuando exista.' },
          { name: 'Persona 3', location: 'Placeholder', quote: 'Usa este espacio para una historia breve y verificada.' },
        ],
      },
      authority: {
        title: 'Quien esta detras de Reconociendo Tu Poder?',
        imageAlt: 'Placeholder de autoridad de Reconociendo Tu Poder',
        intro: 'Este bloque queda pendiente de completar con la autoridad real.',
        bio: 'Usa esta area para la fundadora, anfitriona, marca u organizacion cuando este definida.',
        paragraphs: ['La identidad minima del sitio queda configurada sin crear una promesa final.'],
        badges: ['Marca RTP', 'Prueba configurable', 'Placeholder seguro'],
        quote: 'Tu proceso empieza con una decision simple.',
        ctaLabel: 'Reserva tu lugar',
      },
      finalCta: {
        eyebrow: 'Registro gratuito',
        headline: 'Reserva tu lugar en Reconociendo Tu Poder',
        imageAlt: 'Placeholder del CTA final de Reconociendo Tu Poder',
        subheadline: 'Un espacio para recuperar claridad, calma y direccion.',
        bullets: ['Registro gratuito', 'Online'],
        text: 'Este sitio usa placeholders seguros. Reemplaza este texto por una invitacion real antes de publicar.',
        ctaLabel: 'Reserva tu lugar',
      },
    },
    pricingCard: {
      eyebrow: 'Oferta especial',
      title: 'Activa {productName} hoy mismo',
      baseValueLabel: 'Valor base',
      basePriceLabel: 'Precio base',
      subtotalLabel: 'Subtotal',
      localTaxesLabel: 'Impuestos locales',
      includedTaxesLabel: 'Incluidos',
      checkoutTotalLabel: 'Total final en {providerName}',
      equivalentLabel: 'Equivalente a {price} USD. Impuestos incluidos',
      internationalPriceLabel: 'Precio internacional directo.',
      buyButtonLabel: 'Comprar ahora',
      unavailableLabel: 'Producto no disponible',
      securePaymentLabel: 'Pago seguro',
      processedByLabel: 'Procesado por {providerName}',
      immediateAccessLabel: 'Acceso inmediato',
    },
    video: {
      smartPosterEyebrow: productName,
      smartPosterTitle: 'Mira la presentacion de ' + productName,
      smartPosterDescription: 'Configura aqui la descripcion del video principal.',
      smartPosterButtonText: 'Ver video',
      ctaEyebrow: 'Oferta activa',
      ctaHeadline: 'La oferta ya esta disponible',
      ctaButtonText: 'Ir al checkout',
      soundPrompt: 'Enciende tus parlantes',
      placeholderText: 'Video placeholder',
    },
    testimonials: {
      headline: 'Testimonios configurables',
      subtitle: 'Reemplaza estos placeholders por testimonios reales del nuevo funnel.',
      items: [
        { name: 'Cliente 1', quote: 'Testimonio placeholder 1.', image: placeholderAsset },
        { name: 'Cliente 2', quote: 'Testimonio placeholder 2.', image: placeholderAsset },
        { name: 'Cliente 3', quote: 'Testimonio placeholder 3.', image: placeholderAsset },
      ],
    },
    faq: {
      title: 'Preguntas frecuentes',
      items: [
        {
          question: 'Que debo configurar antes de publicar?',
          answer: 'Actualiza el video, checkout, tracking, precios, garantias, testimonios, assets y copy desde <code>src/site/**</code> y las variables de entorno necesarias.',
        },
        {
          question: 'El acceso al checkout esta activo?',
          answer: 'No por defecto. El valor inicial es un placeholder seguro. Reemplazalo por la URL real del procesador de pago del nuevo funnel.',
        },
      ],
    },
  },
} as const satisfies DnaConfig;;

export const dnaNumericPrices = {
  main: parsePrice(DNA.prices.main),
  bump: parsePrice(DNA.prices.bump),
  totalValue: parsePrice(DNA.prices.totalValue),
  regular: parsePrice(DNA.prices.regular),
  regularPrice: parsePrice(DNA.prices.regularPrice),
  vip: parsePrice(DNA.prices.vip),
} as const;

export function resolveDnaDocumentTheme(theme: DnaTheme = DNA.theme) {
  return theme === 'expert' ? 'theme-expert' : 'theme-panda';
}

export function resolveDnaFunnelTheme(theme: DnaTheme = DNA.theme) {
  return theme === 'expert' ? 'theme-expert' : 'theme-panda';
}

export function resolveDnaThemeStyle() {
  return {
    '--font-sans': `'${DNA.fonts.sans}', sans-serif`,
    '--font-body': `'${DNA.fonts.body}', sans-serif`,
    '--color-page': toRgbTriplet(DNA.surface.page),
    '--color-surface': toRgbTriplet(DNA.surface.panel),
    '--color-surface-muted': toRgbTriplet(DNA.surface.muted),
    '--color-primary': toRgbTriplet(DNA.colors.primary),
    '--color-secondary': toRgbTriplet(DNA.colors.accent),
    '--color-highlight': toRgbTriplet(DNA.colors.highlight),
    '--color-success': toRgbTriplet(DNA.colors.success),
    '--color-warning': toRgbTriplet(DNA.colors.warning),
    '--color-error': toRgbTriplet(DNA.colors.error),
    '--color-accent': toRgbTriplet(DNA.cta.bg),
    '--color-border-subtle': toRgbTriplet(DNA.text.subtle),
    '--color-text-main': toRgbTriplet(DNA.text.main),
    '--color-text-muted': toRgbTriplet(DNA.text.muted),
    '--color-text-subtle': toRgbTriplet(DNA.text.subtle),
    '--color-text-inverse': toRgbTriplet(DNA.text.inverse),
    '--color-brand-primary': toRgbTriplet(DNA.colors.primary),
    '--color-brand-accent': toRgbTriplet(DNA.colors.accent),
    '--color-cta-base': toRgbTriplet(DNA.cta.bg),
    '--color-cta-hover': toRgbTriplet(DNA.cta.hoverBg),
    '--color-cta-text': toRgbTriplet(DNA.cta.text),
    '--color-surface-bump': toRgbTriplet(DNA.surface.bump),
    '--color-event-page': toRgbTriplet(DNA.surface.page),
    '--color-event-surface': toRgbTriplet(DNA.surface.panel),
    '--color-event-surface-soft': toRgbTriplet(DNA.surface.muted),
    '--color-event-card': toRgbTriplet(DNA.surface.panel),
    '--color-event-ink': toRgbTriplet(DNA.text.main),
    '--color-event-muted': toRgbTriplet(DNA.text.muted),
    '--color-event-navy': toRgbTriplet(DNA.colors.primary),
    '--color-event-sky': toRgbTriplet(DNA.colors.highlight),
    '--color-event-coral': toRgbTriplet(DNA.colors.accent),
    '--color-event-highlight': toRgbTriplet(DNA.surface.muted),
  } as const;
}
