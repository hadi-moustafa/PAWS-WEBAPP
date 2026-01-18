import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

import { notFound } from 'next/navigation'

async function getPet(id: string) {
    const supabase = await createClient()
    const { data: pet } = await supabase.from('Pet').select('*, owner:User(*)').eq('id', id).single()
    return pet
}

export default async function PublicPetPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const pet = await getPet(id)

    if (!pet) {
        notFound()
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <div className="neopop-card" style={{
                background: 'white',
                padding: '2rem',
                border: '3px solid black',
                boxShadow: '8px 8px 0px black',
                borderRadius: '16px',
                textAlign: 'center'
            }}>
                <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 1.5rem', borderRadius: '50%', overflow: 'hidden', border: '3px solid black' }}>
                    <Image
                        src={pet.images?.[0] || 'https://placehold.co/400x400/png?text=No+Image'}
                        alt={pet.name}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>

                <h1 style={{
                    fontSize: '3rem',
                    margin: '0 0 0.5rem',
                    textTransform: 'uppercase',
                    color: '#FF9F1C',
                    textShadow: '2px 2px 0px black'
                }}>
                    {pet.name}
                </h1>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <span className="neopop-tag" style={{ background: '#74b9ff' }}>{pet.type}</span>
                    <span className="neopop-tag" style={{ background: '#a29bfe' }}>{pet.breed || 'Unknown Mix'}</span>
                    <span className="neopop-tag" style={{ background: '#fab1a0' }}>{pet.age ? `${pet.age} years old` : 'Age Unknown'}</span>
                </div>

                <p style={{
                    fontSize: '1.2rem',
                    lineHeight: '1.6',
                    marginBottom: '2rem',
                    background: '#dfe6e9',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '2px solid black'
                }}>
                    {pet.description || "I'm a mystery wrapped in a riddle, searching for a forever home!"}
                </p>

                <div style={{ textAlign: 'left', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <h3 style={{ borderBottom: '2px solid black', paddingBottom: '0.5rem', marginBottom: '1rem' }}>📍 Location</h3>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                            {pet.location || 'Shelter Main Branch'}
                        </p>
                    </div>

                    <div>
                        <h3 style={{ borderBottom: '2px solid black', paddingBottom: '0.5rem', marginBottom: '1rem' }}>📞 Contact</h3>
                        <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#2d3436' }}>
                            {pet.owner?.phone || 'No contact info available'}
                        </p>
                    </div>
                </div>
            </div>

            <footer style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.7 }}>
                <p>PAWS Shelter Management System</p>
            </footer>
        </div>
    )
}
