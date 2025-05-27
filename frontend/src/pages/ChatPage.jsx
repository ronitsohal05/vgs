// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NavBar from '../components/Navbar';
import { useLocation } from 'react-router-dom';

function decodeEmailFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || '';
  } catch {
    return '';
  }
}

export default function ChatPage() {
  const location = useLocation();
  const initOther = location.state || {};

  const [threads, setThreads]             = useState([]);
  const [selectedUser, setSelected]       = useState(null);
  const [messages, setMessages]           = useState([]);
  const [draft, setDraft]                 = useState('');
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMsgs, setLoadingMsgs]       = useState(false);
  const scrollRef = useRef();

  const token   = localStorage.getItem('token');
  const myEmail = token ? decodeEmailFromToken(token) : '';

  // 1) fetch your thread list
  useEffect(() => {

    async function loadThreads() {
      setLoadingThreads(true);
      try {
				console.log(token);
        const res = await axios.get('http://localhost:8080/messages/threads', 
					{ headers: { Authorization: `Bearer ${token}`} }
        );
        let t = res.data;

        // ensure the "otherUser" we were handed shows up in the list
        if (initOther.otherUserId) {
          const exists = t.find(x => x.userId === initOther.otherUserId);
          if (!exists) {
            t = [
              {
                userId:   initOther.otherUserId,
                name:     initOther.otherUserName,
                lastMessage: '',
                lastAt:   ''
              },
              ...t
            ];
          }
        }

        setThreads(t);
        setSelected(
          initOther.otherUserId
            ? t.find(x => x.userId === initOther.otherUserId)
            : t[0]
        );
      } catch (e) {
        console.error('Failed loading threads', e);
      } finally {
        setLoadingThreads(false);
      }
    }

    if (token) loadThreads();
  }, [token, initOther.otherUserId, initOther.otherUserName]);

  // 2) fetch conversation when you pick a thread
  useEffect(() => {
    if (!selectedUser) return;

    async function loadMessages() {
      setLoadingMsgs(true);
      try {
        const res = await axios.get(
          `http://localhost:8080/messages/with/${selectedUser.userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
        setTimeout(
          () => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }),
          50
        );
      } catch (e) {
        console.error('Failed loading messages', e);
      } finally {
        setLoadingMsgs(false);
      }
    }

    loadMessages();
  }, [selectedUser, token]);

  // 3) send new message
  const send = async e => {
    e.preventDefault();
    if (!draft.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:8080/messages/${selectedUser.userId}`,
        { text: draft },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(ms => [...ms, res.data]);
      setDraft('');
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      console.error('Failed sending message', e);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex h-[calc(100vh-64px)]">
        {/* THREADS */}
        <div className="w-1/4 border-r overflow-y-auto">
          {loadingThreads ? (
            <p className="p-4">Loading threads…</p>
          ) : (
            threads.map(t => (
              <button
                key={t.userId}
                onClick={() => setSelected(t)}
                className={`w-full text-left p-4 hover:bg-gray-100 ${
                  selectedUser?.userId === t.userId ? 'bg-gray-200' : ''
                }`}
              >
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-gray-600 truncate">
                  {t.lastMessage}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(t.lastAt).toLocaleString()}
                </div>
              </button>
            ))
          )}
        </div>

        {/* CONVERSATION */}
        <div className="flex-1 flex flex-col">
          {/* header */}
          <div className="border-b p-4 font-semibold">
            {selectedUser ? selectedUser.name : 'Select a conversation'}
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
            {loadingMsgs ? (
              <p>Loading messages…</p>
            ) : (
              messages.map(m => (
                <div
                  key={m.id}
                  className={`max-w-xs p-2 rounded ${
                    m.senderId === myEmail
                      ? 'bg-blue-100 self-end'
                      : 'bg-gray-100 self-start'
                  }`}
                >
                  <div>{m.text}</div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {new Date(m.sentAt).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
            <div ref={scrollRef} />
          </div>

          {/* input */}
          {selectedUser && (
            <form onSubmit={send} className="border-t p-4 flex">
              <input
                className="flex-1 border rounded px-3 py-2 focus:outline-none"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="Type a message…"
              />
              <button
                type="submit"
                className="ml-4 bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
              >
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
