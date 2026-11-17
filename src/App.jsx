import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { ChatRoom } from './components/chat/ChatRoom'
import { PhoneFrame } from './components/PhoneFrame'
import { useApp } from './context/AppContext'
import { HomePage } from './pages/HomePage'
import { MessagesPage } from './pages/MessagesPage'
import { MePage } from './pages/MePage'

export default function App() {
  const { state } = useApp()
  const [chatId, setChatId] = useState(null)

  const openChat = (id) => {
    setChatId(id)
  }

  const closeChat = () => {
    setChatId(null)
  }

  return (
    <PhoneFrame>
      <div className="relative flex h-full flex-col">
        <div className="min-h-0 flex-1 overflow-hidden">
          {state.tab === 'home' && <HomePage onOpenChat={openChat} />}
          {state.tab === 'messages' && <MessagesPage onOpenChat={openChat} />}
          {state.tab === 'me' && <MePage onOpenChat={openChat} />}
        </div>
        {!chatId && <BottomNav />}
        <AnimatePresence>
          {chatId && <ChatRoom chatId={chatId} onClose={closeChat} />}
        </AnimatePresence>
      </div>
    </PhoneFrame>
  )
}