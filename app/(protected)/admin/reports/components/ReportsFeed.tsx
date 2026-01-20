'use client'

import { useState, useEffect } from 'react'
import ReportCard from './ReportCard'

type Report = {
    id: string
    createdAt: string
    userId: string
    subject: string
    description: string
    type: string
    status: string
    User?: {
        name: string | null
        email: string
    }
}

export default function ReportsFeed({ initialReports }: { initialReports: Report[] }) {
    const [dismissedIds, setDismissedIds] = useState<string[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('dismissedReports')
        if (saved) {
            setDismissedIds(JSON.parse(saved))
        }
        setIsLoaded(true)
    }, [])

    const handleDismiss = (id: string) => {
        const newDismissed = [...dismissedIds, id]
        setDismissedIds(newDismissed)
        localStorage.setItem('dismissedReports', JSON.stringify(newDismissed))
    }

    // While loading from local storage, we might typically show everything 
    // or wait. To prevent a flash of hidden content, we just filter immediately 
    // once loaded. If not loaded, we can show all or skeleton. 
    // For simplicity, we just filter based on what we have (initially empty).
    // Note: If we start empty, hydration matches server (empty).

    // Better approach for hydration mismatch avoidance with localStorage:
    // Render all initially, then effect hides them.

    const visibleReports = initialReports.filter(r => !dismissedIds.includes(r.id))

    // To avoid hydration mismatch if we initialized state from localStorage directly (which we didn't), 
    // we use the useEffect above. The content will "jump" or update after mount if there are hidden items.
    // This is acceptable for this use case.

    if (!isLoaded) {
        return (
            <div style={{ marginBottom: '2rem' }}>
                {/* ... Loading skeleton or just original content ... */}
                {/* Use server data initially */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0, textTransform: 'uppercase', textShadow: '2px 2px 0px #ddd' }}>
                        User Reports & Issues
                    </h2>
                    <span style={{
                        background: '#e17055',
                        color: 'white',
                        fontWeight: 'bold',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        border: '2px solid black',
                        fontSize: '0.9rem'
                    }}>
                        {initialReports.length} Total
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
                    {initialReports.map((report) => (
                        <ReportCard key={report.id} report={report} onDismiss={() => { }} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0, textTransform: 'uppercase', textShadow: '2px 2px 0px #ddd' }}>
                    User Reports & Issues
                </h2>
                <span style={{
                    background: '#e17055',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    border: '2px solid black',
                    fontSize: '0.9rem'
                }}>
                    {visibleReports.length} Total
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
                {visibleReports.map((report) => (
                    <ReportCard
                        key={report.id}
                        report={report}
                        onDismiss={() => handleDismiss(report.id)}
                    />
                ))}
            </div>

            {visibleReports.length === 0 && initialReports.length > 0 && (
                <div className="neopop-card" style={{ padding: '2rem', textAlign: 'center', background: 'white', border: '3px dashed black' }}>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>All issues handled! (Currently Hidden)</p>
                </div>
            )}
        </div>
    )
}
