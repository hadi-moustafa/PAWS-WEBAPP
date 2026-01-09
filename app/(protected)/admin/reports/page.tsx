import { createClient } from '@/lib/supabase/server'
import ReportCard from './components/ReportCard'

export default async function ReportsPage() {
    const supabase = await createClient()

    // Fetch OPEN or IN_PROGRESS tickets
    const { data: tickets } = await supabase
        .from('Ticket')
        .select('*')
        .in('status', ['OPEN', 'IN_PROGRESS'])
        .order('createdAt', { ascending: false })

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 className="neopop-card" style={{ padding: '0.5rem 1rem', display: 'inline-block', fontSize: '1.5rem', marginBottom: '2rem' }}>
                📋 Stray Reports
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {tickets?.map((ticket) => (
                    <ReportCard key={ticket.id} ticket={ticket} />
                ))}
            </div>

            {tickets?.length === 0 && (
                <div className="neopop-card" style={{ padding: '2rem', textAlign: 'center', background: 'white' }}>
                    <p>No active reports! Good job. 🎉</p>
                </div>
            )}
        </div>
    )
}
