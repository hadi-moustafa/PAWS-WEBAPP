import styles from './Landing.module.css'
import Link from 'next/link'
import LiveClock from './LiveClock'

export default function Footer() {
    return (
        <footer className={styles.footer} style={{ width: '100%', maxWidth: 'none', margin: 0, borderRadius: 0, border: 'none', borderTop: '4px solid black', background: '#2d3436' }}>
            <div className={styles.socials}>
                <Link href="https://instagram.com" className={styles.socialLink} target="_blank">
                    <img src="https://cdn-icons-png.flaticon.com/512/3955/3955024.png" alt="IG" width={30} height={30} />
                </Link>
                <Link href="https://twitter.com" className={styles.socialLink} target="_blank">
                    <img src="https://cdn-icons-png.flaticon.com/512/3670/3670151.png" alt="TW" width={30} height={30} />
                </Link>
                <Link href="https://facebook.com" className={styles.socialLink} target="_blank">
                    <img src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" alt="FB" width={30} height={30} />
                </Link>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Done with ❤️ by PAWS Team</p>
                <LiveClock />
            </div>

            <p className={styles.footerText} style={{ fontSize: '0.8rem' }}>
                © {new Date().getFullYear()} PAWS Shelter. All rights reserved. <br />
                Don't shop, Adopt!
            </p>
        </footer>
    )
}
