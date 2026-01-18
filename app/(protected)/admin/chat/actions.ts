'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ChatUser = {
    id: string
    name: string
    email: string
    avatarUrl?: string
    lastMessage?: string
    lastMessageAt?: string
    unreadCount: number
}

// ... imports

export async function getChatUsers(): Promise<ChatUser[]> {
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (!currentUser) return []

    // Fetch recent messages where I am the Sender OR Receiver
    const { data: messages, error } = await supabase
        .from('Message')
        .select('createdAt, content, senderId, receiverId, isRead, type')
        // Filter: Involved ME
        .or(`senderId.eq.${currentUser.id},receiverId.eq.${currentUser.id}`)
        .order('createdAt', { ascending: false })
        .limit(500)

    if (error || !messages) {
        console.error('Error fetching messages', error)
        return []
    }

    const userIds = new Set<string>()
    messages.forEach(m => {
        // ... (rest of logic handles grouping) ...
        // Collect senderIds, but exclude the current Admin
        if (m.senderId !== currentUser.id) {
            userIds.add(m.senderId)
        }
        // Also collect receiverIds? (If I sent a message to a new user who hasn't replied yet)
        if (m.receiverId && m.receiverId !== currentUser.id) {
            userIds.add(m.receiverId)
        }
        // Actually, for "Inbox", we primarily want people who msg'd us OR we msg'd them.
        // So checking both fields is good.
    })

    if (userIds.size === 0) return []

    const { data: users, error: userError } = await supabase
        .from('User')
        .select('id, name, email, role')
        .in('id', Array.from(userIds))

    if (userError || !users) {
        return []
    }

    // Combine data
    const chatUsers: ChatUser[] = users.map(user => {
        // Find latest message in conversation (sent by them OR sent to them)
        // conversation = (sender=user AND receiver=Me) OR (sender=Me AND receiver=user)
        const userMessages = messages.filter(m =>
            (m.senderId === user.id && m.receiverId === currentUser.id) ||
            (m.senderId === currentUser.id && m.receiverId === user.id)
        )
        const lastMsg = userMessages[0] // Ordered DESC

        return {
            id: user.id,
            name: user.name || 'Unknown User',
            email: user.email,
            lastMessage: lastMsg?.content || '',
            lastMessageAt: lastMsg?.createdAt,
            // Unread count: Messages sent BY them that are NOT read
            unreadCount: userMessages.filter(m => m.senderId === user.id && !m.isRead).length
        }
    })

    // Sort by last message time
    chatUsers.sort((a, b) => {
        const timeA = new Date(a.lastMessageAt || 0).getTime()
        const timeB = new Date(b.lastMessageAt || 0).getTime()
        return timeB - timeA
    })

    return chatUsers
}

export async function getMessagesForUser(userId: string) {
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (!currentUser) return []

    // Fetch conversation: Strict 1-on-1 
    // (Me -> Them) OR (Them -> Me)
    const { data, error } = await supabase
        .from('Message')
        .select('*')
        .or(`and(senderId.eq.${currentUser.id},receiverId.eq.${userId}),and(senderId.eq.${userId},receiverId.eq.${currentUser.id})`)
        .order('createdAt', { ascending: true })

    if (error) return []
    return data
}

export async function saveMessage(userId: string, content: string, senderId: string) {
    const supabase = await createClient()

    // We assume 'userId' arg IS the 'receiverId' (Target User ID)
    const { data, error } = await supabase.from('Message').insert({
        content,
        senderId,
        receiverId: userId, // Link to the user
        type: 'TEXT',
        isRead: false,
        createdAt: new Date().toISOString(),
    }).select().single()

    if (error) throw error
    return data
}
