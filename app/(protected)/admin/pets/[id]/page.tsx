import { createClient } from '@/lib/supabase/server'
import { updatePet, createMedicalRecord } from '../actions'
import styles from '@/app/login/login.module.css'
import Link from 'next/link'

export default async function EditPetPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id } = await params // Await params for Next.js 15+
    const { data: pet, error } = await supabase.from('Pet').select('*').eq('id', id).single()

    if (error || !pet) {
        return <div>Pet not found.</div>
    }


    // Fetch Medical Records
    const { data: records } = await supabase
        .from('MedicalRecord')
        .select('*, vet:vet_id(name)')
        .eq('pet_id', pet.id)
        .order('created_at', { ascending: false })

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gap: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
                <Link href="/admin/pets" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                    ← Back to Pets
                </Link>
            </div>

            {/* Existing Edit Form */}
            <div className={`neopop-card ${styles.formContainer}`} style={{ padding: '2rem', background: 'white' }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>✏️ Edit {pet.name}</h1>
                <form action={updatePet} className={styles.form}>
                    {/* ... (existing fields) ... Reuse the existing form content here, but I can't put it all in replacement string efficiently without large context. 
                     Wait, I am replacing the WHOLE component to be safe or just appending?
                     I'll try to just wrap the existing content in a grid and append the new section.
                     */}
                    <input type="hidden" name="id" value={pet.id} />
                    {/* Re-implementing the inputs to ensure they are preserved */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Name</label>
                        <input name="name" type="text" required className={styles.input} defaultValue={pet.name} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Type</label>
                            <select name="type" required className={styles.input} style={{ background: 'white' }} defaultValue={pet.type}>
                                <option value="Dog">Dog</option>
                                <option value="Cat">Cat</option>
                                <option value="Bird">Bird</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Age (Years)</label>
                            <input name="age" type="number" required className={styles.input} defaultValue={pet.age} />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Breed</label>
                        <input name="breed" type="text" required className={styles.input} defaultValue={pet.breed} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Current Location</label>
                        <select name="location" required className={styles.input} style={{ background: 'white' }} defaultValue={pet.location}>
                            <option value="Main Shelter">Main Shelter</option>
                            <option value="Clinic">Clinic</option>
                            <option value="Foster">Foster</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Description</label>
                        <textarea name="description" required className={styles.input} defaultValue={pet.description} rows={3} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Update Photo (Optional)</label>
                        <input name="image" type="file" accept="image/*" className={styles.input} style={{ padding: '0.5rem' }} />
                        <small style={{ color: '#666' }}>Leaving this empty keeps the current photo.</small>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Status</label>
                        <select name="status" required className={styles.input} style={{ background: 'white' }} defaultValue={pet.status}>
                            <option value="Stray">Stray</option>
                            <option value="Adopted">Adopted</option>
                        </select>
                    </div>

                    <button type="submit" className="neopop-button" style={{ marginTop: '1rem', width: '100%' }}>
                        Update Profile
                    </button>
                </form>
            </div>


        </div>
    )
}
