'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sendMessage } from '../[id]/actions'
import styles from './chat.module.css'

type Message = {
    id: number
    ticketId: number
    senderId: string
    content: string
    createdAt: string
    type: string
    isRead: boolean
}

export default function ChatBox({ ticketId, currentUser, initialMessages }: { ticketId: number, currentUser: { id: string }, initialMessages: Message[] }) {
    const [messages, setMessages] = useState(initialMessages)
    const [newMessage, setNewMessage] = useState('')
    const supabase = createClient()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        const channel = supabase
            .channel(`ticket-${ticketId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'Message',
                    filter: `ticketId=eq.${ticketId}`
                },
                (payload) => {
                    const newMsg = payload.new as Message
                    setMessages((prev) => [...prev, newMsg])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, ticketId])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        // Optimistic update could go here, but let's rely on Realtime for now to ensure consistency
        const content = newMessage
        setNewMessage('')

        try {
            await sendMessage(ticketId, content)
        } catch (error) {
            console.error('Failed to send', error)
            // Restore text if failed?
        }
    }

    return (
        <div className={styles.chatContainer}>
            <div className={styles.messageList}>
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id
                    return (
                        <div key={msg.id} className={`${styles.messageBubble} ${isMe ? styles.me : styles.them}`}>
                            <div className={styles.content}>{msg.content}</div>
                            <div className={styles.time}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className={styles.inputArea}>
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={styles.input}
                />
                <button type="submit" className="neopop-button" disabled={!newMessage.trim()}>
                    ➤
                </button>
            </form>
        </div>
    )
}
