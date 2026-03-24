import { useCallback, useEffect, useRef } from 'react';
import { useLocation, type Location, matchRoutes } from 'react-router-dom';

import { routes } from '@/router/config';
import type { AppRouteObject } from '@/type/routes'
interface ConfigType {
  immediate: boolean;
}
export function useWatch(val: any, callback: (...args: any[]) => void, config: ConfigType = { immediate: false }) {
  const oldVal = useRef();
  const isInit = useRef(false);
  const isWatch = useRef(true);
  useEffect(() => {
    if (isWatch.current) {
      if (!isInit.current) {
        isInit.current = true;
        if (config.immediate) {
          callback(val, oldVal.current);
        }
      } else {
        callback(val, oldVal.current);
      }
      oldVal.current = val;
    }
  }, [val]);

  //返回一个unWatch函数控制停止调用监听
  const unWatch = () => {
    isWatch.current = false;
  };
  return unWatch;
}

// 返回当前路由数据
export function useCountRoute(): AppRouteObject | null {
  // //console.log(routes, 'routesroutesroutesroutesroutesroutesroutes is vlaeu')
  const location:Location = useLocation();
  const match = matchRoutes(routes, location.pathname);
  const countRoute:any = match?.filter((item: any) => item.pathname === location.pathname);
  return countRoute[0]?.route;
}
//useWatch使用方式
// useWatch(title, (val, oldVal) => {
// //console.log(val);
// //console.log(oldVal)
// }, {
//   immediate: true
// })


export function  useLockFn<P extends any[] = any[], V extends any = any>(fn: (...args: P) => Promise<V>) {
  const lockRef = useRef(false);

  return useCallback(
    async (...args: P) => {
      if (lockRef.current) return;
      lockRef.current = true;
      try {
        const ret = await fn(...args);
        lockRef.current = false;
        return ret;
      } catch (e) {
        lockRef.current = false;
        throw e;
      }
    },
    [fn],
  );
}
