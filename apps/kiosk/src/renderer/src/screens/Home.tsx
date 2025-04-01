import { usePageStore } from '@/store'
import StartGameSlide from '../components/StartGameSlide'
import { useState, useEffect, useCallback, useRef } from 'react'
import type { NewQuestion, NewTip } from '../../../../../../packages/orm/types'
import { retrieveQuestions, retrieveTips, retrieveRanking } from '@/utils/registerHandler'
import TipsSlide from '../components/TipsSlide'
import QuestionsSlide from '../components/QuestionsSlide'
import RankingSlide from '../components/RankingSlide'

function Home(): JSX.Element {
  const [slide, setSlide] = useState<JSX.Element>(<StartGameSlide />)
  const setPage = usePageStore((store) => store.setPage)
  const [tips, setTips] = useState<NewTip[]>([])
  const [questions, setQuestions] = useState<NewQuestion[]>([])
  const [ranking, setRanking] = useState<Map<string, number>>(new Map())
  const currentSlideIndex = useRef(0)
  const TIMER = 10000

  // Add progress state
  const [progress, setProgress] = useState(0)
  const progressInterval = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setSlide(<StartGameSlide />)
    getTips()
    getQuestions()
    getRanking()
  }, [])

  const getTips = async () => {
    const tips = await retrieveTips()
    setTips(tips || [])
  }

  const getQuestions = async () => {
    const questions = await retrieveQuestions()
    setQuestions(questions.filter((x) => new Date(x.endDate as string) < new Date()))
  }

  const getRanking = async () => {
    const ranking = await retrieveRanking()
    setRanking(ranking || new Map())
  }

  const slides = useCallback(() => {
    return [
      <StartGameSlide key={'slide_1'} />,
      tips.length > 0 ? <TipsSlide tips={tips as NewTip[]} key={'slide_2'} /> : null,
      questions.length > 0 ? <QuestionsSlide questions={questions} key={'slide_3'} /> : null,
      ranking.size > 0 ? <RankingSlide ranking={ranking} key={'slide_4'} /> : null
    ].filter((item) => item !== null)
  }, [tips, questions, ranking])

  // Modify the auto-sliding useEffect
  useEffect(() => {
    const slideArray = slides()
    if (slideArray.length === 0) return

    const timer = setInterval(() => {
      currentSlideIndex.current = (currentSlideIndex.current + 1) % slideArray.length
      setSlide(slideArray[currentSlideIndex.current])
      setProgress(0) // Reset progress when sliding
    }, TIMER)

    // Progress bar update
    progressInterval.current = setInterval(() => {
      setProgress((prev) => Math.min(prev + 100 / (TIMER / 100), 100))
    }, 100)

    // Set initial slide
    setSlide(slideArray[currentSlideIndex.current])

    return () => {
      clearInterval(timer)
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [slides])

  return (
    <div className="flex flex-col h-full w-full">
      <div className="h-[80vh] card w-[90%] mx-auto overflow-auto flex flex-col items-center justify-center relative">
        {slide}
        <div className="absolute bottom-4 flex gap-2">
          {slides().map((_, index) => (
            <div
              key={`indicator-${
                // biome-ignore lint/suspicious/noArrayIndexKey: Not needed
                index
              }`}
              className={`w-2 h-2 rounded-full opacity-50 ${
                index === currentSlideIndex.current ? 'bg-primary opacity-100' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 opacity-10">
          <div
            className="h-full bg-primary transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="h-[10vh] flex items-center justify-center w-full">
        <button
          onClick={() => setPage('scan')}
          className="btn btn-warning btn-lg w-[90%]"
          type="button"
        >
          Start Game
        </button>
      </div>
    </div>
  )
}

export default Home
