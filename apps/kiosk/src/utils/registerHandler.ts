/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NewStudent } from '../../../../packages/orm/types'
const KEY_FILENAME = 'register.txt'
const STUDENT_FILENAME = 'student.csv'

export const writeKeyToFile = async (key: string): Promise<boolean> => {
  try {
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

export const readKeyFromFile = async (): Promise<string | undefined> => {
  try {
    // @ts-ignore
    const key = await window.electron.ipcRenderer.invoke('read-register-key', KEY_FILENAME)
    if (key) {
      if (key) {
        console.log(`Key successfully read from ${KEY_FILENAME}`)
        return key
      }
      console.log(`Key not found in ${KEY_FILENAME}`)
      return undefined
    }
  } catch (error) {
    console.error(`Error reading key from file: ${error}`)
    return undefined
  }
}

export const writeNewStudent = async (student: NewStudent): Promise<boolean> => {
  try {
    // @ts-ignore
    const result = await window.electron.ipcRenderer.invoke(
      'write-csv-file',
      STUDENT_FILENAME,
      student
    )
    console.log(`Key write requested for ${STUDENT_FILENAME}`)
    if (!result) throw new Error('Failed to write key to file')
    return result
  } catch (error) {
    console.error(`Error requesting key write: ${error}`)
    return false
  }
}

export const findStudent = async (id: string): Promise<NewStudent | undefined> => {
  try {
    // @ts-ignore
    const csv = await window.electron.ipcRenderer.invoke('read-csv-file', STUDENT_FILENAME)
    console.log(`Key write requested for ${STUDENT_FILENAME}`)
    if (!csv) throw new Error('Failed to write key to file')
    return csv.find((student: NewStudent) => student.email === id || student.cardData === id)
  } catch (error) {
    console.error(`Error requesting key write: ${error}`)
    return undefined
  }
}
