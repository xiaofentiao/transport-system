export class LocalCache {
  setCache<T = any>(key: string, value: T): boolean;
  setCache<T = any>(
    key: string,
    value: T,
    localOrSessionStorage: boolean
  ): boolean;
  /**
   * 设置缓存
   * @param key
   * @param value
   * @param localOrSessionStorage true => localStorage 默认就是true  如果需要使用sessionStorage 需要传递该参数 false
   * @returns
   */
  setCache<T = any>(
    key: string,
    value: T,
    localOrSessionStorage = true
  ): boolean {
    try {
      const val = JSON.stringify(value);
      if (localOrSessionStorage) {
        window.localStorage.setItem(key, val);
      } else {
        window.sessionStorage.setItem(key, val);
      }
    } catch (error) {
      return false;
    }
    return true;
  }

  getCache<T = any>(key: string): T;
  getCache<T = any>(key: string, localOrSessionStorage: boolean): T;
  /**
   *
   * @param key 获取缓存
   * @param localOrSessionStorage
   * @returns
   */
  getCache<T>(key: string, localOrSessionStorage = true): T {
    const storage = localOrSessionStorage ? window.localStorage : window.sessionStorage
    const val = storage.getItem(key)
    if (!val) return undefined as T
    return JSON.parse(val) as T
  }
  deleteCache(key: string): void;
  deleteCache(key: string, localOrSessionStorage: boolean): void;
  /**
   * 删除缓存
   * @param key 缓存键名
   * @param localOrSessionStorage 是否存储在 localStorage，默认为 true。false 则为 sessionStorage
   */
  deleteCache(key: string, localOrSessionStorage = true): void {
    if (localOrSessionStorage) window.localStorage.removeItem(key);
    else window.sessionStorage.removeItem(key);
  }
  clearCache(): void;
  clearCache(localOrSessionStorage: boolean): void;
  /**
   * 清空缓存
   * @param localOrSessionStorage 是否存储在 localStorage，默认为 true。false 则为 sessionStorage
   */
  clearCache(localOrSessionStorage = true): void {
    if (localOrSessionStorage) window.localStorage.clear();
    else window.sessionStorage.clear();
  }
}

/**
 * 全局缓存对象实例
 */
export default new LocalCache();
