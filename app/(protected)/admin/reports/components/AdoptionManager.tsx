'use client'

import { useState } from 'react'
import PetSearch from './PetSearch'
import UserSearch from './UserSearch'
import { updatePetStatus } from '../actions'

export default function AdoptionManager() {
    const [selectedPet, setSelectedPet] = useState<any>(null)
    const [selectedUserId, setSelectedUserId] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)

    const handleAdoption = async () => {
        if (!selectedPet || !selectedUserId) return

        setIsLoading(true)
        try {
            await updatePetStatus(selectedPet.id, 'Adopted', selectedUserId)
            // Reset fields
            window.location.reload() // Simple way to refresh state and lists
        } catch (error) {
            console.error('Adoption failed', error)
            alert('Adoption failed to process')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="neopop-card" style={{
            background: '#ff9ff3', // Pinkish purple
            border: '3px solid black',
            boxShadow: '6px 6px 0px black',
            padding: '1.5rem',
            marginBottom: '3rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '2.5rem' }}>🏠</span>
                <div>
                    <h2 style={{ margin: 0, fontWeight: '900', textTransform: 'uppercase', fontSize: '1.5rem' }}>Adoption Manager</h2>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Match a Stray Pet with a Forever Home</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
                <div style={{ background: 'white', padding: '1rem', border: '2px dashed black', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0, fontSize: '1rem', textTransform: 'uppercase' }}>1. Select Pet</h3>
                    <PetSearch onSelect={setSelectedPet} />
                </div>

                <div style={{ background: 'white', padding: '1rem', border: '2px dashed black', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0, fontSize: '1rem', textTransform: 'uppercase' }}>2. Select Adopter</h3>
                    <UserSearch onSelect={setSelectedUserId} />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                    onClick={handleAdoption}
                    disabled={!selectedPet || !selectedUserId || isLoading}
                    className="neopop-button"
                    style={{
                        background: '#55efc4',
                        color: 'black',
                        border: '2px solid black',
                        fontWeight: '900',
                        fontSize: '1.2rem',
                        padding: '1rem 3rem',
                        boxShadow: '4px 4px 0px black',
                        opacity: (!selectedPet || !selectedUserId || isLoading) ? 0.5 : 1,
                        cursor: (!selectedPet || !selectedUserId || isLoading) ? 'not-allowed' : 'pointer',
                        transform: 'rotate(-1deg)'
                    }}
                >
                    {isLoading ? 'PROCESSING...' : 'CONFIRM ADOPTION ✨'}
                </button>
            </div>
        </div>
    )
}
