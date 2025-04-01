import { ipcMain, app } from 'electron'
import jetpack from 'fs-jetpack'
import * as path from 'node:path'
import { getKioskData } from '../../../../packages/orm'
import { parse, stringify } from 'csv'
import { createReadStream, createWriteStream } from 'node:fs'

// Register IPC handlers for file operations
export const registerIpcHandlers = async (): Promise<void> => {
  // Handler for writing a key to a file
  ipcMain.handle('write-register-key', async (_event, filename: string, key: string) => {
    try {
      const dataPath = path.join(app.getPath('userData'), 'data')
      const filePath = path.join(dataPath, filename)
      console.log('DB TRY', key)
      const kioskData = await getKioskData(key)
      console.log('DB TRY', kioskData)

      if (kioskData) {
        jetpack.write(filePath, kioskData)
        console.log(`Key successfully written to ${filePath}`)
        return true
        // biome-ignore lint/style/noUselessElse: Not needed
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
    const filePath = path.join(app.getPath('userData'), 'data', filename)
    try {
      // Check if file exists and read it in one operation
      if (jetpack.exists(filePath) !== 'file') {
        console.log(`File does not exist: ${filePath}`)
        return null
      }

      // Read and return the key
      const kioskyData = jetpack.read(filePath)
      console.log('KIOSKY DATA', kioskyData)
      const { id: key } = JSON.parse(kioskyData as string)
      if (!key) {
        console.log('Key not found')
        return null
      }
      console.log('filePath', filePath)
      const kioskData = await getKioskData(key)
      if (kioskData) {
        return kioskData.id
        // biome-ignore lint/style/noUselessElse: Not needed
      } else {
        console.log('Kiosk data not found')
        return null
      }
    } catch (error) {
      console.error(`BACKEND ERROR: Error reading key from file: ${error}`)
      if (jetpack.exists(filePath) === 'file') {
        jetpack.remove(filePath)
        console.log(`File successfully deleted: ${filePath}`)
      }
      return null
    }
  })

  ipcMain.handle('read-csv-file', async (_event, filename: string) => {
    try {
      const filePath = path.join(app.getPath('userData'), 'data', filename)
      // biome-ignore lint/suspicious/noExplicitAny: Any type is allowed
      const records: any[] = []

      if (jetpack.exists(filePath) !== 'file') {
        console.log(`File does not exist: ${filePath}`)
        return null
      }

      return new Promise((resolve, reject) => {
        createReadStream(filePath)
          .pipe(
            parse({
              columns: true,
              skip_empty_lines: true
            })
          )
          .on('data', (record) => records.push(record))
          .on('end', () => resolve(records))
          .on('error', reject)
      })
    } catch (error) {
      console.error(`Error reading CSV file: ${error}`)
      return null
    }
  })

  // biome-ignore lint/suspicious/noExplicitAny: Any type is allowed
  ipcMain.handle('write-csv-file', async (_event, filename: string, data: any[]) => {
    try {
      const filePath = path.join(app.getPath('userData'), 'data', filename)
      const fileExists = jetpack.exists(filePath) === 'file'

      const aux = Array.isArray(data) ? data : [data]

      return new Promise((resolve, reject) => {
        stringify(aux, {
          header: !fileExists, // Only include header if file doesn't exist
          columns: Object.keys(aux[0])
        })
          .pipe(createWriteStream(filePath, { flags: 'a' })) // 'a' flag for append mode
          .on('finish', () => resolve(true))
          .on('error', reject)
      })
    } catch (error) {
      console.error(`Error writing CSV file: ${error}`)
      return false
    }
  })
}
