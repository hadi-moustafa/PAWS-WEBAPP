import { createClient } from '@/lib/supabase/server'
import ChatBox from '../components/ChatBox'
import Link from 'next/link'

export default async function ReportChatPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id } = await params // Await params for Next.js 15
    const ticketId = parseInt(id)

    // Fetch Ticket Info
    const { data: ticket } = await supabase.from('Ticket').select('*, User(name, email)').eq('id', ticketId).single()

    if (!ticket) return <div>Report not found</div>

    // Fetch Messages
    const { data: messages } = await supabase
        .from('Message')
        .select('*')
        .eq('ticketId', ticketId)
        .order('createdAt', { ascending: true })

    const { data: { user } } = await supabase.auth.getUser()

    if (!ticket || !user) {
        return <div>Report not found or unauthorized</div>
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href="/admin/reports" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                    ← Back to Reports
                </Link>
                <div className="neopop-tag" style={{ background: '#93C572', color: 'white' }}>
                    {ticket.status}
                </div>
            </div>

            <div className="neopop-card" style={{ background: 'white', marginBottom: '1rem', padding: '1rem' }}>
                <h2 style={{ margin: 0 }}>{ticket.subject}</h2>
                <p style={{ color: '#666', margin: '0.5rem 0' }}>Reported by: {ticket.User?.name || ticket.User?.email}</p>
            </div>

            <ChatBox
                ticketId={ticketId}
                currentUser={user}
                initialMessages={messages || []}
            />
        </div>
    )
}
