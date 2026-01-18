import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import PetCard from './components/PetCard'
import PetFilters from './components/PetFilters'

export default async function PetsPage({ searchParams }: { searchParams: Promise<{ tab?: string, q?: string, type?: string, breed?: string }> }) {
    const supabase = await createClient()
    const { tab, q, type, breed } = await searchParams

    const activeTab = tab || 'available'

    // 1. Build Query
    let query = supabase.from('Pet').select('*').order('createdAt', { ascending: false })

    // Status Filter (Tab)
    if (activeTab === 'adopted') {
        query = query.eq('status', 'Adopted')
    } else {
        query = query.eq('status', 'Stray')
    }

    // Search Filters
    if (q) query = query.ilike('name', `%${q}%`)
    if (type && type !== 'All') query = query.eq('type', type)
    if (breed && breed !== 'All') query = query.eq('breed', breed)

    const { data: pets } = await query

    // 2. Fetch Distinct Breeds for Filter
    const { data: allPets } = await supabase.from('Pet').select('breed')
    const uniqueBreeds = Array.from(new Set(allPets?.map(p => p.breed).filter(Boolean).sort() || []))

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="neopop-card" style={{
                    padding: '1rem 2rem',
                    display: 'inline-block',
                    fontSize: '2rem',
                    margin: 0,
                    background: '#FF9F1C', // Orange
                    color: 'white',
                    border: '3px solid black',
                    boxShadow: '6px 6px 0px black',
                    transform: 'rotate(-2deg)'
                }}>
                    🐾 RESIDENT DIRECTORY
                </h1>
                <Link href="/admin/pets/create" className="neopop-button" style={{
                    background: '#93C572', // Pistachio
                    color: 'black',
                    padding: '1rem 2rem',
                    border: '3px solid black',
                    borderRadius: '50px',
                    fontWeight: '900',
                    fontSize: '1.2rem',
                    boxShadow: '6px 6px 0px black',
                    textDecoration: 'none'
                }}>
                    + NEW RESIDENT
                </Link>
            </div>

            {/* Filter Bar */}
            {/* Realtime Filter Bar */}
            <PetFilters uniqueBreeds={uniqueBreeds} />

            {/* Neo-Pop Tabs */}
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <Link
                    href={`/admin/pets?tab=available&q=${q || ''}&type=${type || ''}&breed=${breed || ''}`}
                    style={{
                        padding: '0.8rem 2rem',
                        background: activeTab === 'available' ? 'black' : 'white',
                        color: activeTab === 'available' ? 'white' : 'black',
                        border: '3px solid black',
                        borderRadius: '12px',
                        fontWeight: '900',
                        textDecoration: 'none',
                        boxShadow: activeTab === 'available' ? 'none' : '4px 4px 0px black',
                        transform: activeTab === 'available' ? 'translateY(4px)' : 'none',
                        transition: 'all 0.1s'
                    }}
                >
                    🏡 AVAILABLE
                </Link>
                <Link
                    href={`/admin/pets?tab=adopted&q=${q || ''}&type=${type || ''}&breed=${breed || ''}`}
                    style={{
                        padding: '0.8rem 2rem',
                        background: activeTab === 'adopted' ? 'black' : 'white',
                        color: activeTab === 'adopted' ? 'white' : 'black',
                        border: '3px solid black',
                        borderRadius: '12px',
                        fontWeight: '900',
                        textDecoration: 'none',
                        boxShadow: activeTab === 'adopted' ? 'none' : '4px 4px 0px black',
                        transform: activeTab === 'adopted' ? 'translateY(4px)' : 'none',
                        transition: 'all 0.1s'
                    }}
                >
                    ❤️ ADOPTED
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {pets?.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                ))}
            </div>

            {pets?.length === 0 && (
                <div className="neopop-card" style={{
                    padding: '3rem',
                    textAlign: 'center',
                    background: 'white',
                }}>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>No pets found matching your criteria. 🕵️‍♂️</p>
                </div>
            )}
        </div>
    );
}
