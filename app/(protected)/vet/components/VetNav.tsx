'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from '../../superadmin/components/nav.module.css' // Reuse bone style

export default function VetNav() {
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
                    <nav className={styles.boneBar} style={{ borderColor: 'black', boxShadow: '4px 4px 0px black', background: '#FF9F1C' }}>
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
