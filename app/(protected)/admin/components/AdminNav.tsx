'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from '../../superadmin/components/nav.module.css' // Reusing the bone style!

export default function AdminNav() {
    const pathname = usePathname()
    const [isVisible, setIsVisible] = useState(true)

    const isActive = (path: string) => pathname?.startsWith(path)

    return (
        <div className={styles.navContainer}>
            <div style={{
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
            }}>
                {isVisible && (
                    <nav className={styles.boneBar} style={{
                        background: '#93C572', // Pistachio background for Admin nav
                        borderColor: 'black',
                        boxShadow: '6px 6px 0px black'
                    }}>
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

                        <Link href="/admin/chat" className={`${styles.navLink} ${isActive('/admin/chat') ? styles.active : ''}`}>
                            <span className={styles.icon}>💬</span>
                            <span className={styles.label}>Chat</span>
                        </Link>

                        <Link href="/admin/appointments" className={`${styles.navLink} ${isActive('/admin/appointments') ? styles.active : ''}`}>
                            <span className={styles.icon}>📅</span>
                            <span className={styles.label}>Schedule</span>
                        </Link>

                        <Link href="/admin/settings" className={`${styles.navLink} ${isActive('/admin/settings') ? styles.active : ''}`}>
                            <span className={styles.icon}>⚙️</span>
                            <span className={styles.label}>Settings</span>
                        </Link>
                    </nav>
                )}

                <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="neopop-button"
                    style={{
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        background: isVisible ? '#fab1a0' : '#ffeaa7',
                        border: '3px solid black',
                        boxShadow: '4px 4px 0px black',
                        cursor: 'pointer',
                        transition: 'transform 0.1s'
                    }}
                    title={isVisible ? "Hide Navigation" : "Show Navigation"}
                >
                    {isVisible ? '😺' : '🙈'}
                </button>
            </div>
        </div>
    )
}
