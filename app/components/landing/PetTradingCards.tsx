import Image from 'next/image'
import styles from './Landing.module.css'

const pets = [
    // Local Pets
    {
        id: 1,
        name: 'Luna',
        type: 'Cat',
        image: '/landing/carousel/pet1.jpg',
        description: 'A very cute and fluffy cat who loves to play with yarn.'
    },
    {
        id: 2,
        name: 'Max',
        type: 'Dog',
        image: '/landing/carousel/pet3.jpg',
        description: 'A loyal and friendly dog who loves long walks in the park.'
    },
    {
        id: 3,
        name: 'Bella',
        type: 'Bird',
        image: '/landing/carousel/pet2.jpg',
        description: 'A colorful parrot who loves to mimic sounds.'
    },
    // Remote Variations (LoremFlickr with Locks)
    {
        id: 4,
        name: 'Simba',
        type: 'Cat',
        image: 'https://loremflickr.com/500/500/cat?lock=10',
        description: 'A ginger tabby who rules the house with an iron paw.'
    },
    {
        id: 5,
        name: 'Buddy',
        type: 'Dog',
        image: 'https://loremflickr.com/500/500/dog?lock=20',
        description: 'Always happy to see you and loves playing fetch.'
    },
    {
        id: 6,
        name: 'Kiwi',
        type: 'Bird',
        image: 'https://loremflickr.com/500/500/parrot?lock=15',
        description: 'A small green parrot with a big personality.'
    },
    {
        id: 7,
        name: 'Milo',
        type: 'Cat',
        image: 'https://loremflickr.com/500/500/kitten?lock=100',
        description: 'Tiny but mighty, Milo loves to climb curtains.'
    },
    {
        id: 8,
        name: 'Charlie',
        type: 'Dog',
        image: 'https://loremflickr.com/500/500/puppy?lock=50',
        description: 'A sleepy puppy who naps more than he runs.'
    },
    {
        id: 9,
        name: 'Sunny',
        type: 'Bird',
        image: 'https://loremflickr.com/500/500/bird?lock=40',
        description: 'Songs so sweet they will brighten up every morning.'
    }
]

export default function PetTradingCards() {
    return (
        <section className={styles.neoSection} style={{ padding: '4rem 0', background: '#fff', borderBottom: 'none' }}>
            <h2 className={styles.sectionTitle} style={{ fontSize: '3rem' }}>The Squad (Adopted)</h2>
            <div className={styles.carouselContainer} style={{ background: 'transparent' }}>
                <div className={styles.carouselTrack}>
                    {/* Original Set */}
                    {pets.map((pet, index) => (
                        <div key={`${pet.id}-${index}`} className={styles.bentoCard} style={{
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
                                    src={pet.image}
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
                                {pet.description}
                            </p>
                        </div>
                    ))}

                    {/* Duplicate Set for Infinite Scroll */}
                    {pets.map((pet, index) => (
                        <div key={`dup-${pet.id}-${index}`} className={styles.bentoCard} style={{
                            width: '300px',
                            height: '450px',
                            padding: '1rem',
                            background: '#fffa65',
                            flexShrink: 0
                        }} aria-hidden="true">
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                                <span>{pet.name}</span>
                                <span style={{ color: '#e17055' }}>Type: {pet.type}</span>
                            </div>
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                height: '200px',
                                border: '3px solid black',
                                background: 'white',
                                borderRadius: '8px',
                                overflow: 'hidden'
                            }}>
                                <Image src={pet.image} alt={pet.name} fill style={{ objectFit: 'cover' }} />
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
                                {pet.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
