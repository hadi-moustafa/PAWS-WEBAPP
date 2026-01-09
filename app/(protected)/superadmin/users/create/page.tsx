import { createStaffUser } from '../../actions'
import styles from '@/app/login/login.module.css' // Reuse login styles for consistency
import Link from 'next/link'

export default async function CreateStaffPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const params = await searchParams;
    const error = params.error;

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1rem' }}>
                <Link href="/superadmin/users" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                    ← Back to Directory
                </Link>
            </div>

            <div className={`neopop-card ${styles.formContainer}`} style={{ padding: '2rem', background: 'white' }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>✨ Recruit New Staff</h1>

                <form action={createStaffUser} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Full Name</label>
                        <input name="name" type="text" required className={styles.input} placeholder="e.g. Dr. Dolittle" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input name="email" type="email" required className={styles.input} placeholder="doctor@paws.com" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>System Role</label>
                        <select name="role" required className={styles.input} style={{ background: 'white' }}>
                            <option value="Vet">Vet (Doctor)</option>
                            <option value="Admin">Admin (Manager)</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Initial Password</label>
                        <input name="password" type="text" required className={styles.input} defaultValue="paws123" />
                        <small style={{ color: '#666' }}>Share this with them securely.</small>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button type="submit" className="neopop-button" style={{ marginTop: '1rem', width: '100%' }}>
                        Create Staff Account
                    </button>
                </form>
            </div>
        </div>
    )
}
