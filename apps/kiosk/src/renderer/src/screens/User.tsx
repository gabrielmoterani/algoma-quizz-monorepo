import {
  retrieveQuestions,
  retrieveRanking,
  retrieveStudentUniqueAnswers
} from '@/utils/registerHandler'
import { useEffect, useState } from 'react'
import type { NewQuestion } from '../../../../../../packages/orm/types'
import toast from 'react-hot-toast'
import { usePageStore } from '@/store'

function User(): JSX.Element {
  const { setPage, pagePayload } = usePageStore((store) => store)
  const [position, setPosition] = useState<number>(0)
  const [notAbleToGetPosition, setNotAbleToGetPosition] = useState<boolean>(false)
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState<
    {
      question: NewQuestion
      answer: string | undefined
    }[]
  >([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchStudent = async () => {
      setIsLoading(true)

      console.log(pagePayload)
      try {
        if (!pagePayload?.studentId) {
          toast.error('Student ID is undefined')
          setPage('home')
          return
        }
        const answeredQuestions = await retrieveStudentUniqueAnswers(
          pagePayload?.studentId as string
        )
        const questions = await retrieveQuestions()
        const questionsWithAnswers = questions
          .filter((question: NewQuestion) => question.id !== undefined)
          .filter((question: NewQuestion) => new Date(question.endDate as string) > new Date())
          .map((question: NewQuestion) => {
            const answer = answeredQuestions.find((answer: string) => answer === question.id)
            return { question, answer }
          })
        setQuestionsWithAnswers(questionsWithAnswers)
      } catch (error) {
        toast.error('Failed to get questions')
        console.error(error)
      }

      try {
        const ranking = [...((await retrieveRanking()) || [])]
        if (ranking.length === 0) {
          setNotAbleToGetPosition(true)
        } else {
          const position = ranking.findIndex((student) => student[0] === pagePayload?.studentId)
          setPosition(position + 1)
        }
      } catch (error) {
        toast.error('Failed to get ranking')
        console.error(error)
      }
      setIsLoading(false)
    }
    fetchStudent()
  }, [pagePayload?.studentId])

  return (
    <div className="min-h-screen p-6 overflow-y-auto overflow-x-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Navigation */}
          <div className="w-full flex justify-end">
            <button type="button" className="btn btn-ghost" onClick={() => setPage('home')}>
              ← Back to Home
            </button>
          </div>

          {/* Ranking Banner */}
          <div className="w-full text-center p-4 rounded-lg bg-base-100 shadow-xl space-y-2">
            {notAbleToGetPosition ? (
              <h2 className="text-2xl font-bold text-base-content/70">
                Ranking position not available yet
              </h2>
            ) : (
              <h2 className="text-3xl font-bold text-primary">
                Current Ranking Position: #{position + 1}
              </h2>
            )}
            <div className="text-lg text-base-content/80">
              Questions Answered:{' '}
              {questionsWithAnswers.filter((qa) => qa.answer !== undefined).length}
            </div>
          </div>

          {/* Last Answered Question */}
          {questionsWithAnswers.length > 0 && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl">Last Question Status</h2>
                {(() => {
                  const lastQuestion = questionsWithAnswers[questionsWithAnswers.length - 1]
                  const isCorrectAnswer =
                    lastQuestion.answer === lastQuestion.question.correctAnswer
                  return (
                    <>
                      <div className="bg-base-200 p-6 rounded-lg space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg text-primary">
                            {lastQuestion.question.title}
                          </h3>
                          <p className="mt-2 text-base-content/70">
                            {lastQuestion.question.subtitle}
                          </p>
                        </div>

                        <div className="divider" />

                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Correct Answer:</span>
                            <div className="badge badge-neutral">
                              {lastQuestion.question.correctAnswer}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <div
                            className={`alert ${
                              isCorrectAnswer ? 'alert-success' : 'alert-error'
                            } flex items-center justify-between`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrectAnswer ? (
                                // biome-ignore lint/a11y/noSvgWithoutTitle: Not a web application
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              ) : (
                                // biome-ignore lint/a11y/noSvgWithoutTitle: Not a web application
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              )}
                              <span className="font-medium">
                                {isCorrectAnswer ? 'Correct Answer!' : 'Incorrect Answer'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}

          {/* All Questions */}
          {/* <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">All Available Answers</h2>
              <div className="space-y-4">
                {questionsWithAnswers.map((qa) => (
                  <div
                    key={qa.question.id}
                    className="bg-base-200 p-4 rounded-lg hover:bg-base-300 transition-colors"
                  >
                    <h3 className="font-semibold">{qa.question.title}</h3>
                    <p className="mt-1 text-base-content/70">{qa.question.subtitle}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="badge badge-success">{qa.question.correctAnswer}</div>
                    </div>
                  </div>
                ))}
                {questionsWithAnswers.length === 0 && (
                  <div className="text-center py-8 text-base-content/60">
                    No questions available at the moment
                  </div>
                )}
              </div>
            </div>
          </div> */}
        </div>
      )}
    </div>
  )
}

export default User
