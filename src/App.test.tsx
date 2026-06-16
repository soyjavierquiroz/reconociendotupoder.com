import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./components/themes/expert/ExpertTheme', () => ({
  ExpertTheme: () => <main>Home</main>,
}));

vi.mock('./components/themes/expert/event/ExpertEventTheme', () => ({
  ExpertEventTheme: () => <main>Event</main>,
}));

vi.mock('./components/themes/expert/offer/ExpertOfferPage', () => ({
  ExpertOfferPage: () => <main>Offer</main>,
}));

function renderRoute(path: string) {
  return renderToString(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('No Le Escribas offer routes', () => {
  it.each(['/o/no-le-escribas', '/x9m/o/no-le-escribas', '/no-le-escribas', '/x9m/no-le-escribas'])(
    'renders the sales page at %s',
    (path) => {
      const html = renderRoute(path);

      expect(html).toContain('no-le-escribas-page');
      expect(html).toContain('No le escribas');
    },
  );
});
