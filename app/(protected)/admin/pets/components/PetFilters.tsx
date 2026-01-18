'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export default function PetFilters({ uniqueBreeds }: { uniqueBreeds: string[] }) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams?.toString())
        if (term) {
            params.set('q', term)
        } else {
            params.delete('q')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams?.toString())
        if (value && value !== 'All') {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        replace(`${pathname}?${params.toString()}`)
    }

    const handleClear = () => {
        const params = new URLSearchParams(searchParams?.toString())
        params.delete('q')
        params.delete('type')
        params.delete('breed')
        replace(`${pathname}?${params.toString()}`)
    }

    const hasFilters = searchParams?.has('q') || searchParams?.has('type') || searchParams?.has('breed')

    return (
        <div className="neopop-card" style={{
            marginBottom: '2rem',
            padding: '1rem',
            background: '#fff',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center'
        }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>🔍 Search Name</label>
                <input
                    defaultValue={searchParams?.get('q')?.toString()}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="e.g. Barnaby"
                    className="neopop-input"
                    style={{ width: '100%', border: '2px solid black' }}
                />
            </div>

            <div style={{ minWidth: '150px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Type</label>
                <select
                    defaultValue={searchParams?.get('type')?.toString()}
                    onChange={(e) => handleFilter('type', e.target.value)}
                    className="neopop-input"
                    style={{ width: '100%', border: '2px solid black' }}
                >
                    <option value="">All Types</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div style={{ minWidth: '150px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Breed</label>
                <select
                    defaultValue={searchParams?.get('breed')?.toString()}
                    onChange={(e) => handleFilter('breed', e.target.value)}
                    className="neopop-input"
                    style={{ width: '100%', border: '2px solid black' }}
                >
                    <option value="">All Breeds</option>
                    {uniqueBreeds.map(b => (
                        <option key={b} value={b}>{b}</option>
                    ))}
                </select>
            </div>

            {hasFilters && (
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', paddingBottom: '2px' }}>
                    <button
                        onClick={handleClear}
                        className="neopop-button"
                        style={{
                            background: '#ff7675',
                            color: 'white',
                            border: '2px solid black',
                            padding: '0.5rem 1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            borderRadius: '5px',
                            boxShadow: '3px 3px 0px black'
                        }}
                    >
                        Clear ❌
                    </button>
                </div>
            )}
        </div>
    )
}
