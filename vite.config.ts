import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const defaultHtmlEnv = {
  VITE_DOMAIN: 'example.com',
  VITE_SITE_TITLE: 'Example Funnel | VSL',
  VITE_SITE_DESCRIPTION: 'Describe your funnel here',
  VITE_SOCIAL_IMAGE: 'https://example.com/assets/funnel-placeholder.svg',
};

function htmlEnvPlugin(mode: string) {
  const env: Record<string, string> = { ...defaultHtmlEnv, ...loadEnv(mode, process.cwd(), 'VITE_') };

  return {
    name: 'html-env-defaults',
    transformIndexHtml(html: string) {
      return html.replace(/__VITE_[A-Z0-9_]+__/g, (token) => {
        const key = token.slice(2, -2);
        return env[key] ?? '';
      });
    },
  };
}

function adsRootIndexPlugin() {
  return {
    name: 'ads-root-index',
    writeBundle() {
      const adsRoot = join(process.cwd(), 'dist', 'x9m');

      mkdirSync(adsRoot, { recursive: true });
      copyFileSync(join(process.cwd(), 'dist', 'index.html'), join(adsRoot, 'index.html'));
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), htmlEnvPlugin(mode), adsRootIndexPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
