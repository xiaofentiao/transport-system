
/**
 * 门店模块 API 配置
 */
const store = {
  /**
   * 门店列表查询
   */
  list: {
    method: 'post',
    // 使用完整路径，依赖 vite proxy 转发
    url: '/sellmo-partner/finance/store/list',
  },
};

export default store;
