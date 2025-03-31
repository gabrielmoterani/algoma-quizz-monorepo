/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NewAnswer, NewQuestion, NewStudent } from '../../../../packages/orm/types'
const KEY_FILENAME = 'register.txt'
const STUDENT_FILENAME = 'student.csv'
const QUESTION_FILENAME = 'question.csv'
const ANSWER_FILENAME = 'answer.csv'

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

export const writeNewQuestion = async (question: NewQuestion): Promise<boolean> => {
  try {
    // @ts-ignore
    const result = await window.electron.ipcRenderer.invoke(
      'write-csv-file',
      QUESTION_FILENAME,
      question
    )
    console.log(`Key write requested for ${QUESTION_FILENAME}`)
    if (!result) throw new Error('Failed to write key to file')
    return result
  } catch (error) {
    console.error(`Error requesting key write: ${error}`)
    return false
  }
}

export const retrieveQuestions = async (): Promise<NewQuestion[]> => {
  try {
    // @ts-ignore
    const csv = await window.electron.ipcRenderer.invoke('read-csv-file', QUESTION_FILENAME)
    return csv
  } catch (error) {
    console.error(`Error requesting key write: ${error}`)
    return []
  }
}

export const writeNewAnswer = async (answer: NewAnswer): Promise<boolean> => {
  try {
    // @ts-ignore
    const result = await window.electron.ipcRenderer.invoke(
      'write-csv-file',
      ANSWER_FILENAME,
      answer
    )
    console.log(`Key write requested for ${ANSWER_FILENAME}`)
    if (!result) throw new Error('Failed to write key to file')
    return result
  } catch (error) {
    console.error(`Error requesting key write: ${error}`)
    return false
  }
}

export const retrieveRanking = async (): Promise<Map<string, number>> => {
  try {
    // @ts-ignore
    const csv = (await window.electron.ipcRenderer.invoke(
      'read-csv-file',
      ANSWER_FILENAME
    )) as NewAnswer[]
    const students = new Set<string>([
      ...(csv.map((answer) => answer.studentId).filter((id) => id !== undefined) as string[])
    ])
    const ranking = new Map<string, number>()
    for (const answer of csv) {
      if (ranking.has(answer.studentId as string)) {
        const currentScore = ranking.get(answer.studentId as string) ?? 0
        ranking.set(answer.studentId as string, currentScore + (answer.isCorrectAnswer ? 1 : 0))
      } else {
        ranking.set(answer.studentId as string, 1)
      }
    }
    return new Map(
      [...students]
        .map((studentId): [string, number] => [studentId, ranking.get(studentId) ?? 0])
        .sort((a, b) => b[1] - a[1])
    )
  } catch (error) {
    console.error(`Error requesting key write: ${error}`)
    return new Map()
  }
}

export const retrieveRankingByStudent = async (studentId: string): Promise<number> => {
  try {
    // @ts-ignore
    const csv = await retrieveRanking()
    return csv.get(studentId) ?? 0
  } catch (error) {
    console.error(`Error requesting key write: ${error}`)
    return 0
  }
}

export const retrieveStudentUniqueAnswers = async (studentId: string): Promise<string[]> => {
  try {
    // @ts-ignore
    const csv = await window.electron.ipcRenderer.invoke('read-csv-file', ANSWER_FILENAME)
    const uniqueAnswers = (csv || [])
      .filter((answer: NewAnswer) => answer.studentId === studentId)
      .map((answer: NewAnswer) => answer.id)
    return [...new Set<string>(uniqueAnswers)]
  } catch (error) {
    console.error(`Error requesting key write: ${error}`)
    return []
  }
}
