import { create } from 'zustand'

export type Page = 'setup' | 'home' | 'scan' | 'register' | 'question' | 'result' | 'user'

interface PageStore {
  page: Page
  setPage: (page: Page, payload?: Record<string, unknown>) => void
  pagePayload: Record<string, unknown>
}

const usePageStore = create<PageStore>((set) => ({
  page: 'home',
  setPage: (page: Page, payload?: Record<string, unknown>) => set({ page, pagePayload: payload }),
  pagePayload: {} as Record<string, unknown>
}))

export { usePageStore }
