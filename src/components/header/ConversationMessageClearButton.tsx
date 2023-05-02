import { useStore } from '@nanostores/solid'
import { currentConversationId } from '@/stores/conversation'
import { scrollController, showConversationEditModal } from '@/stores/ui'
import { clearMessagesByConversationId } from '@/stores/messages'

export default () => {
  const $currentConversationId = useStore(currentConversationId)

  const handleClearMessage = () => {
    clearMessagesByConversationId($currentConversationId())
    scrollController().scrollToBottom()
  }

  return (
    <>
      { $currentConversationId() && (
        <div class="flex">
          <div
            class="fcc p-2 rounded-md text-xl hv-foreground"
            onClick={handleClearMessage}
          >
            <div i-carbon-clean />
          </div>
          <div
            class="fcc p-2 rounded-md text-xl hv-foreground"
            onClick={() => showConversationEditModal.set(true)}
          >
            <div i-carbon-add />
          </div>
        </div>
      )}
    </>
  )
}
