import { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { DNA, resolveDnaDocumentTheme } from './site/current';
import analytics from './core/services/analytics';
import { resolveCurrentAttribution } from './core/attribution';
import { getAdsRoutePrefix, withAdsRoutePrefix } from './core/routing/adsRoute';
import { useVisitor } from './core/visitor/VisitorContext';
import { ExpertTheme } from './components/themes/expert/ExpertTheme';
import { ExpertEventTheme } from './components/themes/expert/event/ExpertEventTheme';
import { ExpertOfferPage } from './components/themes/expert/offer/ExpertOfferPage';
import { Success } from './pages/Success';
import { NoLeEscribasSalesPage } from './site/pages/NoLeEscribasSalesPage';
import { NoLeEscribasSalesPageV1 } from './site/pages/NoLeEscribasSalesPageV1';
import { buildVisitorCapiUserData } from './site/tracking/visitorUserData';

const adsRoutePrefix = getAdsRoutePrefix();
const adsOfferPath = withAdsRoutePrefix('/oferta', adsRoutePrefix);
const adsConfirmationPath = withAdsRoutePrefix('/confirmacion', adsRoutePrefix);
const noLeEscribasPath = '/no-le-escribas';
const canonicalNoLeEscribasPath = '/o/no-le-escribas';
const adsNoLeEscribasPath = withAdsRoutePrefix(noLeEscribasPath, adsRoutePrefix);
const adsCanonicalNoLeEscribasPath = withAdsRoutePrefix(
  canonicalNoLeEscribasPath,
  adsRoutePrefix,
);
const legacyNoLeEscribasPath = '/v1/no-le-escribas';
const adsLegacyNoLeEscribasPath = withAdsRoutePrefix(legacyNoLeEscribasPath, adsRoutePrefix);
const noLeEscribasPaths = [
  noLeEscribasPath,
  canonicalNoLeEscribasPath,
  adsNoLeEscribasPath,
  adsCanonicalNoLeEscribasPath,
];
const legacyNoLeEscribasPaths = [legacyNoLeEscribasPath, adsLegacyNoLeEscribasPath];

function resolveHomeTheme() {
  if (DNA.theme === 'expert' && DNA.funnelType === 'event') {
    return <ExpertEventTheme />;
  }

  return <ExpertTheme />;
}

function RoutedApp() {
  const location = useLocation();
  const { isLoading: isVisitorLoading, visitorData } = useVisitor();
  const attribution = useMemo(() => resolveCurrentAttribution(location), [location]);
  const visitorUserData = useMemo(() => buildVisitorCapiUserData(visitorData), [visitorData]);
  const trafficChannel = attribution.channel;
  const isSuccessRoute =
    location.pathname === '/confirmacion' || location.pathname === adsConfirmationPath;
  const isNoLeEscribasRoute =
    noLeEscribasPaths.includes(location.pathname) ||
    legacyNoLeEscribasPaths.includes(location.pathname);

  useEffect(() => {
    const documentTheme = resolveDnaDocumentTheme();
    const nextTitle = isSuccessRoute
      ? `${DNA.copy.productName} - ${DNA.copy.successPage.eyebrow}`
      : isNoLeEscribasRoute
        ? DNA.noLeEscribas.seo.title
      : DNA.seo.title;
    const nextDescription = isNoLeEscribasRoute
      ? DNA.noLeEscribas.seo.description
      : DNA.seo.description;
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');

    document.documentElement.setAttribute('data-theme', documentTheme);
    document.title = nextTitle;
    descriptionMeta?.setAttribute('content', nextDescription);

    if (attribution.shouldTrackAds && !isVisitorLoading) {
      void analytics.trackEvent('PageView', {
        source: 'AppLoad',
        theme: DNA.theme,
        funnel_type: DNA.funnelType,
        traffic_channel: trafficChannel,
        userData: visitorUserData,
        attribution,
      });
    }
  }, [
    attribution,
    attribution.shouldTrackAds,
    isVisitorLoading,
    isNoLeEscribasRoute,
    isSuccessRoute,
    location.pathname,
    location.search,
    trafficChannel,
    visitorUserData,
  ]);

  return (
    <Routes>
      <Route path="/" element={resolveHomeTheme()} />
      <Route path={adsRoutePrefix} element={resolveHomeTheme()} />
      {noLeEscribasPaths.map((path) => (
        <Route key={path} path={path} element={<NoLeEscribasSalesPage />} />
      ))}
      {legacyNoLeEscribasPaths.map((path) => (
        <Route key={path} path={path} element={<NoLeEscribasSalesPageV1 />} />
      ))}
      <Route path="/oferta" element={<ExpertOfferPage />} />
      <Route path={adsOfferPath} element={<ExpertOfferPage />} />
      <Route path="/confirmacion" element={<Success />} />
      <Route path={adsConfirmationPath} element={<Success />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return <RoutedApp />;
}

export default App;
