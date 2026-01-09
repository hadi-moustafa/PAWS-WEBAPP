import styles from './Landing.module.css'

export default function Newsletter() {
    return (
        <section className={styles.neoSection} style={{ padding: '6rem 2rem', background: '#a29bfe', textAlign: 'center' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '3rem', color: 'white', textShadow: '4px 4px 0px black', marginBottom: '1rem' }}>
                    DON'T MISS A TAIL WAG.
                </h2>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                    Join 10,000+ humans getting the weekly fluff update.
                </p>
                <form style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <input type="email" placeholder="you@human.com" style={{
                        padding: '1rem',
                        fontSize: '1.2rem',
                        border: '4px solid black',
                        borderRadius: '8px',
                        width: '300px',
                        fontWeight: 'bold'
                    }} />
                    <button className="neopop-button" style={{ fontSize: '1.2rem', background: '#FF9F1C' }}>
                        SUBSCRIBE
                    </button>
                </form>
            </div>
        </section>
    )
}
