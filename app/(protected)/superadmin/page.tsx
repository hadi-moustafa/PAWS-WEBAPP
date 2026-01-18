import WeatherClock from './components/WeatherClock'
import Image from 'next/image'
import Link from 'next/link'

export default function SuperAdminDashboard() {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
            <WeatherClock />

            {/* Impact Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="neopop-card" style={{
                    padding: '2rem',
                    background: '#FF9F1C', // Orange
                    border: '3px solid black',
                    boxShadow: '8px 8px 0px black',
                    borderRadius: '16px',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ fontSize: '4rem', opacity: 0.2, position: 'absolute', right: '-10px', top: '-10px', transform: 'rotate(15deg)' }}>📝</div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Applications</h3>
                    <p style={{ fontSize: '3.5rem', margin: '0.5rem 0', fontWeight: '900', textShadow: '3px 3px 0px black' }}>12</p>
                    <div style={{ background: 'black', color: '#FF9F1C', padding: '0.2rem 0.5rem', display: 'inline-block', fontWeight: 'bold', fontSize: '0.8rem' }}>ACTION NEEDED</div>
                </div>

                <div className="neopop-card" style={{
                    padding: '2rem',
                    background: '#93C572', // Pistachio
                    border: '3px solid black',
                    boxShadow: '8px 8px 0px black',
                    borderRadius: '16px',
                    color: 'black',
                    position: 'relative'
                }}>
                    <div style={{ fontSize: '4rem', opacity: 0.2, position: 'absolute', right: '-10px', top: '-10px', transform: 'rotate(-15deg)' }}>🩺</div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '900' }}>Vet Requests</h3>
                    <p style={{ fontSize: '3.5rem', margin: '0.5rem 0', fontWeight: '900', color: 'white', textShadow: '3px 3px 0px black' }}>5</p>
                    <div style={{ background: 'white', border: '2px solid black', padding: '0.2rem 0.5rem', display: 'inline-block', fontWeight: 'bold', fontSize: '0.8rem' }}>URGENT</div>
                </div>

                <div className="neopop-card" style={{
                    padding: '2rem',
                    background: '#ffffff',
                    border: '3px solid black',
                    boxShadow: '8px 8px 0px black',
                    borderRadius: '16px',
                    position: 'relative'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Total Pets</h3>
                    <p style={{ fontSize: '3.5rem', margin: '0.5rem 0', fontWeight: '900', color: '#FF9F1C', textShadow: '2px 2px 0px black' }}>48</p>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>↑ 3 this week</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Main Action Area */}
                <div>
                    <h2 style={{
                        fontSize: '2rem',
                        marginBottom: '1.5rem',
                        fontWeight: '900',
                        textShadow: '2px 2px 0px white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        🚀 QUICK ACTIONS
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <Link href="/superadmin/users/create" style={{ textDecoration: 'none' }}>
                            <div className="action-card" style={{
                                background: '#FFD700', // Yellow
                                border: '3px solid black',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                boxShadow: '5px 5px 0px black',
                                height: '100%',
                                transition: 'transform 0.1s',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <span style={{ fontSize: '2.5rem' }}>👤</span>
                                <div>
                                    <h3 style={{ margin: 0, color: 'black', fontSize: '1.2rem' }}>Add Staff</h3>
                                    <p style={{ margin: 0, color: '#333', fontSize: '0.9rem' }}>Register new admin/vet</p>
                                </div>
                            </div>
                        </Link>



                        <Link href="/superadmin/finance" style={{ textDecoration: 'none' }}>
                            <div className="action-card" style={{
                                background: '#4DD0E1', // Cyan
                                border: '3px solid black',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                boxShadow: '5px 5px 0px black',
                                height: '100%',
                                transition: 'transform 0.1s',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <span style={{ fontSize: '2.5rem' }}>💰</span>
                                <div>
                                    <h3 style={{ margin: 0, color: 'black', fontSize: '1.2rem' }}>Finances</h3>
                                    <p style={{ margin: 0, color: '#333', fontSize: '0.9rem' }}>Review ledger</p>
                                </div>
                            </div>
                        </Link>

                        <div className="action-card" style={{
                            background: 'white',
                            border: '3px solid black',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            boxShadow: '5px 5px 0px black',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderStyle: 'dashed'
                        }}>
                            <span style={{ color: '#aaa', fontWeight: 'bold' }}>More soon...</span>
                        </div>
                    </div>
                </div>

                {/* Featured Resident (Real Pet Image) */}
                <div className="neopop-card" style={{
                    padding: '1rem 1rem 2rem 1rem',
                    background: 'white',
                    border: '3px solid black',
                    boxShadow: '8px 8px 0px black',
                    transform: 'rotate(2deg)',
                    textAlign: 'center',
                    height: 'fit-content'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        borderBottom: '2px solid black',
                        paddingBottom: '0.5rem'
                    }}>
                        <h3 style={{ margin: 0, fontWeight: '900' }}>⭐ STAR RESIDENT</h3>
                        <span style={{ background: '#FF9F1C', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid black', fontSize: '0.8rem', fontWeight: 'bold' }}>#124</span>
                    </div>

                    <div style={{
                        border: '3px solid black',
                        borderRadius: '0px',
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
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '0.5rem',
                            fontWeight: 'bold'
                        }}>
                            BARNABY (2y)
                        </div>
                    </div>
                    <p style={{ fontStyle: 'italic', fontWeight: 'bold', margin: 0 }}>"Loves peanut butter and belly rubs!"</p>
                </div>
            </div>

            <style>{`
            .action-card:hover {
                transform: translate(-3px, -3px);
                box-shadow: 8px 8px 0px black !important;
            }
        `}</style>
        </div >
    )
}
