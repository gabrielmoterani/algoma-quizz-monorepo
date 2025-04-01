/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NewAnswer, NewQuestion, NewStudent, NewTip } from '../../../../packages/orm/types'
const KEY_FILENAME = 'register.txt'
const STUDENT_FILENAME = 'student.csv'
const QUESTION_FILENAME = 'question.csv'
const ANSWER_FILENAME = 'answer.csv'
const TIP_FILENAME = 'tip.csv'

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
    const ranking = new Map<string, number>()
    for (const answer of csv) {
      if (ranking.has(answer.studentId as string)) {
        const currentScore = ranking.get(answer.studentId as string) ?? 0
        ranking.set(answer.studentId as string, currentScore + (answer.isCorrectAnswer ? 1 : 0))
      } else {
        ranking.set(answer.studentId as string, 1)
      }
    }

    // Convert IDs to names
    const rankingWithNames = new Map<string, number>()
    for (const [studentId, score] of ranking) {
      const student = await findStudent(studentId)
      const name = student ? student.nickName : studentId // fallback to ID if student not found
      rankingWithNames.set(name as string, score)
    }

    return new Map([...rankingWithNames.entries()].sort((a, b) => b[1] - a[1]))
  } catch (error) {
    console.error(`Error requesting key write: ${error}`)
    return new Map()
  }
}

export const retrieveRankingByStudent = async (studentId: string): Promise<number> => {
  try {
    // @ts-ignore
    const csv = (await window.electron.ipcRenderer.invoke(
      'read-csv-file',
      ANSWER_FILENAME
    )) as NewAnswer[]
    const ranking = new Map<string, number>()
    for (const answer of csv) {
      if (ranking.has(answer.studentId as string)) {
        const currentScore = ranking.get(answer.studentId as string) ?? 0
        ranking.set(answer.studentId as string, currentScore + (answer.isCorrectAnswer ? 1 : 0))
      } else {
        ranking.set(answer.studentId as string, 1)
      }
    }

    const sortedRanking = [...ranking.entries()].sort((a, b) => b[1] - a[1])
    console.log(sortedRanking)
    const position = sortedRanking.findIndex(([key]) => key === studentId)
    console.log(position)
    return position > -1 ? position + 1 : sortedRanking.length + 1
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

export const writeNewTip = async (tip: NewTip): Promise<boolean> => {
  try {
    // @ts-ignore
    const result = await window.electron.ipcRenderer.invoke('write-csv-file', TIP_FILENAME, tip)
    console.log(`Key write requested for ${TIP_FILENAME}`)
    if (!result) throw new Error('Failed to write key to file')
    return result
  } catch (error) {
    console.error(`Error requesting key write: ${error}`)
    return false
  }
}

export const retrieveTips = async (): Promise<NewTip[]> => {
  try {
    // @ts-ignore
    const csv = await window.electron.ipcRenderer.invoke('read-csv-file', TIP_FILENAME)
    return csv
  } catch (error) {
    console.error(`Error requesting key write: ${error}`)
    return []
  }
}
