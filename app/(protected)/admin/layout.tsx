import { logout } from '@/app/actions/auth'
import AdminNav from './components/AdminNav'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{ padding: '20px', minHeight: '100vh', background: '#FFFBE6', paddingBottom: '100px', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}> {/* Cream/Lemon tint for Neo-Pop base */}
            <header className="neopop-card" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem',
                marginBottom: '2rem',
                backgroundColor: '#93C572', // Pistachio for Admin
                border: '3px solid black',
                borderRadius: '12px',
                boxShadow: '6px 6px 0px black',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>⚙️</span>
                    <h2 style={{ margin: 0, color: 'black', textShadow: '2px 2px 0px white', fontWeight: '900', letterSpacing: '1px' }}>ADMIN DASHBOARD</h2>
                </div>
                <form action={logout}>
                    <button className="neopop-button" style={{
                        fontSize: '0.9rem',
                        padding: '0.5rem 1.5rem',
                        background: 'white',
                        color: 'black',
                        fontWeight: 'bold',
                        border: '2px solid black',
                        borderRadius: '8px',
                        boxShadow: '3px 3px 0px black',
                        cursor: 'pointer',
                        transition: 'all 0.1s'
                    }}>
                        LOGOUT
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
