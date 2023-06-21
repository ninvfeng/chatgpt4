import { showConversationEditModal } from '@/stores/ui'
import { getBotMetaById } from '@/stores/provider'
import Button from '../ui/Button'
import Charge from './Charge'
import type { Conversation } from '@/types/conversation'
import type { User } from '@/types'
import type { Accessor, Setter } from 'solid-js'
interface Props {
  conversation: Conversation
  setUser: Setter<User>
  user: Accessor<User>
}

export default (props: Props) => {
  const botMeta = () => getBotMetaById(props.conversation.bot) || null
  return (
    <div>
      <div class="px-6 pb-2">
        <Charge
          setUser={props.setUser}
          user={props.user}
        />
      </div>
      <div class="flex h-full px-6 overflow-auto">
        <Button
          icon="i-carbon-settings-adjust text-sm"
          onClick={() => showConversationEditModal.set(true)}
          size="sm"
          variant="ghost"
        >
          <div class="inline-flex items-center gap-1">
            设置 {botMeta().label}
            {props.conversation.systemInfo && (
            <div class="text-xs px-1 border border-base-100 rounded-md op-40">设置预设角色</div>
            )}
          </div>
        </Button>
      </div>
    </div>

  )
}
