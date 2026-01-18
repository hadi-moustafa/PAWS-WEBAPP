'use client'

import { useState } from 'react'
import { convertTicketToPet, closeTicket } from '../actions'
import styles from './card.module.css'

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
            <div className={styles.card} style={{ background: 'white', borderColor: '#2ecc71' }}>
                <div className={styles.folderTab} style={{ background: 'white', borderColor: '#2ecc71', color: '#2ecc71' }}>CONVERTING</div>
                <h4 style={{ margin: '0 0 1rem 0', textTransform: 'uppercase' }}>✨ Convert to Resident</h4>
                <form action={(formData) => {
                    convertTicketToPet(ticket.id, formData)
                    setIsConverting(false)
                }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>Name</label>
                        <input name="name" placeholder="Assign a name..." className="neopop-input" required style={{ width: '100%', border: '2px solid black' }} />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>Type</label>
                        <select name="type" className="neopop-input" style={{ width: '100%', border: '2px solid black' }}>
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button type="submit" className="neopop-button" style={{ background: '#2ecc71', flex: 1, border: '2px solid black' }}>Confirm</button>
                        <button type="button" onClick={() => setIsConverting(false)} className="neopop-button" style={{ background: '#eee', flex: 1, border: '2px solid black' }}>Cancel</button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className={styles.card}>
            <div className={styles.folderTab}>CASE #{ticket.id}</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', textTransform: 'uppercase' }}>{ticket.subject}</h3>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', color: '#666', fontSize: '0.9rem', fontWeight: 'bold' }}>
                📅 {new Date(ticket.createdAt).toLocaleDateString()}
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold' }}>📍 {ticket.location_name || 'Unknown Location'}</p>

            {ticket.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ticket.imageUrl} alt="Report" className={styles.image} />
            )}

            <div className={styles.actions}>
                <button onClick={() => setIsConverting(true)} className="neopop-button" style={{ flex: 2, background: '#74b9ff', border: '2px solid black', fontWeight: 'bold' }}>
                    🪄 ADMIT
                </button>
                <button onClick={() => closeTicket(ticket.id)} className="neopop-button" style={{ flex: 1, background: '#ff7675', border: '2px solid black', fontWeight: 'bold' }}>
                    CLOSE
                </button>
            </div>
        </div>
    )
}
