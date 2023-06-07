import { For, Show, onMount } from 'solid-js'
import { useStore } from '@nanostores/solid'
import { conversationMapSortList, currentConversationId } from '@/stores/conversation'
import { showConversationEditModal } from '@/stores/ui'
import { getSettingsByProviderId, setSettingsByProviderId } from '@/stores/settings'
import Login from './Login'
import Charge from './Charge'
import type { User } from '@/types'
import type { Accessor, Setter } from 'solid-js'

interface Props {
  setIsLogin: Setter<boolean>
  isLogin: Accessor<boolean>
  setUser: Setter<User>
  user: Accessor<User>
}

export default (props: Props) => {
  const $conversationMapSortList = useStore(conversationMapSortList)

  onMount(async() => {
    try {
      // 读取token
      if (localStorage.getItem('token')) {
        props.setIsLogin(true)
        const response = await fetch('/api/info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: localStorage.getItem('token'),
          }),
        })
        const responseJson = await response.json()
        if (responseJson.code === 200) {
          localStorage.setItem('user', JSON.stringify(responseJson.data))
          props.setUser(responseJson.data)
          setTimeout(() => {
            const setting = getSettingsByProviderId('provider-openai')
            setSettingsByProviderId('provider-openai', {
              authToken: localStorage.getItem('token') as string,
              maxTokens: setting.maxTokens,
              model: setting.model,
              temperature: setting.temperature,
            })
          }, 1000)
        } else {
          props.setIsLogin(false)
        }
      } else {
        props.setIsLogin(false)
      }
    } catch (err) {
      console.error(err)
    }
  })

  return (
    <div class="flex h-full pt-10">
      <div class="flex flex-col w-full max-w-md mx-12 sm:mx-18 overflow-hidden space-y-2">

        <Show when={!props.isLogin()}>
          <div class="fi">
            <span class="text-(2xl transparent) font-extrabold bg-(clip-text gradient-to-r) from-sky-400 to-emerald-600">ChatGPT 4.0</span>
          </div>
          <div mt-1 op-60>欢迎来到人工智能时代</div>
          <div op-60>验证邮箱开始使用</div>
          <Login
            setIsLogin={props.setIsLogin}
            setUser={props.setUser}
          />
        </Show>

        <Show when={props.isLogin()}>
          <Charge
            setUser={props.setUser}
            user={props.user}
          />
          <a href="https://z0mjw1ejzdy.feishu.cn/docx/SO7Td80Tvo302JxogJkcnFL6n6b" target="_blank" class="fi gap-2 h-8 text-sm op-60" rel="noreferrer">查看使用说明</a>
          <div class="px-6 py-4 bg-base-100 border border-base rounded-lg">
            <h2 class="text-xs op-30 uppercase my-2">最近对话</h2>
            <div class="flex flex-col items-start">
              <For each={$conversationMapSortList().slice(0, 3)}>
                {instance => (
                  <div class="fi gap-2 h-8 max-w-full text-sm hv-foreground" onClick={() => currentConversationId.set(instance.id)}>
                    <div class={instance.icon || 'i-carbon-chat'} />
                    <div class="flex-1 truncate">{instance.name || 'Untitled'}</div>
                  </div>
                )}
              </For>
              <Show when={!$conversationMapSortList().length}>
                <div class="fi gap-2 h-8 text-sm op-20">最近暂无对话</div>
              </Show>
            </div>
          </div>

          <div
            class="fcc gap-2 p-6 bg-base-100 hv-base border border-base rounded-lg"
            onClick={() => showConversationEditModal.set(true)}
          >
            <div class="i-carbon-add" />
            <div class="flex-1 text-sm truncate">新对话</div>
          </div>
        </Show>
      </div>
    </div>
  )
}
