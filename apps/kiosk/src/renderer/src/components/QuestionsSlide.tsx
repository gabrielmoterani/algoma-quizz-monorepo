import { useEffect, useState } from 'react'
import type { NewQuestion } from '../../../../../../packages/orm/types'

function QuestionsSlide({ questions }: { questions: NewQuestion[] }) {
  const [lastQuestion, setLastQuestion] = useState<NewQuestion | null>(null)

  useEffect(() => {
    const aux = questions.reverse()
    setLastQuestion(aux[0])
  }, [questions])

  return (
    <div className="flex flex-col h-full min-h-[500px] text-center justify-center items-center">
      <div className="w-full max-w-3xl">
        <div className="card">
          <div className="card-body text-center">
            <h2 className="text-3xl font-bold text-center mb-8">Last Question Answered</h2>
            {(() => {
              return (
                <>
                  <div className="p-6 rounded-lg space-y-4 mx-auto">
                    <div>
                      <h3 className="font-semibold text-lg text-primary">{lastQuestion?.title}</h3>
                      <p className="mt-2 text-base-content/70">{lastQuestion?.subtitle}</p>
                    </div>
                    <div className="divider" />
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-center">
                        <span className="text-sm font-medium">Correct Answer:</span>
                        <div className="ml-2 badge badge-neutral">
                          {lastQuestion?.correctAnswer}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionsSlide
