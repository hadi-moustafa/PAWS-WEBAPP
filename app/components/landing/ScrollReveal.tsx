'use client'
import { useEffect, useRef, useState } from 'react'
import styles from './Landing.module.css'

interface ScrollRevealProps {
    children: React.ReactNode
    className?: string
    stagger?: boolean
}

export default function ScrollReveal({ children, className = '', stagger = false }: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true)
                observer.unobserve(entry.target)
            }
        }, {
            threshold: 0.1, // Trigger when 10% is visible
            rootMargin: '0px 0px -50px 0px' // Offset trigger slightly up
        })

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current)
        }
    }, [])

    return (
        <div
            ref={ref}
            className={`${className} ${stagger ? styles.revealStagger : styles.revealHidden} ${isVisible ? styles.revealVisible : ''}`}
        >
            {children}
        </div>
    )
}
