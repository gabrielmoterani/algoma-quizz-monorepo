import { useMemo } from 'react'
import type { NewTip } from '../../../../../../packages/orm/types'

function TipsSlide({ tips }: { tips: NewTip[] }) {
  const randomTip = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * tips.length)
    return tips[randomIndex]
  }, [tips])

  return (
    <div className="flex flex-col h-full min-h-[500px] text-center justify-center items-center">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-8">Tip of the Day</h2>
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-4">
                <h3 className="text-xl font-semibold">{randomTip.title}</h3>
              </div>
              <p className="text-lg">{randomTip.subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TipsSlide
