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
  share_code: string
  inv_count: number
  inv_pay_count: number
  word_reward: number
  dir_inv_rate: number
}

export type ChatType = 'single' | 'continuous' | 'image'
