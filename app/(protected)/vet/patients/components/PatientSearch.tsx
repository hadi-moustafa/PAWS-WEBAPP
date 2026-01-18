'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export default function PatientSearch() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams?.toString())
        if (term) {
            params.set('query', term)
        } else {
            params.delete('query')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    return (
        <div className="neopop-card" style={{ background: '#74b9ff', marginBottom: '2rem', padding: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>🔍 Find Patient</label>
            <input
                className="neopop-input"
                placeholder="Search by name, breed, or ID..."
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams?.get('query')?.toString()}
                style={{ width: '100%', fontSize: '1.2rem' }}
            />
        </div>
    )
}
