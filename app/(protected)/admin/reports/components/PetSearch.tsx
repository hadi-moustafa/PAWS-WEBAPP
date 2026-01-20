'use client'

import { useState, useEffect } from 'react'
import { searchStrayPets } from '../actions'
import { useDebounce } from '@/hooks/use-debounce'

interface PetSearchProps {
    onSelect: (pet: any) => void
    label?: string
}

export default function PetSearch({ onSelect, label = "Select Stray Pet" }: PetSearchProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedPet, setSelectedPet] = useState<any>(null)

    const debouncedQuery = useDebounce(query, 500)

    useEffect(() => {
        async function fetchPets() {
            if (debouncedQuery.length < 2) {
                setResults([])
                return
            }
            setIsLoading(true)
            try {
                const pets = await searchStrayPets(debouncedQuery)
                setResults(pets)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPets()
    }, [debouncedQuery])

    if (selectedPet) {
        return (
            <div className="neopop-card" style={{
                padding: '0.5rem',
                background: '#ff9f43',
                border: '2px solid black',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '3px 3px 0px black'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🐕</span>
                    <span style={{ fontWeight: 'bold' }}>{selectedPet.name} ({selectedPet.breed})</span>
                </div>
                <button
                    onClick={() => {
                        setSelectedPet(null)
                        setQuery('')
                        onSelect(null)
                    }}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                    }}
                >
                    ❌
                </button>
            </div>
        )
    }

    return (
        <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>{label}</label>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pet by name or breed..."
                className="neopop-input"
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '2px solid black',
                    borderRadius: '8px',
                    fontWeight: 'bold'
                }}
            />
            {isLoading && <div style={{ position: 'absolute', right: '10px', top: '35px', fontSize: '0.8rem' }}>⌛</div>}

            {results.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '2px solid black',
                    borderRadius: '8px',
                    marginTop: '5px',
                    zIndex: 10,
                    boxShadow: '4px 4px 0px black'
                }}>
                    {results.map(pet => (
                        <div
                            key={pet.id}
                            onClick={() => {
                                setSelectedPet(pet)
                                onSelect(pet)
                                setResults([])
                            }}
                            style={{
                                padding: '0.5rem',
                                borderBottom: '1px solid #eee',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fefefe'}
                        >
                            <span>🐾</span>
                            <div>
                                <div>{pet.name}</div>
                                <div style={{ fontSize: '0.7rem', color: '#666' }}>{pet.breed} • {pet.age} yrs</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
