import {
  retrieveQuestions,
  retrieveStudentUniqueAnswers,
  writeNewAnswer
  // writeNewQuestion
} from '@/utils/registerHandler'
import { useEffect, useState } from 'react'
import type { NewQuestion } from '../../../../../../packages/orm/types'
import { usePageStore } from '@/store'
import toast from 'react-hot-toast'

function Question(): JSX.Element {
  const [question, setQuestion] = useState<NewQuestion | null>(null)
  const [options, setOptions] = useState<string[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const { setPage, pagePayload } = usePageStore((store) => store)
  const [isSending, setIsSending] = useState(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: Not needed here
  useEffect(() => {
    const fetchQuestion = async () => {
      setIsFetching(true)
      try {
        const questions = await retrieveQuestions()
        const aux = questions.filter((x) => new Date(x.endDate as string) > new Date())
        const uniqueAnswers = await retrieveStudentUniqueAnswers(pagePayload.studentId as string)
        const question = aux
          .reverse()
          .find((question) => !uniqueAnswers.includes(question.id as string))
        if (question) {
          setQuestion(question)
          const parsedOptions =
            typeof question.options === 'string' ? JSON.parse(question.options) : question.options
          setOptions(parsedOptions as string[])
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsFetching(false)
      }
    }
    fetchQuestion()
  }, [])

  const handleOptionClick = async (option: string) => {
    if (isSending) return
    setIsSending(true)
    const toastId = toast.loading('Checking answer, just a moment...')
    const isCorrect = option === question?.correctAnswer
    try {
      await writeNewAnswer({
        id: question?.id,
        studentId: pagePayload.studentId as string,
        selectedAnswer: option,
        isCorrectAnswer: isCorrect
      })
      console.log('Answer is correct', isCorrect)
      toast.success('Answer saved')
      setPage('result', {
        studentId: pagePayload.studentId
      })
    } catch (error) {
      console.error(error)
      toast.error('Failed to save answer')
    } finally {
      setIsSending(false)
      toast.dismiss(toastId)
    }
  }

  if (isFetching) return <>Loading Question...</>
  if (!question)
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="alert alert-primary mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <title>Warning</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>There are no questions available.</div>
        </div>
        <button className="btn btn-warning mt-10" type="button" onClick={() => setPage('home')}>
          Go back
        </button>
      </div>
    )

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Question Header */}
          <h2 className="card-title text-2xl font-bold text-primary mb-2">{question.title}</h2>
          {question.subtitle && (
            <p className="text-base-content/70 mb-6 italic">{question.subtitle}</p>
          )}

          {/* Options */}
          <div className="flex flex-col gap-4">
            {options?.map((option: string, index: number) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: Index is not unique
                key={index}
                disabled={isSending}
                type="button"
                className="btn btn-outline hover:btn-primary transition-all duration-200 text-left normal-case h-auto py-4 px-6"
                onClick={() => handleOptionClick(option)}
              >
                <span className="font-mono mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="card-actions justify-between mt-8">
            <button
              disabled={isSending}
              type="button"
              className="btn btn-ghost"
              onClick={() => setPage('home')}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Question
