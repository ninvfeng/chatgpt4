// TODO: Delete this file
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ErrorMessage {
  code: string
  message: string
}

export interface User {
  id: number
  email: string
  nickname: string
  times: number
  token: string
  word: number
}

export type ChatType = 'single' | 'continuous' | 'image'
