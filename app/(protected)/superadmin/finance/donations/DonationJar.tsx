'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Donation {
    id: number
    amount: number
    message: string | null
    currency: string
    createdAt: string
    // user? name?
}

export default function DonationJar({ initialDonations }: { initialDonations: Donation[] }) {
    const [donations, setDonations] = useState<Donation[]>(initialDonations)
    const supabase = createClient()

    useEffect(() => {
        const channel = supabase
            .channel('donations-jar')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'Donation' },
                (payload) => {
                    console.log('New donation!', payload)
                    const newDonation = payload.new as Donation
                    setDonations((prev) => [newDonation, ...prev])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    // Calculate total
    const totalAmount = donations.reduce((acc, curr) => acc + Number(curr.amount), 0)

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', minHeight: '80vh' }}>
            <div className="neopop-card" style={{
                background: '#fff',
                marginBottom: '2rem',
                textAlign: 'center',
                padding: '1rem 3rem',
                border: '3px solid black',
                boxShadow: '4px 4px 0px black'
            }}>
                <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900' }}>🍪 Cookie Jar Donations</h1>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>Every cookie is a donation!</p>
                <div style={{ marginTop: '1rem', fontSize: '2rem', fontWeight: 'bold', color: '#00b894' }}>
                    Total: ${totalAmount.toFixed(2)}
                </div>
            </div>

            {/* THE JAR */}
            <div style={{
                position: 'relative',
                width: '400px',
                height: '500px',
                background: 'rgba(255, 255, 255, 0.4)',
                border: '8px solid black',
                borderTop: 'none',
                borderRadius: '0 0 50px 50px',
                backdropFilter: 'blur(5px)',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1), 10px 10px 0px rgba(0,0,0,0.1)'
            }}>
                {/* Jar Lid / Rim (Visual only) */}
                <div style={{
                    position: 'absolute',
                    top: -10,
                    left: -8,
                    right: -8,
                    height: '20px',
                    border: '8px solid black',
                    borderRadius: '10px',
                    background: '#dfe6e9'
                }} />

                <div style={{
                    padding: '2rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignContent: 'flex-end',
                    height: '100%',
                    gap: '10px',
                    overflowY: 'auto' // Allow scrolling if too many cookies
                }}>
                    <AnimatePresence>
                        {donations.map((d) => (
                            <motion.div
                                key={d.id}
                                initial={{ y: -500, opacity: 0, rotate: 0 }}
                                animate={{ y: 0, opacity: 1, rotate: (d.id * 33) % 360 }} // Deterministic rotation based on ID to avoid hydration mismatch
                                transition={{ type: 'spring', bounce: 0.4 }}
                                title={`$${d.amount} - ${d.message || 'No message'}`}
                                style={{
                                    width: d.amount < 10 ? 40 : d.amount < 50 ? 60 : d.amount < 100 ? 80 : 100,
                                    height: d.amount < 10 ? 40 : d.amount < 50 ? 60 : d.amount < 100 ? 80 : 100,
                                    background: '#e1b12c',
                                    borderRadius: d.amount < 10 ? '50%' : d.amount < 50 ? '10%' : d.amount < 100 ? '0%' : '50%', // Circle, Rounded Square, Square, (Polygon for others)
                                    clipPath: d.amount < 100 ? 'none' : 'polygon(50% 0%, 0% 100%, 100% 100%)', // Triangle for > 100
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid #b78e24',
                                    position: 'relative',
                                    cursor: 'help',
                                    userSelect: 'none'
                                }}
                            >
                                {/* Chocolate Chips */}
                                <div style={{ position: 'absolute', top: '20%', left: '20%', width: '15%', height: '15%', background: '#63421d', borderRadius: '50%' }} />
                                <div style={{ position: 'absolute', top: '20%', right: '20%', width: '15%', height: '15%', background: '#63421d', borderRadius: '50%' }} />
                                <div style={{ position: 'absolute', bottom: '20%', left: '30%', width: '15%', height: '15%', background: '#63421d', borderRadius: '50%' }} />
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', background: '#63421d', borderRadius: '50%' }} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {donations.length === 0 && (
                        <div style={{ width: '100%', textAlign: 'center', color: '#666', fontStyle: 'italic', paddingBottom: '2rem' }}>
                            The jar is empty... waiting for kindness!
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                /* Hide scrollbar for the jar */
                ::-webkit-scrollbar {
                    width: 0px;
                    background: transparent;
                }
            `}</style>
        </div>
    )
}
