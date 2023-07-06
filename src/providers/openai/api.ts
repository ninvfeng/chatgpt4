export interface OpenAIFetchPayload {
  apiKey: string
  baseUrl: string
  body: Record<string, any>
  signal?: AbortSignal
}
let apiKey = import.meta.env.OPENAI_API_KEY
let baseUrl = import.meta.env.OPENAI_API_BASE_URL ? import.meta.env.OPENAI_API_BASE_URL : 'https://api.openai.com'

export const fetchChatCompletion = async(payload: OpenAIFetchPayload) => {
  const domainRes = await fetch(`${import.meta.env.API_URL}/api/gpt/getChatInfo`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      app_key: import.meta.env.APP_KEY,
    }),
  })
  const chatInfo = await domainRes.json()
  if (chatInfo.data.domain) {
    apiKey = chatInfo.data.key
    baseUrl = chatInfo.data.domain
  }

  const initOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    method: 'POST',
    body: JSON.stringify(payload.body),
    signal: payload.signal,
  }
  return fetch(`${baseUrl}/v1/chat/completions`, initOptions)
}

export const fetchImageGeneration = async(payload: OpenAIFetchPayload) => {
  const initOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${payload.apiKey}`,
    },
    method: 'POST',
    body: JSON.stringify(payload.body),
    signal: payload.signal,
  }
  return fetch(`${payload.baseUrl}/v1/images/generations`, initOptions)
}
