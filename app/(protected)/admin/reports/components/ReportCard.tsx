'use client'

import { useState } from 'react'
import { convertTicketToPet, closeTicket } from '../actions'

type Ticket = {
    id: number
    createdAt: string
    subject: string
    location_name?: string
    imageUrl?: string
}

export default function ReportCard({ ticket }: { ticket: Ticket }) {
    const [isConverting, setIsConverting] = useState(false)

    if (isConverting) {
        return (
            <div className="neopop-card" style={{ background: 'white', padding: '1rem', border: '2px solid #93C572' }}>
                <h4>✨ Convert to Pet</h4>
                <form action={(formData) => {
                    convertTicketToPet(ticket.id, formData)
                    setIsConverting(false)
                }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>Name</label>
                        <input name="name" placeholder="Assign a name..." className="neopop-input" required style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>Type</label>
                        <select name="type" className="neopop-input" style={{ width: '100%' }}>
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button type="submit" className="neopop-button" style={{ background: '#93C572', flex: 1 }}>Confirm</button>
                        <button type="button" onClick={() => setIsConverting(false)} className="neopop-button" style={{ background: '#eee', flex: 1 }}>Cancel</button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="neopop-card" style={{ background: 'white', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <span className="neopop-tag" style={{ background: '#ffeaa7' }}>#{ticket.id}</span>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>{new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>

            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.2rem' }}>{ticket.subject}</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>📍 {ticket.location_name || 'Unknown Location'}</p>

            {ticket.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ticket.imageUrl} alt="Report" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '2px solid black', marginTop: '0.5rem' }} />
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button onClick={() => setIsConverting(true)} className="neopop-button" style={{ flex: 2, background: '#74b9ff' }}>
                    🪄 Convert
                </button>
                <button onClick={() => closeTicket(ticket.id)} className="neopop-button" style={{ flex: 1, background: '#ff7675' }}>
                    ✖️
                </button>
            </div>
        </div>
    )
}
