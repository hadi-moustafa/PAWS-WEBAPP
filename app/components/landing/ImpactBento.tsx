import styles from './Landing.module.css'
import ScrollReveal from './ScrollReveal'

export default function ImpactBento() {
    return (
        <section className={`${styles.neoSection} ${styles.patternGrid}`} style={{ padding: '4rem 0' }}>
            <ScrollReveal stagger className={styles.bentoGrid}>
                {/* Large Stats Card */}
                <div className={styles.bentoCard} style={{ gridColumn: 'span 2', background: '#2d3436', color: 'white' }}>
                    <h3 style={{ fontSize: '1.5rem', textTransform: 'uppercase', color: '#b8e994' }}>Mission Control</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <span style={{ fontSize: '6rem', lineHeight: '1', fontWeight: '900' }}>562</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#dfe6e9' }}>lives saved<br />since 2024</span>
                    </div>
                </div>

                {/* Urgent Alert */}
                <div className={styles.bentoCard} style={{ background: '#ff7675' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3 style={{ margin: 0 }}>🚨 URGENT</h3>
                        <span style={{ fontSize: '2rem' }}>🧣</span>
                    </div>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '1rem' }}>We need thick blankets for the winter!</p>
                    <button className="neopop-button" style={{ marginTop: 'auto', width: '100%', background: 'white', color: 'black' }}>
                        Start a Drive
                    </button>
                </div>

                {/* Rating/Social Proof */}
                <div className={styles.bentoCard} style={{ background: '#b8e994', color: 'black' }}>
                    <h3 style={{ fontSize: '5rem', fontWeight: '900', margin: 0, lineHeight: 0.8 }}>4.9</h3>
                    <div style={{ fontSize: '1.5rem' }}>★★★★★</div>
                    <p style={{ fontWeight: 'bold' }}>"Best shelter ever!" - Jane D.</p>
                </div>

                {/* Did You Know */}
                <div className={styles.bentoCard} style={{ gridColumn: 'span 2', background: 'white' }}>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ fontSize: '4rem' }}>💡</div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Did You Know?</h3>
                            <p style={{ fontSize: '1.1rem' }}>
                                Adopting a pet improves heart health and reduces stress.
                                It's literally prescribed by happiness doctors (probably).
                            </p>
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </section>
    )
}
