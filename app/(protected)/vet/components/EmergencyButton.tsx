'use client'

import { createEmergencyAppointment } from '../actions'
import { useTransition } from 'react'

export default function EmergencyButton() {
    const [isPending, startTransition] = useTransition()

    const handleClick = () => {
        if (confirm('Are you sure you want to start an Emergency Protocol? This will create a new patient record immediately.')) {
            startTransition(async () => {
                await createEmergencyAppointment()
            })
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className="neopop-button"
            style={{
                background: 'white',
                color: isPending ? '#999' : '#e74c3c',
                width: '100%',
                fontWeight: 'bold',
                cursor: isPending ? 'wait' : 'pointer'
            }}
        >
            {isPending ? 'Initializing...' : 'Start Emergency Protocol'}
        </button>
    )
}
