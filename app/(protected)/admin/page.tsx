import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch Low Stock (mock query for now since DB is empty, or effective empty result)
    const { data: lowStock } = await supabase.from('Product').select('*').lt('stock', 5).limit(3)
    const { data: reports } = await supabase.from('Ticket').select('*').eq('status', 'OPEN').limit(3)

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 className="neopop-card" style={{ padding: '1rem', display: 'inline-block', marginBottom: '2rem' }}>
                🏭 Operation Center
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Low Stock Widget */}
                <div className="neopop-card" style={{ padding: '1.5rem', background: 'white', border: '3px solid #ff6b6b' }}>
                    <h3 style={{ margin: 0, marginBottom: '1rem', color: '#d63031' }}>⚠️ Low Stock Alerts</h3>
                    {lowStock && lowStock.length > 0 ? (
                        <ul style={{ paddingLeft: '1rem' }}>
                            {lowStock.map((item) => (
                                <li key={item.id}>{item.name} ({item.stock} left)</li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>Stock levels are healthy! ✅</p>
                    )}
                    <div style={{ marginTop: '1rem' }}>
                        <Link href="/admin/inventory" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Manage Inventory →</Link>
                    </div>
                </div>

                {/* Recent Reports Widget */}
                <div className="neopop-card" style={{ padding: '1.5rem', background: 'white', border: '3px solid #54a0ff' }}>
                    <h3 style={{ margin: 0, marginBottom: '1rem', color: '#2e86de' }}>📋 New Stray Reports</h3>
                    {reports && reports.length > 0 ? (
                        <ul style={{ paddingLeft: '1rem' }}>
                            {reports.map((ticket) => (
                                <li key={ticket.id}>{ticket.subject} - {new Date(ticket.createdAt).toLocaleDateString()}</li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>No new reports today. 🐾</p>
                    )}
                    <div style={{ marginTop: '1rem' }}>
                        <Link href="/admin/reports" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>View All Reports →</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
