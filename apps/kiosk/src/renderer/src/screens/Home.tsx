import { usePageStore } from '@/store'
import StartGameSlide from '../components/StartGameSlide'
import { useState, useEffect } from 'react'

function Home(): JSX.Element {
  const [slide, setSlide] = useState<JSX.Element>(<StartGameSlide />)
  const setPage = usePageStore((store) => store.setPage)

  useEffect(() => {
    setSlide(<StartGameSlide />)
  }, [])

  return (
    <div className="flex flex-col h-full w-full">
      <div className="h-[90%] w-full">{slide}</div>
      <div className="flex flex-col justify-end items-center h-[10%]">
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
