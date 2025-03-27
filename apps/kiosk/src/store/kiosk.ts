import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface KioskStore {
  kioskId: string | null
  setKioskId: (kioskId: string | null) => void
}

const useKioskStore = create<KioskStore>()(
  persist(
    (set) => ({
      kioskId: '',
      setKioskId: (kioskId) => set({ kioskId })
    }),
    { name: 'kiosk-store' }
  )
)

export { useKioskStore }
