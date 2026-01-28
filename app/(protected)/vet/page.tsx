import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import moment from 'moment'

import VetDashboardListeners from './components/VetDashboardListeners'

export const dynamic = 'force-dynamic'

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

            {/* Header Section */}
            <div style={{
                background: 'white',
                border: '3px solid black',
                boxShadow: '6px 6px 0px black',
                padding: '2rem',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2rem' }}>👨‍⚕️ {user.user_metadata?.name || 'Veterinarian'}</h1>
                    <p style={{ margin: '0.5rem 0 0', color: '#636e72' }}>{moment().format('dddd, MMMM Do YYYY')}</p>
                </div>

                {/* Quick Patient Lookup */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/vet/patients" className="neopop-button" style={{
                        background: '#0984e3',
                        color: 'white',
                        padding: '1rem 2rem',
                        textDecoration: 'none',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        🔍 Patient Database
                    </Link>
                </div>
            </div>

            {/* Emergency Queue (Only visible if active) */}
            {emergencyAppointments.length > 0 && (
                <div className="neopop-card" style={{ background: '#ff7675', border: '3px solid black', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ background: 'white', color: 'black', padding: '0.5rem', borderRadius: '50%', fontSize: '1.5rem', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid black' }}>🚨</div>
                        <h3 style={{ margin: 0, fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Critical Attention Required</h3>
                    </div>

                    <div style={{ background: 'white', border: '2px solid black', borderRadius: '8px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'black' }}>
                            <thead style={{ background: '#ffeaa7', borderBottom: '2px solid black' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Time</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Patient</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Owner</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emergencyAppointments.map((apt) => (
                                    <tr key={apt.id} style={{ borderBottom: '1px solid #dfe6e9' }}>
                                        <td style={{ padding: '1rem', fontWeight: 'bold', color: '#d63031' }}>
                                            {moment(apt.updatedDate || apt.date).format('h:mm A')}
                                            {apt.updatedDate && apt.updatedDate !== apt.date && <div style={{ fontSize: '0.8rem' }}>(Updated)</div>}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{apt.pet?.name}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#636e72' }}>{apt.pet?.breed}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{apt.owner?.name}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <Link href={`/vet/records/${apt.pet_id}`} className="neopop-button" style={{
                                                background: '#d63031',
                                                color: 'white',
                                                padding: '0.5rem 1.5rem',
                                                fontSize: '0.9rem'
                                            }}>
                                                TREAT NOW
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Main Schedule */}
            <div style={{
                background: 'white',
                border: '3px solid black',
                boxShadow: '6px 6px 0px black',
                padding: '0',
                borderRadius: '12px',
                overflow: 'hidden'
            }}>
                <div style={{
                    padding: '1.5rem 2rem',
                    background: '#74b9ff',
                    borderBottom: '3px solid black',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        📋 Appointments <span style={{ background: 'black', color: 'white', borderRadius: '20px', padding: '0.2rem 0.8rem', fontSize: '1rem', marginLeft: '0.5rem' }}>{standardAppointments.length}</span>
                    </h3>
                    <Link href="/vet/appointments" style={{ color: 'black', fontWeight: 'bold', textDecoration: 'underline' }}>Full Schedule →</Link>
                </div>

                {standardAppointments && standardAppointments.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#dfe6e9', borderBottom: '2px solid black' }}>
                            <tr>
                                <th style={{ padding: '1rem 2rem', textAlign: 'left', width: '150px' }}>Time</th>
                                <th style={{ padding: '1rem 2rem', textAlign: 'left' }}>Patient Details</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Type</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Notes</th>
                                <th style={{ padding: '1rem 2rem', textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {standardAppointments.map((apt) => (
                                <tr key={apt.id} style={{ borderBottom: '1px solid #b2bec3' }}>
                                    <td style={{ padding: '1.5rem 2rem', verticalAlign: 'top' }}>
                                        <div style={{ fontWeight: '900', fontSize: '1.2rem' }}>{moment(apt.updatedDate || apt.date).format('h:mm')}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#636e72', textTransform: 'uppercase' }}>{moment(apt.updatedDate || apt.date).format('A')}</div>
                                        {apt.updatedDate && apt.updatedDate !== apt.date && (
                                            <div style={{ color: '#d63031', fontSize: '0.8rem', fontWeight: 'bold' }}>Postponed</div>
                                        )}
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', verticalAlign: 'top' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.2rem' }}>{apt.pet?.name}</div>
                                        <div style={{ color: '#636e72', display: 'flex', gap: '0.5rem', fontSize: '0.9rem' }}>
                                            <span style={{ background: '#f1f2f6', padding: '0.1rem 0.5rem', borderRadius: '4px', border: '1px solid #b2bec3' }}>{apt.pet?.breed || 'Unknown Breed'}</span>
                                            <span>• Owner: {apt.owner?.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 1rem', verticalAlign: 'top' }}>
                                        <span style={{
                                            background: apt.type === 'Surgery' ? '#fab1a0' : '#81ecec',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '20px',
                                            border: '2px solid black',
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem',
                                            display: 'inline-block'
                                        }}>
                                            {apt.type}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem 1rem', verticalAlign: 'top', color: '#636e72', fontStyle: 'italic', maxWidth: '300px' }}>
                                        {apt.bookingReason || "No initial notes provided."}
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', textAlign: 'right', verticalAlign: 'middle' }}>
                                        <Link href={`/vet/records/${apt.pet_id}`} className="neopop-button" style={{
                                            padding: '0.8rem 1.5rem',
                                            fontSize: '0.9rem',
                                            background: 'white',
                                            color: 'black',
                                            textDecoration: 'none'
                                        }}>
                                            Open Chart
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: '4rem', textAlign: 'center', background: '#f5f6fa' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>☕</div>
                        <h3 style={{ margin: 0, color: '#2d3436' }}>No upcoming appointments</h3>
                        <p style={{ color: '#636e72' }}>Take a break or check the patient database.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
