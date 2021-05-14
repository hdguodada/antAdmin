/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
const { BASE_URL } = process.env;
console.log(BASE_URL);
export default {
  dev: {
    [BASE_URL as string]: {
      target: 'https://erp.zjqsa.com',
      changeOrigin: true,
      pathRewrite: { ['^' + BASE_URL]: '' },
    },
    '/bas': {
      target: 'https://www.hengdianworld.xyz/mock/18',
      changeOrigin: true,
      pathRewrite: { ['^' + '/bas']: '' },
    },
    '/funds': {
      target: 'https://www.hengdianworld.xyz/mock/19',
      changeOrigin: true,
      pathRewrite: { ['^' + '/funds']: '' },
    },
    '/xsdj': {
      target: 'https://www.hengdianworld.xyz/mock/20',
      changeOrigin: true,
      pathRewrite: { ['^' + '/xsdj']: '' },
    },
  },
  test: {
    '/dev': {
      target: 'https://www.hengdianworld.xyz/mock/18',
      changeOrigin: true,
      pathRewrite: { ['^' + '/dev']: '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
