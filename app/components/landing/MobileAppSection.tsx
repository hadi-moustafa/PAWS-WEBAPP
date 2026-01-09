import styles from './Landing.module.css'
import Image from 'next/image'

export default function MobileAppSection() {
    return (
        <section className={styles.neoSection} style={{ padding: '4rem 2rem', background: '#ffeaa7' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '4rem' }}>

                {/* Visual Side */}
                <div style={{ position: 'relative', width: '300px', height: '600px', flexShrink: 0 }}>
                    {/* Phone Mockup Frame */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'black',
                        borderRadius: '40px',
                        padding: '15px',
                        boxShadow: '12px 12px 0px #FF9F1C'
                    }}>
                        <div style={{ width: '100%', height: '100%', background: 'white', borderRadius: '25px', overflow: 'hidden', position: 'relative' }}>
                            {/* Screen Content Mockup */}
                            <div style={{ padding: '1rem', background: '#f7f1e3', height: '100%' }}>
                                <div style={{ height: '20px', background: '#ffeaa7', borderRadius: '10px', marginBottom: '1rem', width: '50%' }}></div>
                                <div style={{ height: '150px', background: '#fab1a0', borderRadius: '10px', marginBottom: '1rem' }}></div>
                                <div style={{ height: '150px', background: '#81ecec', borderRadius: '10px', marginBottom: '1rem' }}></div>
                                <div style={{ height: '50px', background: '#fd79a8', borderRadius: '25px', marginTop: 'auto' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Side */}
                <div style={{ flex: 1, minWidth: '300px', textAlign: 'left' }}>
                    <div className="neopop-tag" style={{ background: '#2d3436', color: 'white', display: 'inline-block', padding: '0.25rem 0.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        📱 AVAILABLE NOW
                    </div>
                    <h2 style={{ fontSize: '3.5rem', lineHeight: '1', fontWeight: '900', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                        Adopt from<br />Anywhere.
                    </h2>
                    <p style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '2rem' }}>
                        Browse pets, schedule visits, and get updates on your favorite furry friends directly from your phone.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {/* Mock App Store Buttons */}
                        <button style={{
                            background: 'black',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '0.8rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            boxShadow: '4px 4px 0px white'
                        }}>
                            <span style={{ fontSize: '1.5rem' }}></span> App Store
                        </button>
                        <button style={{
                            background: 'black',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '0.8rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            boxShadow: '4px 4px 0px white'
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>▶</span> Play Store
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
