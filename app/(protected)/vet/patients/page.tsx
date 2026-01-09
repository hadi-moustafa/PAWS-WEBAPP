import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import PatientSearch from './components/PatientSearch'

export default async function PatientsPage({ searchParams }: { searchParams: { query?: string } }) {
    const supabase = await createClient()

    // Need to await searchParams in Next.js 15
    const { query } = await searchParams

    let dbQuery = supabase.from('Pet').select('*, ownerId(name)') // Join owner if needed (though owner is usually Admin for shelter pets)

    if (query) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,breed.ilike.%${query}%`)
    }

    const { data: pets } = await dbQuery

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>🐶 Patient Registry</h1>

            <PatientSearch />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {pets?.map((pet) => (
                    <div key={pet.id} className="neopop-card" style={{ background: 'white' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={pet.images?.[0] || 'https://placedog.net/400/400'}
                                alt={pet.name}
                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid black' }}
                            />
                            <div>
                                <h3 style={{ margin: 0 }}>{pet.name}</h3>
                                <p style={{ margin: '0.2rem 0', color: '#666' }}>{pet.breed} • {pet.age} yr</p>
                                <span className="neopop-tag" style={{ background: '#eee', fontSize: '0.7rem' }}>ID: {pet.id}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px dashed #eee' }}>
                            <Link href={`/vet/records/${pet.id}`} className="neopop-button" style={{ display: 'block', textAlign: 'center', background: '#93C572' }}>
                                📂 Medical Records
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {pets?.length === 0 && (
                <div style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
                    No patients found matching &quot;{query}&quot;.
                </div>
            )}
        </div>
    )
}
