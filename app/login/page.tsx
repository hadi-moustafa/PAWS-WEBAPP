import { login } from './actions'
import styles from './login.module.css'
import Scene3D from './components/Scene3D'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const params = await searchParams;
    const errorMessage = params.error;

    return (
        <div className={styles.container} style={{ background: '#7bed9f', overflow: 'hidden' }}>
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                <Scene3D />
            </div>

            <div className={`${styles.card} neopop-card`} style={{ zIndex: 10, position: 'relative' }}>
                <h1 className={styles.title}>Staff Login</h1>
                <p className={styles.subtitle}>Enter your credentials as the ducklings watch.</p>

                <form className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className={styles.input}
                            placeholder="staff@paws.com"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className={styles.input}
                            placeholder="••••••••"
                        />
                    </div>

                    {errorMessage && (
                        <div className={styles.error}>
                            {errorMessage}
                        </div>
                    )}

                    <button formAction={login} className="neopop-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}
