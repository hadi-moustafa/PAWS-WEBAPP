'use client'

import { useState } from 'react'
import { deletePet } from '../actions'
import styles from './card.module.css'
import Link from 'next/link'
import PetQRCode from './PetQRCode'

type Pet = {
    id: number
    status: string
    adoptedAt?: string
    name: string
    type: string
    breed: string
    age: number
    location: string
    images: string[]
}

export default function PetCard({ pet }: { pet: Pet }) {
    const isAdopted = pet.status === 'Adopted'
    const [showQR, setShowQR] = useState(false)

    // ... (useEffect remains same)



    return (
        <>
            {showQR && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={() => setShowQR(false)}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '3px solid black', boxShadow: '8px 8px 0px black' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowQR(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>❌</button>
                        </div>
                        <PetQRCode petId={pet.id.toString()} petName={pet.name} />
                    </div>
                </div>
            )}

            <div className={`neopop-card ${styles.card} ${isAdopted ? styles.adopted : ''}`}>


                <div className={styles.imageContainer}>
                    <span className={styles.badge}>
                        {pet.type}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={pet.images?.[0] || 'https://placedog.net/400/400'}
                        alt={pet.name}
                        className={styles.image}
                    />
                </div>

                <div className={styles.info}>
                    <h3 className={styles.name}>{pet.name}</h3>
                    <p className={styles.meta}>{pet.breed} • {pet.age} yr</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>📍 {pet.location}</p>
                </div>

                <div className={styles.actions}>
                    <button
                        onClick={() => setShowQR(true)}
                        className="neopop-button"
                        style={{ flex: 0, padding: '0.5rem', background: '#fff', fontSize: '1.2rem' }}
                        title="Show QR Code"
                    >
                        📱
                    </button>
                    <Link href={`/admin/pets/${pet.id}`} className="neopop-button" style={{ flex: 1, padding: '0.5rem', background: '#ffeaa7', textAlign: 'center', textDecoration: 'none', color: 'black' }}>
                        ✏️ Edit
                    </Link>
                    <button
                        onClick={() => deletePet(pet.id)}
                        className="neopop-button"
                        style={{ flex: 0, padding: '0.5rem', background: '#ff7675' }}
                    >
                        🗑️
                    </button>
                </div>
            </div>
        </>
    )
}
