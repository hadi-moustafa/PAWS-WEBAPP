'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useEffect, useCallback } from 'react'

// Simple debounce function
function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

export default function UserFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isPending, startTransition] = useTransition()

    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [role, setRole] = useState(searchParams.get('role') || 'all')

    const debouncedSearch = useDebounce(search, 300)

    const handleFilterUpdate = useCallback((currentSearch: string, currentRole: string) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams)
            if (currentSearch) params.set('search', currentSearch)
            else params.delete('search')

            if (currentRole && currentRole !== 'all') params.set('role', currentRole)
            else params.delete('role')

            router.replace(`?${params.toString()}`)
        })
    }, [searchParams, router])

    // Effect for Search (Debounced)
    useEffect(() => {
        // Only trigger if the value actually differs from URL to avoid loop on initial load
        if (debouncedSearch !== (searchParams.get('search') || '')) {
            handleFilterUpdate(debouncedSearch, role)
        }
    }, [debouncedSearch, handleFilterUpdate, role, searchParams])

    // Effect for Role (Immediate)
    useEffect(() => {
        if (role !== (searchParams.get('role') || 'all')) {
            handleFilterUpdate(debouncedSearch, role)
        }
    }, [role, debouncedSearch, handleFilterUpdate, searchParams])


    return (
        <div className="neopop-card" style={{
            padding: '1.5rem',
            background: '#FFF5E6',
            border: '3px solid black',
            boxShadow: '6px 6px 0px black',
            borderRadius: '12px',
            marginBottom: '2rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'end',
            flexWrap: 'wrap'
        }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.8rem' }}>Search Staff</label>
                <input
                    type="text"
                    placeholder="Name or Email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.8rem',
                        border: '3px solid black',
                        borderRadius: '8px',
                        outline: 'none',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                    }}
                />
            </div>

            <div style={{ minWidth: '150px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.8rem' }}>Role</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.8rem',
                        border: '3px solid black',
                        borderRadius: '8px',
                        outline: 'none',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        background: 'white',
                        cursor: 'pointer'
                    }}
                >
                    <option value="all">All Staff</option>

                    <option value="Admin">Admin</option>
                    <option value="Vet">Vet</option>
                </select>
            </div>
        </div>
    )
}
