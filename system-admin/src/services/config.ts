const env: string = __ENV_NAME__.env;
console.log(env, 'env ')
const config: any = {
  dev: {
    baseURL:'/',
    baseRouteUrl: '/'
  },
  prod: {
    baseURL: '',
    baseRouteUrl: '/'
  },
  test: {
    baseURL: '',
    baseRouteUrl: '/'
  }
};
export default config[env];
