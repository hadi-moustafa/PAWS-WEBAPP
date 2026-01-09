import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import PetCard from './components/PetCard'

export default async function PetsPage({ searchParams }: { searchParams: { tab?: string } }) {
    const supabase = await createClient()
    const { tab } = await searchParams // Await the promise for Next.js 15+

    const activeTab = tab || 'available'

    let query = supabase.from('Pet').select('*').order('createdAt', { ascending: false })

    if (activeTab === 'adopted') {
        query = query.eq('status', 'Adopted')
    } else {
        query = query.eq('status', 'Stray')
    }

    const { data: pets } = await query

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="neopop-card" style={{ padding: '0.5rem 1rem', display: 'inline-block', fontSize: '1.5rem', margin: 0 }}>
                    🐾 Pet Center
                </h1>
                <Link href="/admin/pets/create" className="neopop-button">
                    + New Pet
                </Link>
            </div>

            {/* Tabs */}
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <Link
                    href="/admin/pets?tab=available"
                    className="neopop-button"
                    style={{
                        background: tab === 'available' ? '#FF9F1C' : 'white',
                        color: tab === 'available' ? 'white' : 'black'
                    }}
                >
                    🏡 Available
                </Link>
                <Link
                    href="/admin/pets?tab=adopted"
                    className="neopop-button"
                    style={{
                        background: tab === 'adopted' ? '#93C572' : 'white',
                        color: tab === 'adopted' ? 'white' : 'black'
                    }}
                >
                    ❤️ Adopted
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {pets?.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                ))}
            </div>

            {pets?.length === 0 && (
                <div className="neopop-card" style={{ padding: '2rem', textAlign: 'center', background: 'white' }}>
                    <p>No pets found in this section.</p>
                </div>
            )}
        </div>
    )
}
