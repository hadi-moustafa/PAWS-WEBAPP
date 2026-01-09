'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from '../../superadmin/components/nav.module.css' // Reuse bone style

export default function VetNav() {
    const pathname = usePathname()
    const isActive = (path: string) => pathname?.startsWith(path)

    return (
        <div className={styles.navContainer}>
            <nav className={styles.boneBar} style={{ borderColor: '#FF9F1C', boxShadow: '4px 4px 0px #FF9F1C', background: '#ecf0f1' }}>
                <Link href="/vet" className={`${styles.navLink} ${pathname === '/vet' ? styles.active : ''}`}>
                    <span className={styles.icon}>🩺</span>
                    <span className={styles.label}>Triage</span>
                </Link>

                <Link href="/vet/patients" className={`${styles.navLink} ${isActive('/vet/patients') ? styles.active : ''}`}>
                    <span className={styles.icon}>🐶</span>
                    <span className={styles.label}>Patients</span>
                </Link>

                <Link href="/vet/appointments" className={`${styles.navLink} ${isActive('/vet/appointments') ? styles.active : ''}`}>
                    <span className={styles.icon}>📅</span>
                    <span className={styles.label}>Schedule</span>
                </Link>
            </nav>
        </div>
    )
}
