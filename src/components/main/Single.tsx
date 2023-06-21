import { leading, throttle } from '@solid-primitives/scheduled'
import StreamableText from '../StreamableText'
import Charge from './Charge'
import type { Accessor, Setter } from 'solid-js'
import type { MessageInstance } from '@/types/message'
import type { User } from '@/types'
interface Props {
  conversationId: string
  messages: Accessor<MessageInstance[]>
  setUser: Setter<User>
  user: Accessor<User>
}

export default ({ conversationId, messages, user, setUser }: Props) => {
  let scrollRef: HTMLDivElement
  const messageInput = () => messages().length > 0 ? messages()[0] : null
  const messageOutput = () => messages().length > 1 ? messages()[1] : null

  const instantScrollToBottomThrottle = leading(throttle, (element: HTMLDivElement) => element.scrollTo({ top: element.scrollHeight }), 250)

  const handleStreamableTextUpdate = () => {
    instantScrollToBottomThrottle(scrollRef)
  }

  return (
    <div class="flex flex-col h-full">
      <div class="px-6">
        <Charge
          setUser={setUser}
          user={user}
        />
      </div>
      <div class="px-6 text-gray-500 text-xs mt-2">
        注意:单次对话模式新问题将直接覆盖老问题
      </div>
      <div class="flex-[1] border-b border-base p-6 break-words overflow-y-scroll">
        <StreamableText
          class="mx-auto"
          text={messageInput()?.content || ''}
        />
      </div>
      <div class="scroll-list flex-[2] p-6 break-words overflow-y-scroll" ref={scrollRef!}>
        <StreamableText
          class="mx-auto"
          text={messageOutput()?.content || ''}
          streamInfo={messageOutput()?.stream
            ? () => ({
                conversationId,
                messageId: messageOutput()?.id || '',
                handleStreaming: handleStreamableTextUpdate,
              })
            : undefined}
        />
      </div>
    </div>
  )
}
