import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useLocation } from "react-router-dom"
import NavBar from "../components/Navbar"
import { format } from "date-fns"

function decodeEmailFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.sub || ""
  } catch {
    return ""
  }
}

export default function ChatPage() {
  const location = useLocation()
  const initOther = location.state || {}

  const [threads, setThreads] = useState([])
  const [selectedUser, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState("")
  const [loadingThreads, setLoadingThreads] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [mobileView, setMobileView] = useState("threads") // "threads" or "conversation"
  const [searchQuery, setSearchQuery] = useState("")
  const scrollRef = useRef()
  const messageEndRef = useRef()

  const token = localStorage.getItem("token")
  const myEmail = token ? decodeEmailFromToken(token) : ""

  // 1) fetch your thread list
  useEffect(() => {
    async function loadThreads() {
      setLoadingThreads(true)
      try {
        const res = await axios.get("http://localhost:8080/messages/threads", {
          headers: { Authorization: `Bearer ${token}` },
        })
        let t = res.data

        // ensure the "otherUser" we were handed shows up in the list
        if (initOther.otherUserId) {
          const exists = t.find((x) => x.userId === initOther.otherUserId)
          if (!exists) {
            t = [
              {
                userId: initOther.otherUserId,
                name: initOther.otherUserName,
                lastMessage: "",
                lastAt: "",
              },
              ...t,
            ]
          }
        }

        setThreads(t)
        const initialSelected = initOther.otherUserId ? t.find((x) => x.userId === initOther.otherUserId) : t[0]

        setSelected(initialSelected)

        // If we have an initial user selected, switch to conversation view on mobile
        if (initialSelected && window.innerWidth < 768) {
          setMobileView("conversation")
        }
      } catch (e) {
        console.error("Failed loading threads", e)
      } finally {
        setLoadingThreads(false)
      }
    }

    if (token) loadThreads()
  }, [token, initOther.otherUserId, initOther.otherUserName])

  // 2) fetch conversation when you pick a thread
  useEffect(() => {
    if (!selectedUser) return

    async function loadMessages() {
      setLoadingMsgs(true)
      try {
        const res = await axios.get(`http://localhost:8080/messages/with/${selectedUser.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setMessages(res.data)
        setTimeout(() => {
          messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      } catch (e) {
        console.error("Failed loading messages", e)
      } finally {
        setLoadingMsgs(false)
      }
    }

    loadMessages()
  }, [selectedUser, token])

  // 3) send new message
  const send = async (e) => {
    e.preventDefault()
    if (!draft.trim() || sendingMessage) return

    setSendingMessage(true)
    try {
      const res = await axios.post(
        `http://localhost:8080/messages/${selectedUser.userId}`,
        { text: draft },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setMessages((ms) => [...ms, res.data])
      setDraft("")

      // Update the thread list to show the latest message
      setThreads((currentThreads) => {
        return currentThreads.map((thread) => {
          if (thread.userId === selectedUser.userId) {
            return {
              ...thread,
              lastMessage: draft.trim(),
              lastAt: new Date().toISOString(),
            }
          }
          return thread
        })
      })

      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } catch (e) {
      console.error("Failed sending message", e)
    } finally {
      setSendingMessage(false)
    }
  }

  // Filter threads based on search query
  const filteredThreads = threads.filter((thread) => thread.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Format date for messages
  const formatMessageDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return format(date, "h:mm a")
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return format(date, "MMM d")
    }
  }

  // Format time for message bubbles
  const formatMessageTime = (dateString) => {
    return format(new Date(dateString), "h:mm a")
  }

  return (
    <>
      <NavBar />
      <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 md:py-4">
          <div className="container mx-auto">
            <h1 className="text-xl md:text-2xl font-bold">Messages</h1>
            <p className="text-purple-100 text-sm">Connect with buyers and sellers</p>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* THREADS - Hidden on mobile when viewing conversation */}
          <div
            className={`${
              mobileView === "threads" ? "flex" : "hidden"
            } md:flex flex-col w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200`}
          >
            {/* Search */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Thread List */}
            <div className="flex-1 overflow-y-auto">
              {loadingThreads ? (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500">Loading conversations...</p>
                </div>
              ) : filteredThreads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  {searchQuery ? (
                    <>
                      <p className="font-medium text-gray-900 mb-1">No conversations found</p>
                      <p className="text-sm text-gray-500">Try a different search term</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-gray-900 mb-1">No conversations yet</p>
                      <p className="text-sm text-gray-500">Start messaging sellers about items you're interested in</p>
                    </>
                  )}
                </div>
              ) : (
                filteredThreads.map((t) => (
                  <button
                    key={t.userId}
                    onClick={() => {
                      setSelected(t)
                      setMobileView("conversation")
                    }}
                    className={`w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                      selectedUser?.userId === t.userId ? "bg-purple-50" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                        {t.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <div className="font-medium text-gray-900 truncate">{t.name}</div>
                          {t.lastAt && (
                            <div className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                              {formatMessageDate(t.lastAt)}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 truncate">{t.lastMessage || "No messages yet"}</div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* CONVERSATION - Hidden on mobile when viewing threads */}
          <div className={`${mobileView === "conversation" ? "flex" : "hidden"} md:flex flex-col flex-1 bg-gray-50`}>
            {selectedUser ? (
              <>
                {/* Conversation Header */}
                <div className="bg-white border-b border-gray-200 p-3 flex items-center">
                  <button
                    onClick={() => setMobileView("threads")}
                    className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{selectedUser.name}</div>
                    <div className="text-xs text-gray-500">
                      {selectedUser.lastAt
                        ? `Last active ${format(new Date(selectedUser.lastAt), "MMM d, h:mm a")}`
                        : "New conversation"}
                    </div>
                  </div>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3" ref={scrollRef}>
                  {loadingMsgs ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mb-3"></div>
                      <p className="text-gray-500 text-sm">Loading messages...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">No messages yet</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Send a message to start the conversation with {selectedUser.name}
                      </p>
                    </div>
                  ) : (
                    <>
                      {messages.map((m, index) => {
                        const isMine = m.senderId === myEmail
                        const showDate =
                          index === 0 ||
                          new Date(m.sentAt).toDateString() !== new Date(messages[index - 1].sentAt).toDateString()

                        return (
                          <div key={m.id} className="flex flex-col">
                            {showDate && (
                              <div className="flex justify-center my-4">
                                <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                                  {format(new Date(m.sentAt), "MMMM d, yyyy")}
                                </div>
                              </div>
                            )}
                            <div className={`flex ${isMine ? "justify-end" : "justify-start"} items-end space-x-2`}>
                              {!isMine && (
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                                  {selectedUser.name.charAt(0)}
                                </div>
                              )}
                              <div
                                className={`max-w-[75%] p-3 rounded-2xl ${
                                  isMine
                                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none"
                                    : "bg-white border border-gray-200 rounded-bl-none"
                                }`}
                              >
                                <div className="whitespace-pre-wrap break-words">{m.text}</div>
                                <div
                                  className={`text-xs mt-1 text-right ${isMine ? "text-purple-100" : "text-gray-500"}`}
                                >
                                  {formatMessageTime(m.sentAt)}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messageEndRef} />
                    </>
                  )}
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-3">
                  <form onSubmit={send} className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <input
                        className="w-full pl-4 pr-10 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Type a message…"
                        disabled={sendingMessage}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={!draft.trim() || sendingMessage}
                      className={`p-3 rounded-full ${
                        !draft.trim() || sendingMessage
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                      } transition-all`}
                    >
                      {sendingMessage ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No conversation selected</h2>
                <p className="text-gray-500 max-w-md">
                  Select a conversation from the list or start a new one by messaging a seller from a listing page
                </p>
                <button
                  onClick={() => setMobileView("threads")}
                  className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors md:hidden"
                >
                  View Conversations
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
