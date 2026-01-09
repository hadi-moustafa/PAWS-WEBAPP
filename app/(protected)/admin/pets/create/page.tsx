import { createPet } from '../actions'
import styles from '@/app/login/login.module.css'
import Link from 'next/link'

export default function CreatePetPage() {
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1rem' }}>
                <Link href="/admin/pets" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                    ← Back to Pets
                </Link>
            </div>

            <div className={`neopop-card ${styles.formContainer}`} style={{ padding: '2rem', background: 'white' }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>🐾 New Rescue</h1>

                <form action={createPet} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Name</label>
                        <input name="name" type="text" required className={styles.input} placeholder="e.g. Buddy" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Type</label>
                            <select name="type" required className={styles.input} style={{ background: 'white' }}>
                                <option value="Dog">Dog</option>
                                <option value="Cat">Cat</option>
                                <option value="Bird">Bird</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Age (Years)</label>
                            <input name="age" type="number" required className={styles.input} placeholder="2" />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Breed</label>
                        <input name="breed" type="text" required className={styles.input} placeholder="e.g. Golden Retriever" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Current Location</label>
                        <select name="location" required className={styles.input} style={{ background: 'white' }}>
                            <option value="Main Shelter">Main Shelter</option>
                            <option value="Clinic">Clinic</option>
                            <option value="Foster">Foster</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Description</label>
                        <textarea name="description" required className={styles.input} placeholder="Personality, likes, dislikes..." rows={3} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Pet Photo</label>
                        <input name="image" type="file" accept="image/*" className={styles.input} style={{ padding: '0.5rem' }} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Status</label>
                        <select name="status" required className={styles.input} style={{ background: 'white' }} defaultValue="Stray">
                            <option value="Stray">Stray</option>
                            <option value="Adopted">Adopted</option>
                        </select>
                    </div>

                    <button type="submit" className="neopop-button" style={{ marginTop: '1rem', width: '100%' }}>
                        Save Pet Profile
                    </button>
                </form>
            </div>
        </div>
    )
}
