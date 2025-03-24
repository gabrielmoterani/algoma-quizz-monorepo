/* eslint-disable @typescript-eslint/ban-ts-comment */
// For Electron renderer process

// Fixed path for Electron (will be resolved in the main process)
const KEY_FILENAME = 'register.txt'

export const writeKeyToFile = async (key: string): Promise<boolean> => {
  try {
    // Use IPC to ask the main process to write the file
    // @ts-ignore
    const result = await window.electron.ipcRenderer.invoke('write-register-key', KEY_FILENAME, key)
    console.log(`Key write requested for ${KEY_FILENAME}`)
    if (!result) throw new Error('Failed to write key to file')
    return result
  } catch (error) {
    console.error(`Error requesting key write: ${error}`)
    return false
  }
}

export const readKeyFromFile = async (): Promise<string | null> => {
  try {
    // Use IPC to ask the main process to read the file
    // @ts-ignore
    const key = await window.electron.ipcRenderer.invoke('read-register-key', KEY_FILENAME)
    if (key) {
      console.log(`Key successfully read from ${KEY_FILENAME}`)
      return key
    } else {
      console.log(`Key not found in ${KEY_FILENAME}`)
      return null
    }
  } catch (error) {
    console.error(`Error reading key from file: ${error}`)
    return null
  }
}
