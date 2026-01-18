'use client'

import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import type { ChatUser } from './actions'
import { getMessagesForUser, saveMessage } from './actions'
import { createClient } from '@/lib/supabase/client'
// reusing generic styles or I might need to create new ones. 
// I'll create inline styles for speed and specific light design as requested.
import styles from './chat.module.css'

type Message = {
    id?: string
    content: string
    senderId: string
    createdAt: string
    type?: string
}

export default function ChatClient({ initialUsers, adminId }: { initialUsers: ChatUser[], adminId: string }) {
    const [users, setUsers] = useState<ChatUser[]>(initialUsers)
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isConnected, setIsConnected] = useState(false)
    const socketRef = useRef<Socket | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Fix for stale selectedUser in receive_message:
    const selectedUserRef = useRef(selectedUser)
    useEffect(() => {
        selectedUserRef.current = selectedUser
    }, [selectedUser])

    // Ref for adminId to avoid re-init if it changes (unlikely but safe)
    const adminIdRef = useRef(adminId)
    useEffect(() => {
        adminIdRef.current = adminId
    }, [adminId])

    // Initialize Supabase client
    const supabase = createClient()

    // Supabase Realtime Subscription for receiving messages
    useEffect(() => {
        console.log("ChatClient: Subscribing to Supabase Realtime...")

        const channel = supabase
            .channel('realtime_chat')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'Message',
                },
                (payload) => {
                    console.log('ChatClient: Realtime INSERT received:', payload)
                    const newMessage = payload.new as any
                    const currentAdminId = adminIdRef.current

                    // Strict Privacy Filter:
                    // Only process message if I am the Sender OR Receiver.
                    const isRelevant =
                        newMessage.senderId === currentAdminId ||
                        newMessage.receiverId === currentAdminId

                    if (!isRelevant) {
                        // This message is not for me. Ignore it.
                        return
                    }

                    // Deduplicate if I sent it (and locally added it)
                    if (newMessage.senderId === currentAdminId) {
                        // Optional: update ID confirm? For now just return to allow optimistic.
                        // But we better be safe and allow it if optimistic failed? 
                        // Logic below updates state. If we skip, we rely 100% on optimistic.
                        // Let's Skip to avoid duplicate.
                        return
                    }

                    // 1. Update Active Chat Window
                    const currentSelected = selectedUserRef.current

                    // Is this message part of the Currently Open Conversation?
                    // Conversation = Me <-> SelectedUser
                    const isForCurrentView = currentSelected && (
                        (newMessage.senderId === currentSelected.id && newMessage.receiverId === currentAdminId) ||
                        (newMessage.senderId === currentAdminId && newMessage.receiverId === currentSelected.id)
                    )

                    if (isForCurrentView) {
                        setMessages(prev => {
                            if (prev.some(m => m.id === newMessage.id)) return prev
                            return [...prev, newMessage]
                        })
                    }

                    // 2. Update Sidebar (Inbox)
                    // We update the User Item if they are the "Other Party".
                    // If Sender is Me, Other Party is Receiver.
                    // If Sender is Them, Other Party is Sender.

                    const otherPartyId = newMessage.senderId === currentAdminId
                        ? newMessage.receiverId
                        : newMessage.senderId

                    setUsers(prevUsers => {
                        const userExists = prevUsers.some(u => u.id === otherPartyId)

                        return prevUsers.map(u => {
                            if (u.id === otherPartyId) {
                                const isSelected = (selectedUserRef.current?.id === u.id)
                                return {
                                    ...u,
                                    lastMessage: newMessage.content,
                                    lastMessageAt: newMessage.createdAt,
                                    unreadCount: (newMessage.senderId === u.id && !isSelected) ? (u.unreadCount + 1) : u.unreadCount
                                }
                            }
                            return u
                        }).sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime())
                    })
                }
            )
            .subscribe((status) => {
                console.log("ChatClient: Subscription status:", status)
                if (status === 'SUBSCRIBED') {
                    setIsConnected(true) // Reuse the online indicator for Supabase status
                } else {
                    setIsConnected(false)
                }
            })

        return () => {
            console.log("ChatClient: Unsubscribing from Supabase Realtime...")
            supabase.removeChannel(channel)
        }
    }, [])

    // Initialize Socket.IO for EMITTING messages
    useEffect(() => {
        console.log("ChatClient: EFFECT START (Mount or Dep Change)")

        // Prevent double-init
        if (socketRef.current) {
            console.log("ChatClient: Socket already exists, skipping init.")
            return
        }

        const controller = new AbortController()

        const initSocket = async () => {
            console.log("ChatClient: Fetching socket API...")
            try {
                await fetch('/api/socket/io', {
                    signal: controller.signal,
                    cache: 'no-store', // Ensure we hit the server
                })

                // If unmounted during fetch, stop
                if (controller.signal.aborted) return

                console.log("ChatClient: Creating socket instance...")

                const socket = io({
                    path: '/api/socket/io',
                    addTrailingSlash: false,
                    autoConnect: false, // Wait for setup
                    reconnectionAttempts: 5,
                })

                socket.on('connect', () => {
                    console.log('ChatClient: Socket connected:', socket.id)
                    // setIsConnected(true) // Supabase now manages this state

                    // Join Global Admin Room
                    socket.emit('join_room', 'admin_dashboard')
                    console.log('ChatClient: Joining admin_dashboard')

                    // Re-join active room if any
                    // We need to use the ref because this callback might be called later (reconnect)
                    if (selectedUserRef.current) {
                        const userRoom = `chat_${selectedUserRef.current.id}`
                        socket.emit('join_room', userRoom)
                        console.log('ChatClient: Re-joining', userRoom)
                    }
                })

                socket.on('disconnect', (reason) => {
                    console.warn('ChatClient: Socket disconnected:', reason)
                    // setIsConnected(false) // Supabase now manages this state
                })

                socket.on('connect_error', (err) => {
                    console.error('ChatClient: Socket connect error:', err.message)
                })

                // Removed socket.on('receive_message') as Supabase Realtime handles receiving

                socketRef.current = socket
                socket.connect()

            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.error("ChatClient: Socket Init Error:", error)
                }
            }
        }

        initSocket()

        return () => {
            console.warn("ChatClient: UNMOUNTING - Cleaning up socket...")
            controller.abort()
            if (socketRef.current) {
                socketRef.current.disconnect()
                socketRef.current = null
            }
        }
    }, []) // Strictly run once

    // Join Room when Selected User Changes
    useEffect(() => {
        if (!selectedUser || !socketRef.current) return

        const roomName = `chat_${selectedUser.id}`
        socketRef.current.emit('join_room', roomName)
        console.log(`Joined room: ${roomName}`)

        // Fetch history
        async function loadHistory() {
            if (!selectedUser) return
            const history = await getMessagesForUser(selectedUser.id)
            // Need to map history to Message type
            const historyFormatted = history.map((m: any) => ({
                id: m.id,
                content: m.content,
                senderId: m.senderId,
                createdAt: m.createdAt,
                type: m.type
            }))
            setMessages(historyFormatted)
        }

        loadHistory()

    }, [selectedUser])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedUser || !socketRef.current) return

        const content = newMessage
        setNewMessage('') // Optimistic clear

        const roomName = `chat_${selectedUser.id}`
        const msgData = {
            content,
            senderId: adminId,
            room: roomName,
            createdAt: new Date().toISOString(),
        }

        // 1. Optimistic Update (Immediate Feedback)
        setMessages(prev => [...prev, msgData])

        // Update Sidebar Preview immediately
        setUsers(prev => prev.map(u =>
            u.id === selectedUser.id
                ? { ...u, lastMessage: content, lastMessageAt: msgData.createdAt }
                : u
        ).sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime()))

        // 2. Emit to Socket (broadcasts to Mobile User)
        socketRef.current.emit('send_message', msgData)

        // 3. Save to DB
        try {
            await saveMessage(selectedUser.id, content, adminId)
        } catch (err) {
            console.error("Failed to save message", err)
            // Ideally: show error toast or retry
        }
    }

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h3 className={styles.sidebarTitle}>Inboxes</h3>
                </div>
                <div className={styles.userList}>
                    {users.map(user => (
                        <div
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`${styles.userItem} ${selectedUser?.id === user.id ? styles.userItemActive : ''}`}
                        >
                            <div className={styles.avatar}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className={styles.userInfo}>
                                <div className={styles.userName}>{user.name}</div>
                                <div className={styles.lastMessage}>
                                    {user.lastMessage || 'No messages'}
                                </div>
                            </div>
                            {user.unreadCount > 0 && (
                                <div className={styles.unreadBadge}>
                                    {user.unreadCount}
                                </div>
                            )}
                        </div>
                    ))}
                    {users.length === 0 && <div className={styles.emptyState}>No active chats.</div>}
                </div>
            </div>

            {/* Chat Area */}
            <div className={styles.chatArea}>
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className={styles.chatHeader}>
                            <div className={styles.chatHeaderInfo}>
                                <div className={styles.avatar} style={{ width: 32, height: 32, fontSize: '0.9rem' }}>
                                    {selectedUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div className={styles.chatHeaderName}>{selectedUser.name}</div>
                            </div>
                            <div className={styles.statusIndicator} style={{ color: isConnected ? '#2ecc71' : '#e74c3c' }}>
                                <div className={styles.statusDot} style={{ background: isConnected ? '#2ecc71' : '#e74c3c' }} />
                                {isConnected ? 'Online' : 'Reconnecting...'}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className={styles.messagesContainer}>
                            {messages.map((msg, index) => {
                                const isMe = msg.senderId === adminId
                                return (
                                    <div key={index} className={`${styles.messageWrapper} ${isMe ? styles.messageWrapperMe : styles.messageWrapperThem}`}>
                                        <div className={`${styles.bubble} ${isMe ? styles.bubbleMe : styles.bubbleThem}`}>
                                            {msg.content}
                                        </div>
                                        <div className={styles.timestamp}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className={styles.inputForm}>
                            <input
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className={styles.inputField}
                            />
                            <button
                                type="submit"
                                className={styles.sendButton}
                                disabled={!newMessage.trim() || !isConnected}
                            >
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>💬</div>
                        <div>Select a user to start chatting</div>
                    </div>
                )}
            </div>
        </div>
    )
}
