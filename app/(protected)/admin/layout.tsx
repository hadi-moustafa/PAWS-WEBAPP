import { logout } from '@/app/actions/auth'
import AdminNav from './components/AdminNav'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{ padding: '20px', minHeight: '100vh', background: '#F0FDF4', paddingBottom: '100px' }}> {/* Light Green tint */}
            <header className="neopop-card" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem',
                marginBottom: '2rem',
                backgroundColor: '#93C572' // Pistachio
            }}>
                <h2 style={{ margin: 0, color: 'black' }}>⚙️ ADMIN DASHBOARD</h2>
                <form action={logout}>
                    <button className="neopop-button" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: 'white', color: 'black' }}>
                        Logout
                    </button>
                </form>
            </header>
            <main>
                {children}
            </main>
            <AdminNav />
        </div>
    )
}
