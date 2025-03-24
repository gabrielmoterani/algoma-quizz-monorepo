import { ipcMain, app } from 'electron'
import jetpack from 'fs-jetpack'
import * as path from 'node:path'
import { getKioskData } from '../../../../packages/orm'

// Register IPC handlers for file operations
export const registerIpcHandlers = async (): Promise<void> => {
  // Handler for writing a key to a file
  ipcMain.handle('write-register-key', async (_event, filename: string, key: string) => {
    try {
      const dataPath = path.join(app.getPath('userData'), 'data')
      const filePath = path.join(dataPath, filename)
      console.log('DB TRY', key)
      const kioskData = await getKioskData(key)

      if (kioskData) {
        jetpack.write(filePath, kioskData)
        console.log(`Key successfully written to ${filePath}`)
        return true
      } else {
        console.log('Kiosk data not found')
        return false
      }
    } catch (error) {
      console.error(`Error writing key to file: ${error}`)
      return false
    }
  })

  // Handler for reading a key from a file
  ipcMain.handle('read-register-key', async (_event, filename: string) => {
    try {
      const filePath = path.join(app.getPath('userData'), 'data', filename)

      // Check if file exists and read it in one operation
      if (jetpack.exists(filePath) !== 'file') {
        console.log(`File does not exist: ${filePath}`)
        return null
      }

      // Read and return the key
      const key = jetpack.read(filePath)
      if (!key) {
        console.log('Key not found')
        return null
      }
      const kioskData = await getKioskData(key as string)
      if (kioskData) {
        return kioskData.id
      } else {
        console.log('Kiosk data not found')
        return null
      }
    } catch (error) {
      console.error(`Error reading key from file: ${error}`)
      return null
    }
  })
}
