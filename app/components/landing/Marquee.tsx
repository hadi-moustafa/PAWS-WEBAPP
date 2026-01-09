import styles from './Landing.module.css'

export default function Marquee() {
    return (
        <div style={{
            background: '#ffeaa7',
            borderBottom: '4px solid black',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            padding: '0.8rem 0',
            fontWeight: '900',
            textTransform: 'uppercase',
            fontSize: '1.2rem',
            letterSpacing: '1px'
        }}>
            <div className={styles.carouselTrack} style={{ animationDuration: '40s' }}>
                <span>🐾 5 Pets Adopted Today!</span>
                <span style={{ margin: '0 2rem' }}>•</span>
                <span>🚨 Foster Needed: Senior Dog "Buster"</span>
                <span style={{ margin: '0 2rem' }}>•</span>
                <span>💉 Low-Cost Vax Clinic this Saturday</span>
                <span style={{ margin: '0 2rem' }}>•</span>
                <span>🧡 Volunteers Needed for Dog Walking</span>
                <span style={{ margin: '0 2rem' }}>•</span>
                <span>🐾 5 Pets Adopted Today!</span>
                <span style={{ margin: '0 2rem' }}>•</span>
                <span>🚨 Foster Needed: Senior Dog "Buster"</span>
            </div>
        </div>
    )
}
