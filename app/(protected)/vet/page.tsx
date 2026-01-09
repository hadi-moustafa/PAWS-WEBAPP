import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import moment from 'moment'
import EmergencyButton from './components/EmergencyButton'
import VetDashboardListeners from './components/VetDashboardListeners'

export default async function VetDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch upcoming appointments
    // We'll fetch a bit more and filter in memory or do two queries. Two queries is cleaner for "Emergency vs Standard".
    // Actually, let's fetch all relevant for today/future and filter.

    // Note: 'Appointments' usually are assigned to a Vet. Emergencies might not be assigned yet? 
    // Or they are auto-assigned to the user clicking. In my action I assigned to current user.
    // So filtering by vetId is correct.

    const { data: appointments } = await supabase
        .from('Appointment')
        .select(`
            *,
            pet:pet_id(name, breed),
            owner:userId(name)
        `)
        .eq('vetId', user.id)
        .gte('date', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()) // From start of today
        .order('date', { ascending: true })
        .limit(20)

    const emergencyAppointments = appointments?.filter(a => a.type === 'Emergency' || a.is_emergency) || []
    const standardAppointments = appointments?.filter(a => a.type !== 'Emergency' && !a.is_emergency) || []

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <VetDashboardListeners />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                {/* Quick Actions */}
                <div className="neopop-card" style={{ background: '#74b9ff' }}>
                    <h3>🔍 Find Patient</h3>
                    <p>Search via Microchip ID or Name</p>
                    <Link href="/vet/patients" className="neopop-button" style={{ background: 'white', color: 'black', width: '100%', display: 'block', textAlign: 'center' }}>
                        Access Records
                    </Link>
                </div>

                <div className="neopop-card" style={{ background: '#ff7675' }}>
                    <h3>🚨 Emergency Intake</h3>
                    <p>Create a prioritized medical record.</p>
                    <EmergencyButton />
                </div>
            </div>

            {/* Emergency Queue */}
            {emergencyAppointments.length > 0 && (
                <div className="neopop-card" style={{ background: '#ffeaa7', border: '3px solid #e17055' }}>
                    <h3 style={{ margin: 0, color: '#d35400' }}>🔥 Emergency Queue ({emergencyAppointments.length})</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #d35400' }}>
                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Time</th>
                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Pet</th>
                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Owner</th>
                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emergencyAppointments.map((apt) => (
                                <tr key={apt.id} style={{ borderBottom: '1px solid #fab1a0' }}>
                                    <td style={{ padding: '0.8rem 0.5rem', fontWeight: 'bold' }}>
                                        {moment(apt.date).format('h:mm A')}
                                    </td>
                                    <td style={{ padding: '0.8rem 0.5rem', fontWeight: 'bold' }}>
                                        {apt.pet?.name || 'Unknown'}
                                        <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#666' }}> ({apt.pet?.breed || 'N/A'})</span>
                                    </td>
                                    <td style={{ padding: '0.8rem 0.5rem' }}>
                                        {apt.owner?.name || 'N/A'}
                                    </td>
                                    <td style={{ padding: '0.8rem 0.5rem' }}>
                                        <Link href={`/vet/records/${apt.pet_id}`} className="neopop-button" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', background: 'white' }}>
                                            Treat
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Regular Queue */}
            <div className="neopop-card" style={{ background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>📅 Today's Schedule</h3>
                    <Link href="/vet/appointments" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>View Full Schedule →</Link>
                </div>

                {standardAppointments && standardAppointments.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid black' }}>
                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Time</th>
                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Pet</th>
                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Owner</th>
                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Type</th>
                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {standardAppointments.map((apt) => (
                                <tr key={apt.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '0.8rem 0.5rem' }}>
                                        {moment(apt.date).format('h:mm A')}
                                    </td>
                                    <td style={{ padding: '0.8rem 0.5rem', fontWeight: 'bold' }}>
                                        {apt.pet?.name} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#666' }}>({apt.pet?.breed})</span>
                                    </td>
                                    <td style={{ padding: '0.8rem 0.5rem' }}>
                                        {apt.owner?.name}
                                    </td>
                                    <td style={{ padding: '0.8rem 0.5rem' }}>
                                        <span className="neopop-tag" style={{ background: '#dfe6e9' }}>{apt.type}</span>
                                    </td>
                                    <td style={{ padding: '0.8rem 0.5rem' }}>
                                        {apt.status}
                                    </td>
                                    <td style={{ padding: '0.8rem 0.5rem' }}>
                                        <Link href={`/vet/records/${apt.pet_id}`} style={{ textDecoration: 'underline', color: 'blue' }}>
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666', background: '#f5f6fa', borderRadius: '8px' }}>
                        No standard appointments scheduled for today.
                    </div>
                )}
            </div>
        </div>
    )
}
