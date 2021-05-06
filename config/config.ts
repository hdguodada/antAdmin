// https://umijs.org/config/
import aliyunTheme from '@ant-design/aliyun-theme';
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV, STATIC_URL } = process.env;

export default defineConfig({
  publicPath: './',
  history: {
    type: 'hash',
  },
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  // theme: {
  //   'primary-color': defaultSettings.primaryColor,
  // },
  theme: aliyunTheme,
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  routes: routes,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  define: {
    BASE_URL: '',
    STATIC_URL: STATIC_URL,
  },
});
