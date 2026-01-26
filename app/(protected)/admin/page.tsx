import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // 1. Fetch Stats
    // Low Stock Items (< 5)
    const { data: lowStock } = await supabase.from('Product').select('*').lt('stock', 5).limit(5)
    // Open Reports
    // Open Reports
    const { data: reports } = await supabase.from('Ticket').select('*').eq('status', 'OPEN').limit(5)
    // Total Pets
    const { count: petCount } = await supabase.from('Pet').select('*', { count: 'exact', head: true }).eq('status', 'Stray')
    // Pending Pets
    const { data: pendingPets, count: pendingPetCount } = await supabase
        .from('Pet')
        .select('*', { count: 'exact' })
        .eq('status', 'Pending')
        .order('createdAt', { ascending: false })
        .limit(5)

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Welcome Banner */}
            <div className="neopop-card" style={{
                background: '#FF9F1C', // Orange
                color: 'white',
                padding: '2rem',
                border: '3px solid black',
                boxShadow: '8px 8px 0px black',
                borderRadius: '12px',
                marginBottom: '3rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', textShadow: '2px 2px 0px black', fontWeight: '900' }}>
                        🏭 OPERATION CENTER
                    </h1>
                    <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold', fontSize: '1.2rem', opacity: 0.9 }}>
                        Managing the day-to-day chaos!
                    </p>
                </div>
                <div style={{ fontSize: '4rem' }}>🏗️</div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

                {/* Stat 1: Pets */}
                <div className="neopop-card" style={{
                    padding: '1.5rem',
                    background: 'white',
                    border: '3px solid black',
                    boxShadow: '5px 5px 0px black',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                            <h3 style={{ margin: 0, color: '#666', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Residents</h3>
                            <span style={{ fontSize: '3rem', fontWeight: '900', color: 'black' }}>{petCount || 0}</span>
                        </div>
                        <span style={{ fontSize: '2rem' }}>🐾</span>
                    </div>
                    <Link href="/admin/pets" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>View Directory →</Link>
                </div>

                {/* Stat 2: Low Stock */}
                <div className="neopop-card" style={{
                    padding: '1.5rem',
                    background: lowStock && lowStock.length > 0 ? '#FFEAA7' : '#55efc4', // Yellow if warning, Green if good
                    border: '3px solid black',
                    boxShadow: '5px 5px 0px black',
                    borderRadius: '12px',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                            <h3 style={{ margin: 0, color: 'black', fontSize: '0.9rem', textTransform: 'uppercase' }}>Inventory Alert</h3>
                            <span style={{ fontSize: '3rem', fontWeight: '900', color: lowStock && lowStock.length > 0 ? '#d63031' : 'black' }}>
                                {lowStock?.length || 0}
                            </span>
                        </div>
                        <span style={{ fontSize: '2rem' }}>📦</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {lowStock && lowStock.length > 0 ? 'Items need restocking!' : 'Stock levels healthy.'}
                    </div>
                </div>

                {/* Stat 4: Pending Approvals */}
                <div className="neopop-card" style={{
                    padding: '1.5rem',
                    background: pendingPetCount && pendingPetCount > 0 ? '#fab1a0' : 'white', // Light Red/Orange if pending
                    border: '3px solid black',
                    boxShadow: '5px 5px 0px black',
                    borderRadius: '12px',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                            <h3 style={{ margin: 0, color: 'black', fontSize: '0.9rem', textTransform: 'uppercase' }}>Pending Approvals</h3>
                            <span style={{ fontSize: '3rem', fontWeight: '900', color: 'black' }}>{pendingPetCount || 0}</span>
                        </div>
                        <span style={{ fontSize: '2rem' }}>⏳</span>
                    </div>
                    <Link href="/admin/reports" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Review Requests →</Link>
                </div>

            </div>

            {/* Dashboard Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>

                {/* Left Col: Stock List */}
                <div className="neopop-card" style={{
                    background: 'white',
                    border: '3px solid black',
                    boxShadow: '8px 8px 0px black',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '1rem', background: '#FF7675', borderBottom: '3px solid black', color: 'white' }}> {/* Salmon */}
                        <h3 style={{ margin: 0, fontWeight: '900', textShadow: '1px 1px 0px black' }}>📉 LOW STOCK WARNING</h3>
                    </div>
                    <div style={{ padding: '1rem' }}>
                        {lowStock && lowStock.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {lowStock.map((item) => (
                                    <li key={item.id} style={{
                                        padding: '0.8rem',
                                        marginBottom: '0.5rem',
                                        border: '2px solid black',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: '#FFF0F0'
                                    }}>
                                        <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                                        <span style={{
                                            background: '#D63031',
                                            color: 'white',
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            fontWeight: 'bold',
                                            fontSize: '0.8rem',
                                            border: '1px solid black'
                                        }}>
                                            {item.stock} left
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                                All shelves are stocked! ✨
                            </div>
                        )}
                        <Link href="/admin/inventory" className="neopop-button" style={{
                            display: 'block',
                            textAlign: 'center',
                            marginTop: '1rem',
                            padding: '0.8rem',
                            background: '#0984e3',
                            color: 'white',
                            border: '2px solid black',
                            borderRadius: '8px',
                            fontWeight: 'bold'
                        }}>
                            MANAGE INVENTORY
                        </Link>
                    </div>
                </div>

                {/* Right Col: Reports & Activity */}
                <div className="neopop-card" style={{
                    background: 'white',
                    border: '3px solid black',
                    boxShadow: '8px 8px 0px black',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '1rem', background: '#74B9FF', borderBottom: '3px solid black', color: 'black' }}> {/* Blue */}
                        <h3 style={{ margin: 0, fontWeight: '900' }}>📋 LATEST ACTIVITY</h3>
                    </div>
                    <div style={{ padding: '1rem' }}>

                        {/* Pending Pets Summary */}
                        {pendingPets && pendingPets.length > 0 && (
                            <div style={{ marginBottom: '1.5rem', borderBottom: '2px dashed #ccc', paddingBottom: '1rem' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#d63031', fontWeight: 'bold', textTransform: 'uppercase' }}>⏳ Pending Reviews</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {pendingPets.map(pet => (
                                        <li key={pet.id} style={{ fontSize: '0.9rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '0.5rem' }}>🐶</span>
                                            <strong>{pet.name}</strong>
                                            <span style={{ color: '#666', marginLeft: '0.5rem' }}>({pet.breed})</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#0984e3', fontWeight: 'bold', textTransform: 'uppercase' }}>🎫 Open Tickets</h4>
                        {reports && reports.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {reports.map((ticket) => (
                                    <li key={ticket.id} style={{
                                        padding: '0.8rem',
                                        marginBottom: '0.5rem',
                                        border: '2px solid black',
                                        borderRadius: '8px',
                                        background: '#F0F8FF'
                                    }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>{ticket.subject}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{new Date(ticket.createdAt).toLocaleDateString()}</div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div style={{ padding: '1rem', textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                                No open tickets.
                            </div>
                        )}
                        <Link href="/admin/reports" className="neopop-button" style={{
                            display: 'block',
                            textAlign: 'center',
                            marginTop: '1rem',
                            padding: '0.8rem',
                            background: '#FDCB6E',
                            color: 'black',
                            border: '2px solid black',
                            borderRadius: '8px',
                            fontWeight: 'bold'
                        }}>
                            VIEW ALL TICKETS
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}
