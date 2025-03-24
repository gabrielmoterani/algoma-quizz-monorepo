/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { create } from 'zustand'

export type Page = 'setup' | 'home' | 'scan' | 'register' | 'question' | 'result' | 'user'

interface PageStore {
  page: Page
  setPage: (page: Page) => void
  pagePayload: Record<string, unknown>
}

const usePageStore = create<PageStore>((set) => ({
  page: 'home',
  setPage: (page: Page) => set({ page }),
  pagePayload: {} as Record<string, unknown>
}))

export { usePageStore }
