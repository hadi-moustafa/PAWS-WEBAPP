'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './nav.module.css'

export default function SuperAdminNav() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname?.startsWith(path)

    return (
        <div className={styles.navContainer}>
            <nav className={styles.boneBar}>
                <Link href="/superadmin/users" className={`${styles.navLink} ${isActive('/superadmin/users') ? styles.active : ''}`}>
                    <span className={styles.icon}>🐯</span>
                    <span className={styles.label}>Team</span>
                </Link>

                <Link href="/superadmin" className={`${styles.navLink} ${pathname === '/superadmin' ? styles.active : ''}`}>
                    <span className={styles.icon}>🏠</span>
                    <span className={styles.label}>Base</span>
                </Link>

                <Link href="/superadmin/finance" className={`${styles.navLink} ${isActive('/superadmin/finance') ? styles.active : ''}`}>
                    <span className={styles.icon}>🦴</span>
                    <span className={styles.label}>Funds</span>
                </Link>
            </nav>
        </div>
    )
}
