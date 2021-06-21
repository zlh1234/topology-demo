import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/preview', component: '@/pages/preview' },
  ],
  fastRefresh: {},
  title: 'Topology demo',
});
