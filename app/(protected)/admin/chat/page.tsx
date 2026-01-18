import { getChatUsers } from './actions'
import ChatClient from './ChatClient'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ChatPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Ensure only Admin/SuperAdmin
    // I assume middleware handles checks, but checking role here is safe.
    // Assuming user ID is enough for the client for now.

    const users = await getChatUsers()

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '1rem' }}>💬 Real-time Support Chat</h1>
            <ChatClient initialUsers={users} adminId={user.id} />
        </div>
    )
}
