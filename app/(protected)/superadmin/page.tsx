import WeatherClock from './components/WeatherClock'
import Image from 'next/image'

export default function SuperAdminDashboard() {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <WeatherClock />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Welcome Section */}
                <div className="neopop-card" style={{ padding: '2rem', background: 'white' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Command Center</h1>
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
                        Welcome back, Super Admin.
                        The shelter is running smoothly today.
                        We have <strong style={{ color: 'var(--secondary)' }}>12 new applications</strong> and
                        <strong style={{ color: 'var(--secondary)' }}> 5 vet requests</strong> pending.
                    </p>
                </div>

                {/* Featured Resident (Real Pet Image) */}
                <div className="neopop-card" style={{
                    padding: '1rem',
                    background: 'white',
                    transform: 'rotate(2deg)',
                    textAlign: 'center'
                }}>
                    {/* Using a placeholder for a real dog from placedog.net */}
                    <div style={{
                        border: '3px solid black',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        height: '250px',
                        position: 'relative',
                        marginBottom: '1rem'
                    }}>
                        <Image
                            src="https://placedog.net/600/400?random"
                            alt="Featured Pet"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    <h3 style={{ margin: 0 }}>🐶 Resident of the Day</h3>
                    <p>Keeping morale high!</p>
                </div>
            </div>

            {/* Quick Links Row with bouncy animals */}
            <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                <div className="neopop-card" style={{ padding: '1rem', background: '#fff', width: '200px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem', animation: 'bounce 2s infinite' }}>🐱</div>
                    <h3>New Intakes</h3>
                </div>
                <div className="neopop-card" style={{ padding: '1rem', background: '#fff', width: '200px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem', animation: 'bounce 2s infinite 0.5s' }}>🐰</div>
                    <h3>Adoptions</h3>
                </div>
                <div className="neopop-card" style={{ padding: '1rem', background: '#fff', width: '200px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem', animation: 'bounce 2s infinite 1s' }}>🦜</div>
                    <h3>Supplies</h3>
                </div>
            </div>

            <style>{`
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
        `}</style>
        </div>
    )
}
