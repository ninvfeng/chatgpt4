import { For, Show, createSignal, onMount } from 'solid-js'
import { useStore } from '@nanostores/solid'
import { writeClipboard } from '@solid-primitives/clipboard'
import { useI18n } from '@/hooks'

import { platformSettingsUIList } from '@/stores/provider'
import { providerSettingsMap, setSettingsByProviderId, updateGeneralSettings } from '@/stores/settings'
import ThemeToggle from '../ui/ThemeToggle'
import ProviderGlobalSettings from './ProviderGlobalSettings'
import AppGeneralSettings from './AppGeneralSettings'
import type { GeneralSettings } from '@/types/app'
import type { User } from '@/types'

export default () => {
  const { t } = useI18n()
  const $providerSettingsMap = useStore(providerSettingsMap)
  // bug: someTimes providerSettingsMap() is {}
  const generalSettings = () => {
    return ($providerSettingsMap().general || {}) as unknown as GeneralSettings
  }

  const [user, setUser] = createSignal<User>({
    id: 0,
    email: '',
    nickname: '',
    times: 0,
    token: '',
    word: 0,
    share_code: '',
    inv_count: 0,
    inv_pay_count: 0,
    word_reward: 0,
    dir_inv_rate: 0,
  })

  onMount(async() => {
    const userJson = JSON.parse(localStorage.getItem('user') as string)
    setUser({ ...userJson })
  })

  return (
    <div class="h-full flex flex-col bg-sidebar">
      <header class="h-14 fi border-b border-base px-4 text-xs uppercase">
        {t('settings.title')}
      </header>
      <main class="flex-1 overflow-auto">
        <AppGeneralSettings
          settingsValue={() => generalSettings()}
          updateSettings={updateGeneralSettings}
        />
        <For each={platformSettingsUIList}>
          {item => (
            <ProviderGlobalSettings
              config={item}
              settingsValue={() => $providerSettingsMap()[item.id]}
              setSettings={v => setSettingsByProviderId(item.id, v)}
            />
          )}
        </For>
        <Show when={user().share_code && user().dir_inv_rate > 0}>
          <div class="mt-4 px-4 op-60 text-sm">
            <div>↓邀请好友充值可获得{user().dir_inv_rate * 100}%奖励</div>
            <div class="flex flex-col">
              <div onClick={() => { writeClipboard(`${location.origin}?code=${user().share_code}`) }} class="mt-1 inline-flex items-center justify-center gap-1 text-sm  bg-slate/20 px-2 py-1 rounded-md transition-colors cursor-pointer hover:bg-slate/50">
                {`${location.origin}?code=${user().share_code}`}
              </div>
              <div onClick={() => { writeClipboard(`${location.origin}?code=${user().share_code}`) }} class="mt-1 inline-flex items-center justify-center gap-1 text-sm  bg-slate/20 px-2 py-1 rounded-md transition-colors cursor-pointer hover:bg-slate/50">
                复制
              </div>
            </div>
            <div class="text-sm mt-1">
              <div>
                累计邀请人数:{user().inv_count}
              </div>
              <Show when={user().inv_pay_count > 0}>
                <div>
                  邀请付费人数:{user().inv_pay_count}
                </div>
              </Show>
              <Show when={user().word_reward > 0}>
                <div>
                  累计奖励字数:{user().word_reward}
                </div>
              </Show>
            </div>
          </div>
        </Show>
      </main>
      <footer class="h-14 fi justify-between px-3">
        <ThemeToggle />
        <div text-xs op-40 px-2>
          <a href="https://z0mjw1ejzdy.feishu.cn/docx/SO7Td80Tvo302JxogJkcnFL6n6b" target="_blank" rel="noreferrer" class="hv-foreground">
            使用说明
          </a>
          <span class="px-1"> · </span>
          <a href="https://github.com/ninvfeng/chatgpt4" target="_blank" rel="noreferrer" class="hv-foreground">
            Github
          </a>
        </div>
      </footer>
    </div>
  )
}
