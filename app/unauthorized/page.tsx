import Link from 'next/link'

export default function UnauthorizedPage() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            backgroundColor: 'var(--background)'
        }}>
            <div className="neopop-card" style={{ padding: '3rem', maxWidth: '500px' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>🚫</h1>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Access Denied</h2>
                <p style={{ marginBottom: '2rem' }}>
                    You do not have permission to view this area.
                </p>
                <Link href="/" className="neopop-button">
                    Return Home
                </Link>
            </div>
        </div>
    )
}
