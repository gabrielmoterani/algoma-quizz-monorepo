/* eslint-disable @typescript-eslint/ban-ts-comment */
import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): JSX.Element {
  // @ts-ignore
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <img alt="logo" className="w-10 h-10" src={electronLogo} />
      <div className="creator !text-red-400">Powered by electron-vite</div>
      <div className="text !text-sm">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          {/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions />
    </>
  )
}

export default App
