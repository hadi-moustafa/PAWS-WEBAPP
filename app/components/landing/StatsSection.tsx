import styles from './Landing.module.css'

export default function StatsSection() {
    return (
        <section className={styles.sectionContainer} style={{ background: 'transparent', padding: 0, border: 'none', boxShadow: 'none' }}>
            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <span className={styles.statNumber}>500+</span>
                    <span className={styles.statLabel}>Rescues</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statNumber}>350+</span>
                    <span className={styles.statLabel}>Adoptions</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statNumber}>24/7</span>
                    <span className={styles.statLabel}>Vote of Care</span>
                </div>
            </div>
        </section>
    )
}
