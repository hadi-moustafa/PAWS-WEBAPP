'use client'

import { useState, useEffect } from 'react'
import { deletePet } from '../actions'
import styles from './card.module.css'
import Link from 'next/link'

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
    const [timeLeft, setTimeLeft] = useState('')
    const [expired, setExpired] = useState(false)

    // ... (useEffect remains same)

    useEffect(() => {
        if (!isAdopted || !pet.adoptedAt) return

        const adoptedDate = new Date(pet.adoptedAt).getTime()
        const expireDate = adoptedDate + (30 * 24 * 60 * 60 * 1000) // 30 Days

        const tick = () => {
            const now = new Date().getTime()
            const diff = expireDate - now

            if (diff <= 0) {
                setExpired(true)
                return
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            setTimeLeft(`${days}d ${hours}h left`)
        }

        tick()
        const timer = setInterval(tick, 60000) // Update every minute
        return () => clearInterval(timer)
    }, [isAdopted, pet.adoptedAt])

    if (expired) return null // Hide from view if expired

    return (
        <div className={`neopop-card ${styles.card} ${isAdopted ? styles.adopted : ''}`}>
            {isAdopted && (
                <div className={styles.timer}>
                    ⏳ Disappearing in: {timeLeft}
                </div>
            )}

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
    )
}
