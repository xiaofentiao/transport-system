/**
 * Geniex功能配置模块 API
 */
const geniexConfig = {
  list: { method: 'post', url: '/geniex-config/list' },
  save: { method: 'post', url: '/geniex-config/save' },
  update: { method: 'post', url: '/geniex-config/update' },
  delete: { method: 'post', url: '/geniex-config/delete' },
  merchantList: { method: 'get', url: '/merchant/list' },
};

export default geniexConfig;
