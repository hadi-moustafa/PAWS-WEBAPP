'use client'
import { useState, useEffect } from 'react'

export default function LiveClock() {
    const [time, setTime] = useState<string>('')

    useEffect(() => {
        setTime(new Date().toString())
        const interval = setInterval(() => {
            setTime(new Date().toString())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    // Hydration match: show nothing or generic until client load
    if (!time) return null

    return (
        <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
            {time}
        </div>
    )
}
