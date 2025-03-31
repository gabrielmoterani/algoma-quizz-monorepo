import { usePageStore } from '@/store'
import VirtualKeyboard from '../components/VirtualKeyboard'
import { useEffect, useRef, useState } from 'react'
import { findStudent, writeNewStudent } from '@/utils/registerHandler'
import toast from 'react-hot-toast'
import { COURSE_LIST } from '@/utils/courses'

function Register(): JSX.Element {
  const { pagePayload, setPage } = usePageStore((state) => state)
  const [loading, setLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  // Create refs for each input field
  const nickNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const ageRef = useRef<HTMLInputElement>(null)
  const courseRef = useRef<HTMLSelectElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    const toastId = toast.loading('Saving data...')
    try {
      const student = await writeNewStudent({
        cardData: pagePayload?.studentIdCard,
        email: emailRef.current?.value,
        nickName: nickNameRef.current?.value,
        age: Number.parseInt(ageRef.current?.value as string),
        course: courseRef.current?.value
      })
      console.log(student)
      toast.success('You are ready to play!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to save data')
    }
    setIsSending(false)
    toast.dismiss(toastId)
    setPage('question', {
      studentId: pagePayload?.studentIdCard || pagePayload?.email
    })
  }

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true)
      const student = await findStudent(
        (pagePayload?.email as string) || (pagePayload?.studentIdCard as string)
      )
      if (student) {
        setTimeout(() => {
          setPage('question', {
            studentId: pagePayload?.studentIdCard || pagePayload?.email
          })
          setLoading(false)
        }, 1000)
      } else {
        setLoading(false)
      }
    }
    fetchStudent()
  }, [pagePayload?.email, pagePayload?.studentIdCard, setPage])

  if (loading)
    return (
      <div>
        Checking student...
        <span className="ml-2 loading loading-spinner loading-xs" />
      </div>
    )
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      {/* Warning Alert */}
      <div className="alert alert-primary mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
          aria-label="Warning"
          role="img"
        >
          <title>Warning</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 className="font-bold">Data Collection Notice</h3>
          <p className="text-sm">
            Your data is protected and used only for the purpose of the game and research.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label" htmlFor="nickName">
            <span className="label-text">Nick Name</span>
          </label>
          <input
            type="text"
            id="nickName"
            ref={nickNameRef}
            placeholder="Enter your nick name"
            className="input input-bordered w-full"
            required
          />
          <label className="label" htmlFor="nickName">
            <span className="label-text-alt">
              This name will appear on the leaderboard ranking system
            </span>
          </label>
        </div>
        <div className="form-control">
          <label className="label" htmlFor="email">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            placeholder="Enter your email"
            className="input input-bordered w-full"
            defaultValue={(pagePayload?.email as string) || ''}
            disabled={!!pagePayload?.email}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label" htmlFor="age">
              <span className="label-text">Age</span>
            </label>
            <input
              type="number"
              id="age"
              ref={ageRef}
              placeholder="Enter your age"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="course">
              <span className="label-text">Course</span>
            </label>
            <select id="course" ref={courseRef} className="select select-bordered w-full" required>
              {COURSE_LIST.map((course) => (
                <option key={course.value} value={course.value}>
                  {course.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button disabled={isSending} type="submit" className="btn btn-warning w-full mt-6">
          {isSending ? 'Saving...' : 'Register'}
        </button>
      </form>

      <VirtualKeyboard inputRefs={[nickNameRef, emailRef, ageRef]} />
    </div>
  )
}

export default Register
