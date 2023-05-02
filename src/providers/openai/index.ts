import {
  handleContinuousPrompt,
  handleImagePrompt,
  handleRapidPrompt,
  handleSinglePrompt,
} from './handler'
import type { Provider } from '@/types/provider'

const providerOpenAI = () => {
  const provider: Provider = {
    id: 'provider-openai',
    icon: 'i-simple-icons-openai', // @unocss-include
    name: 'OpenAI',
    globalSettings: [
      // {
      //   key: 'apiKey',
      //   name: 'API Key',
      //   type: 'api-key',
      // },
      // {
      //   key: 'baseUrl',
      //   name: 'Base URL',
      //   description: 'Custom base url for OpenAI API.',
      //   type: 'input',
      //   default: 'https://api.openai.com',
      // },
      {
        key: 'model',
        name: 'ChatGPT版本',
        description: 'ChatGPT版本',
        type: 'select',
        options: [
          // { value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo' },
          { value: 'gpt-4', label: 'gpt-4' },
        ],
        default: 'gpt-4',
      },
      {
        key: 'maxTokens',
        name: '最大字数',
        description: '目前GPT4最大输入输出字数约4000字(8K token),调小可节省消耗',
        type: 'slider',
        min: 100,
        max: 4000,
        default: 2000,
        step: 1,
      },
      {
        key: 'temperature',
        name: '温度',
        type: 'slider',
        description: '在0到2之间。较高的值如0.8会使输出更随机更具创意,而较低的值如0.2会使其更集中和确定性',
        min: 0,
        max: 2,
        default: 0.5,
        step: 0.01,
      },
      {
        key: 'authToken',
        name: '认证信息',
        type: 'api-key',
        description: '认证信息,无需修改',
        default: localStorage.getItem('token') as string,
      },
      // {
      //   key: 'top_p',
      //   name: 'Top P',
      //   description: 'An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.',
      //   type: 'slider',
      //   min: 0,
      //   max: 1,
      //   default: 1,
      //   step: 0.01,
      // },
    ],
    conversationSettings: [],
    supportConversationType: ['continuous', 'single'],
    handleSinglePrompt,
    handleContinuousPrompt,
    handleImagePrompt,
    handleRapidPrompt,
  }
  return provider
}

export default providerOpenAI
