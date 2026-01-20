'use client'

import { useState, useEffect } from 'react'
import { updateReportStatus } from '../actions'
import styles from './card.module.css'

type Report = {
    id: string
    createdAt: string
    userId: string
    subject: string
    description: string
    type: string
    status: string // Pending, In Progress, Done
    User?: {
        name: string | null
        email: string
    }
}

export default function ReportCard({ report, onDismiss }: { report: Report, onDismiss: () => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const [formattedDate, setFormattedDate] = useState('')

    useEffect(() => {
        setFormattedDate(new Date(report.createdAt).toLocaleDateString() + ' ' + new Date(report.createdAt).toLocaleTimeString())
    }, [report.createdAt])

    // Local state for optimistic update feeling
    const status = report.status

    // Status colors
    const getStatusColor = (s: string) => {
        switch (s) {
            case 'Pending': return '#ff7675' // Red
            case 'In Progress': return '#ffeaa7' // Yellow
            case 'Done': return '#55efc4' // Green
            default: return '#dfe6e9'
        }
    }

    const handleChangeStatus = async (newStatus: string) => {
        setIsLoading(true)
        try {
            await updateReportStatus(report.id, newStatus)
        } catch (error) {
            console.error(error)
            alert('Failed to update status')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.card} style={{ position: 'relative' }}>
            {/* Status Tab */}
            <div className={styles.folderTab} style={{
                background: getStatusColor(status),
                color: 'black',
                borderColor: 'black',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingRight: '0.5rem'
            }}>
                <span>{status.toUpperCase()}</span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // Ask for confirmation if needed, or just dismiss
                        if (confirm("Hide this report? It won't persist in the database, just hide from view.")) {
                            onDismiss()
                        }
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: 'black',
                        padding: '0 0.3rem',
                    }}
                    title="Dismiss Report"
                >
                    ✕
                </button>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', textTransform: 'uppercase' }}>{report.subject}</h3>
                <span style={{
                    display: 'inline-block',
                    padding: '0.2rem 0.6rem',
                    background: 'black',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    margin: '0.5rem 0'
                }}>
                    {report.type}
                </span>

                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {report.description}
                </p>

                <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '2px dashed #ccc',
                    fontSize: '0.8rem',
                    color: '#666'
                }}>
                    <p style={{ margin: 0 }}><strong>Reporter:</strong> {report.User?.name || report.User?.email || 'Unknown'}</p>
                    <p style={{ margin: 0 }}><strong>Date:</strong> {formattedDate}</p>
                </div>
            </div>

            {/* Action Bar */}
            <div style={{
                marginTop: '1rem',
                display: 'flex',
                background: '#eee',
                padding: '0.5rem',
                borderRadius: '8px',
                border: '2px solid black',
                gap: '0.5rem',
                justifyContent: 'space-between'
            }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.8rem', alignSelf: 'center' }}>MOVE TO:</span>

                {status !== 'Pending' && (
                    <button
                        onClick={() => handleChangeStatus('Pending')}
                        disabled={isLoading}
                        className="neopop-button"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', background: '#ff7675' }}
                        title="Mark as Pending"
                    >
                        ❌ PENDING
                    </button>
                )}

                {status !== 'In Progress' && (
                    <button
                        onClick={() => handleChangeStatus('In Progress')}
                        disabled={isLoading}
                        className="neopop-button"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', background: '#ffeaa7' }}
                        title="Mark as In Progress"
                    >
                        🚧 IN PROGRESS
                    </button>
                )}

                {status !== 'Done' && (
                    <button
                        onClick={() => handleChangeStatus('Done')}
                        disabled={isLoading}
                        className="neopop-button"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', background: '#55efc4' }}
                        title="Mark as Done"
                    >
                        ✅ DONE
                    </button>
                )}
            </div>
        </div>
    )
}
