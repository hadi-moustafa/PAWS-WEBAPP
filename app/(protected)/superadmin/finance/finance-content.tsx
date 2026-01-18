"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getFinanceStats, getRecentTransactions } from "@/app/actions/finance";

interface FinanceContentProps {
    initialStats: {
        totalFunds: number;
        categoryStats: { name: string; value: number; revenue: number }[];
    };
    initialTransactions: any[];
}

export default function FinanceContent({
    initialStats,
    initialTransactions,
}: FinanceContentProps) {
    const [stats, setStats] = useState(initialStats);
    const [transactions, setTransactions] = useState(initialTransactions);
    const supabase = createClient();

    // Function to refresh data
    const refreshData = async () => {
        console.log("Refreshing finance data...");
        const newStats = await getFinanceStats();
        const newTransactions = await getRecentTransactions();
        setStats(newStats);
        setTransactions(newTransactions);
    };

    useEffect(() => {
        // Realtime subscription to 'Order' table
        const channel = supabase
            .channel("finance-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "Order" },
                (payload) => {
                    console.log("Change received!", payload);
                    refreshData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="neopop-card" style={{
                    padding: '0.8rem 1.5rem',
                    display: 'inline-block',
                    fontSize: '1.8rem',
                    margin: 0,
                    background: '#4DD0E1', // Cyan
                    color: 'black',
                    border: '3px solid black',
                    boxShadow: '4px 4px 0px black',
                    transform: 'rotate(2deg)'
                }}>
                    💰 FINANCIAL OVERVIEW
                </h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={refreshData}
                        className="neopop-button"
                        style={{
                            background: 'white',
                            color: 'black',
                            padding: '0.8rem 1.5rem',
                            border: '3px solid black',
                            fontWeight: 'bold',
                            boxShadow: '4px 4px 0px black',
                            cursor: 'pointer'
                        }}>
                        ⬇️ REFRESH
                    </button>
                </div>
            </div>

            {/* Top Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="neopop-card" style={{
                    padding: '1.5rem',
                    background: '#FFFBE6',
                    border: '3px solid black',
                    boxShadow: '6px 6px 0px black',
                    backgroundImage: 'radial-gradient(circle, #ddd 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}>
                    <h3 style={{ textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '0.5rem', background: 'black', color: 'white', display: 'inline-block', padding: '0.2rem 0.5rem' }}>Total Funds</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: '900', color: '#93C572', textShadow: '2px 2px 0px black', margin: 0 }}>
                        ${stats.totalFunds.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Statistics Area: Categories */}
            <div className="neopop-card" style={{
                padding: '1.5rem',
                background: 'white',
                border: '3px solid black',
                boxShadow: '6px 6px 0px black',
                marginBottom: '3rem'
            }}>
                <h3 style={{ margin: '0 0 1rem 0', fontWeight: '900', fontSize: '1.2rem', textTransform: 'uppercase' }}>📊 Category Sales Performance</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {stats.categoryStats.length === 0 ? (
                        <p>No sales data available yet.</p>
                    ) : (
                        stats.categoryStats.map((cat, idx) => {
                            // Calculate width percentage relative to max
                            const maxVal = Math.max(...stats.categoryStats.map(c => c.value));
                            const widthPct = (cat.value / maxVal) * 100;

                            return (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '150px', fontWeight: 'bold' }}>{cat.name}</div>
                                    <div style={{ flex: 1, background: '#eee', height: '24px', border: '2px solid black', position: 'relative' }}>
                                        <div style={{
                                            width: `${widthPct}%`,
                                            height: '100%',
                                            background: idx % 2 === 0 ? '#FF9F1C' : '#F06292',
                                            transition: 'width 0.5s ease-out'
                                        }}></div>
                                    </div>
                                    <div style={{ width: '100px', textAlign: 'right', fontWeight: 'bold' }}>
                                        {cat.value} sold<br />
                                        <span style={{ fontSize: '0.8em', color: '#666' }}>${cat.revenue.toLocaleString()}</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Ledger Table */}
            <div className="neopop-card" style={{
                background: 'white',
                border: '3px solid black',
                boxShadow: '8px 8px 0px black',
                padding: '0',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '1rem', background: '#F8F8F8', borderBottom: '3px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.2rem' }}>🧾 RECENT ORDERS</h3>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666' }}>LATEST TRANSACTIONS</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#eee', borderBottom: '3px solid black' }}>
                            <th style={{ padding: '1rem', borderRight: '2px solid black' }}>Date</th>
                            <th style={{ padding: '1rem', borderRight: '2px solid black' }}>ID</th>
                            <th style={{ padding: '1rem', borderRight: '2px solid black' }}>Description</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: '1rem', textAlign: 'center' }}>No transactions found</td></tr>
                        ) : (
                            transactions.map((trx, index) => (
                                <tr key={trx.id} style={{
                                    borderBottom: index !== transactions.length - 1 ? '2px solid #ddd' : 'none',
                                    background: index % 2 === 0 ? 'white' : '#FAFAFA'
                                }}>
                                    <td style={{ padding: '1rem', borderRight: '2px solid black', fontWeight: 'bold' }}>{trx.date}</td>
                                    <td style={{ padding: '1rem', borderRight: '2px solid black', fontFamily: 'monospace' }}>{trx.id}</td>
                                    <td style={{ padding: '1rem', borderRight: '2px solid black' }}>{trx.description}</td>
                                    <td style={{
                                        padding: '1rem',
                                        textAlign: 'right',
                                        fontWeight: '900',
                                        color: trx.type === 'credit' ? '#93C572' : '#FF6B6B',
                                        textShadow: '1px 1px 0px black'
                                    }}>
                                        {trx.type === 'credit' ? '+' : ''}{trx.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
