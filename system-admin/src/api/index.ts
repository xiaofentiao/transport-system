import services from '@/services';

const moduleFiles: Record<string, any> = import.meta.glob('./*.ts', { eager: true });
const api: Record<string, any> = {};

/**
 * 注册模块 API 方法到聚合对象
 * @param name 模块名称
 * @param module 模块导出的接口配置集合
 * @returns void
 */
function register(name: string, module: Record<string, any>): void {
  const apiModule: Record<string, any> = {};

  // 将模块配置映射为可直接调用的请求方法
  Object.keys(module).forEach((key) => {
    const options = module[key];
    const method = options.method;

    apiModule[key] = (params: any, otherConfig: Record<string, any> = {}) => {
      // 根据请求方式设置 params 或 data
      const requestOptions = {
        ...options,
        ...(method === 'get' ? { params } : { data: params }),
        ...otherConfig,
      };

      return services.request(requestOptions);
    };
  });

  Object.freeze(apiModule);
  api[name] = apiModule;
}

// 自动注册同级目录下的模块文件
Object.keys(moduleFiles).forEach((filePath) => {
  if (filePath.includes('index')) return;
  const name = filePath.replace(/\.\/|\.ts/g, '');
  if (!name) return;
  register(name, moduleFiles[filePath].default);
});

// 冻结聚合对象，避免运行时修改
Object.freeze(api);

export default api;
