import { useRef } from 'react'
import VirtualKeyboard from '../components/VirtualKeyboard'
import { usePageStore } from '@/store'

function ScanCard(): JSX.Element {
  const emailInputRef = useRef<HTMLInputElement>(null)
  const studentIdCardInputRef = useRef<HTMLInputElement>(null)
  const setPage = usePageStore((state) => state.setPage)

  const handleSubmit = () => {
    setPage('register', {
      email: emailInputRef.current?.value,
      studentIdCard: studentIdCardInputRef.current?.value
    })
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex w-full flex-col border-opacity-50 flex-grow">
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: No need to focus on the input */}
        <div
          onClick={() => studentIdCardInputRef.current?.focus()}
          className="card rounded-box grid h-20 place-items-center font-extrabold"
        >
          Scan your student card
        </div>
        <input
          type="text"
          placeholder="Student ID"
          className="hidden"
          ref={studentIdCardInputRef}
        />
        <div className="divider">OR</div>
        <div className="card rounded-box grid h-20 place-items-center">Type your email</div>
        <div className="flex flex-col justify-end items-center h-[10%]">
          <input
            ref={emailInputRef}
            type="text"
            placeholder="Email"
            className="input input-bordered w-[400px]"
          />
        </div>
      </div>
      <div className="flex flex-col justify-end items-center mt-10">
        <button onClick={handleSubmit} className="btn btn-warning btn-sm w-[400px]" type="button">
          Start
        </button>
      </div>
      <VirtualKeyboard inputRefs={[emailInputRef, studentIdCardInputRef]} />
    </div>
  )
}

export default ScanCard
