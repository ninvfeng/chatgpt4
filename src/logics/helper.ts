import { getSettingsByProviderId } from '@/stores/settings'
import type { CallProviderPayload } from '@/types/provider'

export const generateRapidProviderPayload = (prompt: string, providerId: string) => {
  const payload = {
    conversationMeta: {
      id: 'temp',
      conversationType: 'rapid',
    },
    globalSettings: getSettingsByProviderId(providerId),
    providerId,
    prompt,
    historyMessages: [],
  } as CallProviderPayload
  return payload
}

export const promptHelper = {
  summarizeText: (text: string) => {
    return [
      '用少于10个字总结一个简短且相关的输入标题,直接输出标题，不要添加任何其他内容,输入为:',
      text,
    ].join('\n')
  },
}
