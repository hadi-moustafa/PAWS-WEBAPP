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
        .limit(5)
    return data || []
}

export default async function AdoptedPetsCarousel() {
    const pets = await getAdoptedPets()

    if (pets.length === 0) return null

    return (
        <div className={styles.carouselContainer}>
            <div className={styles.carouselTrack}>
                {pets.map((pet) => (
                    <div key={pet.id} className={`${styles.petCard} neopop-card`}>
                        <div className={styles.petImageContainer}>
                            <Image
                                src={pet.images?.[0] || 'https://placedog.net/400/400?random'}
                                alt={pet.name}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className={styles.petInfo}>
                            <h3>{pet.name}</h3>
                            <p className={styles.petDesc}>{pet.description?.substring(0, 60)}...</p>
                            <span className={styles.adoptedBadge}>ADOPTED</span>
                        </div>
                    </div>
                ))}
                {/* Duplicate for infinite scroll effect if needed, usually css handles it */}
                {pets.length > 2 && pets.map((pet) => (
                    <div key={`dup-${pet.id}`} className={`${styles.petCard} neopop-card`} aria-hidden="true">
                        <div className={styles.petImageContainer}>
                            <Image
                                src={pet.images?.[0] || 'https://placedog.net/400/400?random'}
                                alt={pet.name}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className={styles.petInfo}>
                            <h3>{pet.name}</h3>
                            <p className={styles.petDesc}>{pet.description?.substring(0, 60)}...</p>
                            <span className={styles.adoptedBadge}>ADOPTED</span>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}
