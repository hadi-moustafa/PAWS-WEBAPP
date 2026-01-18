import { createClient } from '@/lib/supabase/server'
import { updateUser } from '../actions'
import styles from '@/app/login/login.module.css'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function EditStaffPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch existing user data
    const { data: user, error } = await supabase
        .from('User')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !user) {
        return <div>User not found.</div>
    }

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1rem' }}>
                <Link href="/superadmin/users" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                    ← Back to Directory
                </Link>
            </div>

            <div className={`neopop-card ${styles.formContainer}`} style={{ padding: '2rem', background: 'white' }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>✏️ Edit Staff Details</h1>

                <form action={async (formData) => {
                    'use server'
                    await updateUser(id, formData)
                }} className={styles.form}>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Full Name</label>
                        <input
                            name="name"
                            type="text"
                            required
                            defaultValue={user.name || ''}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input
                            type="email"
                            disabled
                            value={user.email || ''}
                            className={styles.input}
                            style={{ background: '#eee', cursor: 'not-allowed' }}
                        />
                        <small style={{ color: '#666' }}>Email cannot be changed directly.</small>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>System Role</label>
                        <select
                            name="role"
                            required
                            defaultValue={user.role}
                            className={styles.input}
                            style={{ background: 'white' }}
                        >
                            <option value="Vet">Vet (Doctor)</option>
                            <option value="Admin">Admin (Manager)</option>
                            <option value="Super_Admin">Super Admin</option>
                        </select>
                    </div>

                    <button type="submit" className="neopop-button" style={{
                        marginTop: '1rem',
                        width: '100%',
                        background: '#FFD700', // Yellow for edit
                        color: 'black'
                    }}>
                        Update Details
                    </button>
                </form>
            </div>
        </div>
    )
}
