'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from './nav.module.css'

export default function SuperAdminNav() {
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
                    <nav className={styles.boneBar}>
                        <Link href="/superadmin/users" className={`${styles.navLink} ${isActive('/superadmin/users') ? styles.active : ''}`}>
                            <span className={styles.icon}>🐯</span>
                            <span className={styles.label}>Team</span>
                        </Link>

                        <Link href="/superadmin" className={`${styles.navLink} ${pathname === '/superadmin' ? styles.active : ''}`}>
                            <span className={styles.icon}>🏠</span>
                            <span className={styles.label}>Base</span>
                        </Link>

                        <Link href="/superadmin/finance" className={`${styles.navLink} ${isActive('/superadmin/finance') && !isActive('/superadmin/finance/donations') ? styles.active : ''}`}>
                            <span className={styles.icon}>🦴</span>
                            <span className={styles.label}>Funds</span>
                        </Link>

                        <Link href="/superadmin/finance/donations" className={`${styles.navLink} ${isActive('/superadmin/finance/donations') ? styles.active : ''}`}>
                            <span className={styles.icon}>📊</span>
                            <span className={styles.label}>Analytics</span>
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
