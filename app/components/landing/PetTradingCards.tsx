import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import styles from './Landing.module.css'

async function getAdoptedPets() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('Pet')
        .select('*')
        .eq('status', 'Adopted')
        .order('adoptedAt', { ascending: false })
        .limit(6)
    return data || []
}

export default async function PetTradingCards() {
    const pets = await getAdoptedPets()

    if (pets.length === 0) return null

    return (
        <section className={styles.neoSection} style={{ padding: '4rem 0', background: '#fff', borderBottom: 'none' }}>
            <h2 className={styles.sectionTitle} style={{ fontSize: '3rem' }}>The Squad (Adopted)</h2>
            <div className={styles.carouselContainer} style={{ background: 'transparent' }}>
                <div className={styles.carouselTrack}>
                    {pets.map((pet) => (
                        <div key={pet.id} className={styles.bentoCard} style={{
                            width: '300px',
                            height: '450px',
                            padding: '1rem',
                            background: '#fffa65', // Yellow cards
                            flexShrink: 0
                        }}>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                                <span>{pet.name}</span>
                                <span style={{ color: '#e17055' }}>Type: {pet.type}</span>
                            </div>

                            {/* Image Frame */}
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                height: '200px',
                                border: '3px solid black',
                                background: 'white',
                                borderRadius: '8px',
                                overflow: 'hidden'
                            }}>
                                <Image
                                    src={pet.images?.[0] || 'https://placedog.net/400/400?random'}
                                    alt={pet.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>

                            {/* Stats Box */}
                            <div style={{ marginTop: '1rem', border: '2px solid black', background: 'white', padding: '0.5rem', borderRadius: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                                    <strong>Cuteness</strong>
                                    <div style={{ width: '80px', height: '10px', background: '#dfe6e9', border: '1px solid black' }}>
                                        <div style={{ width: '90%', height: '100%', background: '#ff7675' }}></div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <strong>Energy</strong>
                                    <div style={{ width: '80px', height: '10px', background: '#dfe6e9', border: '1px solid black' }}>
                                        <div style={{ width: '60%', height: '100%', background: '#74b9ff' }}></div>
                                    </div>
                                </div>
                            </div>

                            <p style={{
                                fontSize: '0.9rem',
                                lineHeight: '1.2',
                                marginTop: '1rem',
                                fontStyle: 'italic',
                                borderTop: '2px dashed black',
                                paddingTop: '0.5rem'
                            }}>
                                {pet.description?.substring(0, 80)}...
                            </p>
                        </div>
                    ))}
                    {/* Doubling for loop is handled by CSS visually or manually here. CSS scrolling works best with duplicates. */}
                    {pets.map((pet) => (
                        <div key={`dup-${pet.id}`} className={styles.bentoCard} style={{
                            width: '300px',
                            height: '450px',
                            padding: '1rem',
                            background: '#fffa65',
                            flexShrink: 0
                        }} aria-hidden="true">
                            {/* ... (Same Content) ... Simplified duplicates for speed */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                                <span>{pet.name}</span>
                            </div>
                            <div style={{ position: 'relative', width: '100%', height: '200px', border: '3px solid black', background: 'white' }}>
                                <Image src={pet.images?.[0] || 'https://placedog.net/400/400?random'} alt={pet.name} fill style={{ objectFit: 'cover' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
