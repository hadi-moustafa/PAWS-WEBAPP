import { logout } from '@/app/actions/auth'
import SuperAdminNav from './components/SuperAdminNav'

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{ padding: '20px', minHeight: '100vh', background: '#FFF5E6', paddingBottom: '100px' }}> {/* Light Orange tint */} {/* Padding bottom for fixed nav */}
            <header className="neopop-card" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem',
                marginBottom: '2rem',
                backgroundColor: '#FF9F1C' // Orange
            }}>
                <h2 style={{ margin: 0, color: 'white' }}>🛡️ SUPER ADMIN</h2>
                <form action={logout}>
                    <button className="neopop-button" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: 'white', color: 'black' }}>
                        Logout
                    </button>
                </form>
            </header>
            <main>
                {children}
            </main>
            <SuperAdminNav />
        </div>
    )
}
