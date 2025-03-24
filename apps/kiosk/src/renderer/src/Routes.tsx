import { useEffect } from 'react'
import Home from '../../screens/Home'
import Question from '../../screens/Question'
import Register from '../../screens/Register'
import Result from '../../screens/Result'
import ScanCard from '../../screens/ScanCard'
import Setup from '../../screens/Setup'
import User from '../../screens/User'
import { usePageStore, useKioskStore } from '../../store'
import { readKeyFromFile } from '../../utils/registerHandler'

function Routes(): JSX.Element {
  const { page } = usePageStore((state) => state)
  const { kioskId, setKioskId } = useKioskStore((state) => state)

  useEffect(() => {
    const getKey = async (): Promise<void> => {
      const key = await readKeyFromFile()
      if (key) {
        setKioskId(key)
      }
    }
    getKey()
  }, [])

  if (!kioskId) {
    return <Setup />
  }

  switch (page) {
    case 'setup':
      return <Setup />
    case 'home':
      return <Home />
    case 'scan':
      return <ScanCard />
    case 'register':
      return <Register />
    case 'question':
      return <Question />
    case 'result':
      return <Result />
    case 'user':
      return <User />
    default:
      return <Home />
  }
}

export default Routes
