import { logout } from '@/app/actions/auth'
import SuperAdminNav from './components/SuperAdminNav'

export default function SuperAdminLayout({
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
                backgroundColor: '#FF9F1C', // Neo-Pop Orange
                border: '3px solid black',
                borderRadius: '12px',
                boxShadow: '6px 6px 0px black',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>👑</span>
                    <h2 style={{ margin: 0, color: 'white', textShadow: '2px 2px 0px black', fontWeight: '900', letterSpacing: '1px' }}>SUPER ADMIN</h2>
                </div>
                <form action={logout}>
                    <button className="neopop-button" style={{
                        fontSize: '0.9rem',
                        padding: '0.5rem 1.5rem',
                        background: '#93C572', // Pistachio
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
            <SuperAdminNav />
        </div>
    )
}
