'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(ticketId: number, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase.from('Message').insert({
        ticketId,
        senderId: user.id,
        content,
        type: 'TEXT',
        isRead: false,
        createdAt: new Date().toISOString()
    })

    if (error) {
        console.error('Send message failed', error)
        throw new Error('Failed to send message')
    }

    // We don't necessarily need revalidatePath if we use Realtime, but it's good for initial load consistency
    revalidatePath(`/admin/reports/${ticketId}`)
}
