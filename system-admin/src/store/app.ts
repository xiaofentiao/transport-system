import { create } from 'zustand'

type AppState = {
  collapsed: boolean
  activeId: string
  setCollapsed: (v: boolean) => void
  setActiveId: (v: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  collapsed: false,
  activeId: '-1',
  setCollapsed: (v) => set({ collapsed: v }),
  setActiveId: (v) => set({ activeId: v }),
}))
