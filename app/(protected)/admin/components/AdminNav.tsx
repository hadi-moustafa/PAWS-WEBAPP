'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from '../../superadmin/components/nav.module.css' // Reusing the bone style!

export default function AdminNav() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname?.startsWith(path)

    return (
        <div className={styles.navContainer}>
            <nav className={styles.boneBar} style={{ borderColor: '#93C572', boxShadow: '4px 4px 0px #93C572' }}>
                <Link href="/admin/inventory" className={`${styles.navLink} ${isActive('/admin/inventory') ? styles.active : ''}`}>
                    <span className={styles.icon}>📦</span>
                    <span className={styles.label}>Stock</span>
                </Link>

                <Link href="/admin/pets" className={`${styles.navLink} ${isActive('/admin/pets') ? styles.active : ''}`}>
                    <span className={styles.icon}>🐾</span>
                    <span className={styles.label}>Pets</span>
                </Link>

                <Link href="/admin" className={`${styles.navLink} ${pathname === '/admin' ? styles.active : ''}`}>
                    <span className={styles.icon}>🏭</span>
                    <span className={styles.label}>Deck</span>
                </Link>

                <Link href="/admin/reports" className={`${styles.navLink} ${isActive('/admin/reports') ? styles.active : ''}`}>
                    <span className={styles.icon}>📋</span>
                    <span className={styles.label}>Reports</span>
                </Link>

                <Link href="/admin/appointments" className={`${styles.navLink} ${isActive('/admin/appointments') ? styles.active : ''}`}>
                    <span className={styles.icon}>📅</span>
                    <span className={styles.label}>Schedule</span>
                </Link>
            </nav>
        </div>
    )
}
