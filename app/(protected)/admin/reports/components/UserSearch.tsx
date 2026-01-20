'use client'

import { useState, useEffect } from 'react'
import { searchUsers } from '../actions'
import { useDebounce } from '@/hooks/use-debounce'

interface UserSearchProps {
    onSelect: (userId: string) => void
    label?: string
}

export default function UserSearch({ onSelect, label = "Select Adopter" }: UserSearchProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedUser, setSelectedUser] = useState<{ id: string, name: string } | null>(null)

    const debouncedQuery = useDebounce(query, 500)

    useEffect(() => {
        async function fetchUsers() {
            if (debouncedQuery.length < 2) {
                setResults([])
                return
            }
            setIsLoading(true)
            try {
                const users = await searchUsers(debouncedQuery)
                setResults(users)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUsers()
    }, [debouncedQuery])

    if (selectedUser) {
        return (
            <div className="neopop-card" style={{
                padding: '0.5rem',
                background: '#55efc4',
                border: '2px solid black',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '3px 3px 0px black'
            }}>
                <span style={{ fontWeight: 'bold' }}>👤 {selectedUser.name}</span>
                <button
                    onClick={() => {
                        setSelectedUser(null)
                        setQuery('')
                        onSelect('')
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
                placeholder="Type name or email..."
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
                    {results.map(user => (
                        <div
                            key={user.id}
                            onClick={() => {
                                setSelectedUser(user)
                                onSelect(user.id)
                                setResults([])
                            }}
                            style={{
                                padding: '0.5rem',
                                borderBottom: '1px solid #eee',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fefefe'}
                        >
                            {user.name} <span style={{ fontWeight: 'normal', fontSize: '0.8rem', color: '#666' }}>({user.email})</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
