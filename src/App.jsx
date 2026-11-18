import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { MainTabPager } from './components/nav/MainTabPager'
import { ChatRoom } from './components/chat/ChatRoom'
import { PhoneFrame } from './components/PhoneFrame'
import { useApp } from './context/AppContext'
import { HomePage } from './pages/HomePage'
import { MatchmakerPage } from './pages/MatchmakerPage'
import { MessagesPage } from './pages/MessagesPage'
import { MePage } from './pages/MePage'
import { VipPage } from './pages/VipPage'
import { AppUpdateBanner, AppUpdateSheet } from './components/me/AppUpdateSheet'
import { useAppUpdate } from './hooks/useAppUpdate'

export default function App() {
  const { state, patch } = useApp()
  const [chatId, setChatId] = useState(null)
  const [chatBoot, setChatBoot] = useState(null)
  const {
    remote,
    sheetOpen,
    setSheetOpen,
    checking,
    error: updateError,
    checkForUpdate,
    dismiss,
    showBanner,
  } = useAppUpdate()

  const openChat = (id, boot) => {
    setChatId(id)
    setChatBoot(boot ?? null)
  }

  const closeChat = () => {
    setChatId(null)
    setChatBoot(null)
  }

  return (
    <PhoneFrame>
      <div className="relative flex h-full flex-col">
        {showBanner && (
          <AppUpdateBanner
            remote={remote}
            onOpen={() => setSheetOpen(true)}
            onDismiss={dismiss}
          />
        )}
        <MainTabPager
          tab={state.tab}
          onTabChange={(id) => patch({ tab: id })}
          enabled={!chatId}
        >
          {state.tab === 'home' && <HomePage onOpenChat={openChat} />}
          {state.tab === 'vip' && <VipPage onOpenChat={openChat} />}
          {state.tab === 'matchmaker' && <MatchmakerPage onOpenChat={openChat} />}
          {state.tab === 'messages' && <MessagesPage onOpenChat={openChat} />}
          {state.tab === 'me' && (
            <MePage
              onOpenChat={openChat}
              onCheckUpdate={() => checkForUpdate({ openSheetOnNew: true })}
              updateChecking={checking}
              updateMessage={updateError}
            />
          )}
        </MainTabPager>
        {!chatId && <BottomNav />}
        <AnimatePresence>
          {chatId && (
            <ChatRoom
              chatId={chatId}
              boot={chatBoot}
              onBootConsumed={() => setChatBoot(null)}
              onClose={closeChat}
            />
          )}
        </AnimatePresence>
        <AppUpdateSheet
          open={sheetOpen}
          remote={remote}
          onClose={() => setSheetOpen(false)}
          onDismiss={dismiss}
        />
      </div>
    </PhoneFrame>
  )
}