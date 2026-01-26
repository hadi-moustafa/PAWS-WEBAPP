'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts'

interface Donation {
    id: number
    amount: number
    message: string | null
    currency: string
    createdAt: string
    userId: string
    // In a real app we'd join with profiles, but for now we might just show ID or "Anonymous" 
    // or try to fetch names if available. Assuming raw table for now.
}

const COLORS = ['#FF9F1C', '#2EC4B6', '#E71D36', '#FF9F1C']

export default function DonationAnalytics({ initialDonations }: { initialDonations: Donation[] }) {
    const supabase = createClient()
    const [donations, setDonations] = useState<Donation[]>(initialDonations)

    // Listen for new donations
    useEffect(() => {
        const channel = supabase
            .channel('analytics-donations')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'Donation' },
                (payload) => {
                    const newDonation = payload.new as Donation
                    setDonations(prev => [newDonation, ...prev])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    // Derived Stats
    const stats = useMemo(() => {
        const total = donations.reduce((acc, curr) => acc + Number(curr.amount), 0)
        const count = donations.length
        const max = Math.max(...donations.map(d => Number(d.amount)), 0)
        return { total, count, max }
    }, [donations])

    // Graph Data - Group by Date or just show Top Recent? 
    // Let's show "Recent Donations" as bars for now to make it fun.
    const graphData = useMemo(() => {
        return donations.slice(0, 10).map((d, i) => ({
            name: `Donation #${d.id}`,
            amount: Number(d.amount),
            message: d.message || 'No message'
        })).reverse()
    }, [donations])

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-outfit)' }}>
            {/* Header */}
            <div className="neopop-card" style={{
                marginBottom: '2rem',
                padding: '1.5rem',
                background: '#FF9F1C',
                border: '4px solid black',
                boxShadow: '8px 8px 0px black',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', textShadow: '2px 2px 0px black' }}>
                        📊 Donation Stats
                    </h1>
                    <p style={{ margin: 0, fontWeight: 'bold', opacity: 0.9 }}>Tracking every paw-print!</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '3rem', fontWeight: '900', textShadow: '2px 2px 0px black' }}>
                        ${stats.total.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Total Raised</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Left Column: Graph & Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Small Stats Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="neopop-card" style={{ padding: '1rem', background: '#2EC4B6', border: '3px solid black', boxShadow: '4px 4px 0px black', color: 'white' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '900' }}>{stats.count}</div>
                            <div style={{ fontWeight: 'bold' }}>Donations</div>
                        </div>
                        <div className="neopop-card" style={{ padding: '1rem', background: '#E71D36', border: '3px solid black', boxShadow: '4px 4px 0px black', color: 'white' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '900' }}>${stats.max}</div>
                            <div style={{ fontWeight: 'bold' }}>Biggest Gift</div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="neopop-card" style={{
                        padding: '1.5rem',
                        background: 'white',
                        border: '4px solid black',
                        boxShadow: '8px 8px 0px black',
                        minHeight: '400px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontWeight: '900', fontSize: '1.5rem' }}>📈 Recent Trends</h3>
                        <div style={{ flex: 1, width: '100%', minHeight: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={graphData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" hide />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '3px solid black',
                                            boxShadow: '4px 4px 0px black',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                    <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
                                        {graphData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column: Donor List */}
                <div className="neopop-card" style={{
                    padding: '1.5rem',
                    background: '#CBF3F0',
                    border: '4px solid black',
                    boxShadow: '8px 8px 0px black',
                    maxHeight: '600px',
                    overflowY: 'auto'
                }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontWeight: '900', fontSize: '1.5rem' }}>💖 Recent Donors</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {donations.map((d, i) => (
                            <div key={d.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                background: 'white',
                                border: '3px solid black',
                                borderRadius: '12px',
                                boxShadow: '2px 2px 0px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: COLORS[i % COLORS.length],
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    border: '2px solid black'
                                }}>
                                    {['🐶', '🐱', '🐰', '🐹', '🦊', '🐼'][i % 6]}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold' }}>Donor #{d.id}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{d.message || 'No message'}</div>
                                </div>
                                <div style={{ fontWeight: '900', color: '#2EC4B6', fontSize: '1.2rem' }}>
                                    ${Number(d.amount).toFixed(0)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
