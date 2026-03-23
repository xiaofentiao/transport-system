import { create } from 'zustand'

import { UserStateProp } from '../type/user'

/**
 * 用户状态存储类型定义
 */
type UserStore = {
  /** 用户信息 */
  userInfo: UserStateProp
  /** 当前国家列表 */
  country: any[]
  /** 所有国家列表 */
  allCountryList: any[]
  /** 国家对象映射 */
  countryObj: Record<string, any>
  /** 设置用户信息 */
  setUserInfo: (v: UserStateProp) => void
  /** 设置当前国家列表 */
  setCountry: (v: any[]) => void
  /** 设置所有国家列表 */
  setAllCountryList: (v: any[]) => void
  /** 设置国家对象映射 */
  setCountryObj: (v: Record<string, any>) => void
}

/**
 * 用户全局状态管理 Hook
 * 使用 Zustand 管理用户相关信息的全局状态
 */
export const useUserStore = create<UserStore>((set) => ({
  userInfo: { userId: '', name: '', phone: undefined },
  country: JSON.parse(localStorage.getItem('countryList') ?? '[]') ?? [],
  allCountryList: JSON.parse(localStorage.getItem('allCountryList') ?? '[]') ?? [],
  countryObj: JSON.parse(localStorage.getItem('countryObj') ?? '{}') ?? {},
  setUserInfo: (v) => set({ userInfo: v }),
  setCountry: (v) => set({ country: v }),
  setAllCountryList: (v) => set({ allCountryList: v }),
  setCountryObj: (v) => set({ countryObj: v }),
}))


