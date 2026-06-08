import { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { DNA, resolveDnaDocumentTheme } from './site/current';
import analytics from './core/services/analytics';
import { resolveCurrentAttribution } from './core/attribution';
import { getAdsRoutePrefix, withAdsRoutePrefix } from './core/routing/adsRoute';
import { ExpertTheme } from './components/themes/expert/ExpertTheme';
import { ExpertEventTheme } from './components/themes/expert/event/ExpertEventTheme';
import { ExpertOfferPage } from './components/themes/expert/offer/ExpertOfferPage';
import { Success } from './pages/Success';
import { NoLeEscribasSalesPage } from './site/pages/NoLeEscribasSalesPage';

const adsRoutePrefix = getAdsRoutePrefix();
const adsOfferPath = withAdsRoutePrefix('/oferta', adsRoutePrefix);
const adsConfirmationPath = withAdsRoutePrefix('/confirmacion', adsRoutePrefix);
const noLeEscribasPath = '/no-le-escribas';
const adsNoLeEscribasPath = withAdsRoutePrefix(noLeEscribasPath, adsRoutePrefix);

function resolveHomeTheme() {
  if (DNA.theme === 'expert' && DNA.funnelType === 'event') {
    return <ExpertEventTheme />;
  }

  return <ExpertTheme />;
}

function RoutedApp() {
  const location = useLocation();
  const attribution = useMemo(() => resolveCurrentAttribution(location), [location]);
  const trafficChannel = attribution.channel;
  const isSuccessRoute =
    location.pathname === '/confirmacion' || location.pathname === adsConfirmationPath;
  const isNoLeEscribasRoute =
    location.pathname === noLeEscribasPath || location.pathname === adsNoLeEscribasPath;

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

    if (attribution.shouldTrackAds) {
      void analytics.trackEvent('PageView', {
        source: 'AppLoad',
        theme: DNA.theme,
        funnel_type: DNA.funnelType,
        traffic_channel: trafficChannel,
        attribution,
      });
    }
  }, [
    attribution,
    attribution.shouldTrackAds,
    isNoLeEscribasRoute,
    isSuccessRoute,
    location.pathname,
    location.search,
    trafficChannel,
  ]);

  return (
    <Routes>
      <Route path="/" element={resolveHomeTheme()} />
      <Route path={adsRoutePrefix} element={resolveHomeTheme()} />
      <Route path={noLeEscribasPath} element={<NoLeEscribasSalesPage />} />
      <Route path={adsNoLeEscribasPath} element={<NoLeEscribasSalesPage />} />
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
