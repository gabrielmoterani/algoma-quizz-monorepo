import { useRef } from 'react'
import VirtualKeyboard from '../renderer/src/components/VirtualKeyboard'
import { writeKeyToFile } from '../utils/registerHandler'
import toast from 'react-hot-toast'
import { useKioskStore } from '@/store'

function Setup(): JSX.Element {
  const kioskId = useRef<HTMLInputElement>(null)
  const { setKioskId } = useKioskStore((state) => state)

  const handleRegister = async () => {
    const loading = toast.loading('Registering kiosk...')
    try {
      const result = await writeKeyToFile(kioskId.current?.value as string)
      if (result) {
        setKioskId(kioskId.current?.value as string)
        toast.success('Kiosk registered successfully')
      } else {
        toast.error('Failed to register kiosk')
      }
    } catch (error) {
      console.error('Error registering kiosk:', error)
      toast.error('Failed to register kiosk')
    } finally {
      toast.dismiss(loading)
    }
  }

  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="flex flex-col gap-4 text-center justify-center items-center w-full">
          <h1>Setup</h1>
          <input
            type="text"
            className="text-center w-[500px] input"
            placeholder="Kiosk ID"
            ref={kioskId}
          />
          <button onClick={handleRegister} type="button" className="btn btn-lg btn-primary">
            Register
          </button>
        </div>
      </div>
      <VirtualKeyboard inputRefs={[kioskId]} />
    </>
  )
}

export default Setup
