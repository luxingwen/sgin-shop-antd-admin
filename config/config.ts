import { defineConfig } from '@umijs/max';
import proxy from './proxy';
import routes from './routes';

export default defineConfig({
  favicons: ['/logo.png'],
  antd: {
    configProvider: {
      theme: {
        token: {
          colorPrimary: '#4b64f3',
          colorLink: '#4b64f3',
          colorLinkHover: '#7891ff',
          colorLinkActive: '#4b64f3',
        },
      },
    },
  },
  esbuildMinifyIIFE: true,
  codeSplitting: { jsStrategy: 'granularChunks' },
  ignoreMomentLocale: true,
  fastRefresh: true,
  hash: true,
  crossorigin: {},
  deadCode: {},
  access: {},
  model: {},
  // Enable DVA models (Umi/DVA style state management)
  dva: {
    immer: { enabled: true },
  },
  initialState: {},
  request: {},
  layout: {
    title: 'sgin admin',
  },
  routes,
  proxy,
  npmClient: 'pnpm',
  tailwindcss: {},
  icons: {},
  valtio: {},
});
