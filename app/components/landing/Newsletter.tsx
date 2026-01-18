'use client'

import styles from './Landing.module.css'
import { subscribeToNewsletter } from '@/app/actions'
import { useState } from 'react'

export default function Newsletter() {
    const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setStatus(null)

        const result = await subscribeToNewsletter(formData)

        setStatus(result)
        setLoading(false)
    }

    return (
        <section className={styles.neoSection} style={{ padding: '6rem 2rem', background: '#a29bfe', textAlign: 'center' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '3rem', color: 'white', textShadow: '4px 4px 0px black', marginBottom: '1rem' }}>
                    DON'T MISS A TAIL WAG.
                </h2>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                    Join 10,000+ humans getting the weekly fluff update.
                </p>

                {status?.success ? (
                    <div style={{ padding: '2rem', background: '#55efc4', border: '4px solid black', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.5rem' }}>
                        🎉 {status.message}
                    </div>
                ) : (
                    <form action={handleSubmit} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <input name="email" type="email" placeholder="you@human.com" required style={{
                            padding: '1rem',
                            fontSize: '1.2rem',
                            border: '4px solid black',
                            borderRadius: '8px',
                            width: '300px',
                            fontWeight: 'bold'
                        }} />
                        <button type="submit" disabled={loading} className="neopop-button" style={{
                            fontSize: '1.2rem',
                            background: '#FF9F1C',
                            cursor: loading ? 'wait' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}>
                            {loading ? 'Subscribing...' : 'SUBSCRIBE'}
                        </button>
                    </form>
                )}

                {status?.success === false && (
                    <p style={{ color: 'red', fontWeight: 'bold', marginTop: '1rem', background: 'white', display: 'inline-block', padding: '0.5rem', border: '2px solid black' }}>
                        {status.message}
                    </p>
                )}
            </div>
        </section>
    )
}
