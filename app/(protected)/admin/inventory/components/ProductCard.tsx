'use client'

import { useState } from 'react'
import { updateStock, deleteProduct } from '../actions'
import styles from './card.module.css'

type Product = {
    id: number
    name: string
    category: string
    price: number
    stock: number
    imageUrl: string
}

export default function ProductCard({ item }: { item: Product }) {
    const [showModal, setShowModal] = useState(false)

    const handleDecrease = (e: React.FormEvent) => {
        e.preventDefault()
        if (item.stock <= 1) {
            setShowModal(true)
        } else {
            const formData = new FormData()
            formData.append('id', item.id.toString())
            formData.append('amount', '-1')
            updateStock(formData)
        }
    }

    const handleKeepEmpty = async () => {
        const formData = new FormData()
        formData.append('id', item.id.toString())
        formData.append('amount', '-1') // Will result in 0
        await updateStock(formData)
        setShowModal(false)
    }

    const handleDelete = async () => {
        const formData = new FormData()
        formData.append('id', item.id.toString())
        await deleteProduct(formData)
        setShowModal(false)
    }

    return (
        <>
            <div className="neopop-card" style={{ padding: '1rem', background: 'white', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ height: '150px', background: '#eee', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0 }}>{item.name}</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>{item.category}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>${item.price}</span>
                        <span style={{
                            background: item.stock < 5 ? '#ff6b6b' : '#93C572',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            color: item.stock < 5 ? 'white' : 'black'
                        }}>
                            Stock: {item.stock}
                        </span>
                    </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', borderTop: '2px solid #eee', paddingTop: '1rem' }}>
                    {/* Decrease Button */}
                    <button
                        onClick={handleDecrease}
                        className="neopop-button"
                        style={{ flex: 1, padding: '0.3rem', fontSize: '0.8rem', background: '#ffeaa7' }}
                    >
                        -1
                    </button>

                    {/* Increase Button - Direct Form Action works fine here */}
                    <form action={updateStock} style={{ flex: 1 }}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="amount" value="1" />
                        <button className="neopop-button" style={{ padding: '0.3rem', width: '100%', fontSize: '0.8rem', background: '#fab1a0' }}>+1</button>
                    </form>

                    {/* Delete Button */}
                    <form action={deleteProduct} style={{ flex: 0 }}>
                        <input type="hidden" name="id" value={item.id} />
                        <button className="neopop-button" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: '#ff7675' }}>🗑️</button>
                    </form>
                </div>
            </div>

            {/* Custom Modal */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={`neopop-card ${styles.modalContent}`}>
                        <h2 style={{ fontSize: '1.5rem', color: '#d63031' }}>⚠️ Stock Alert</h2>
                        <p>
                            This item has reached <strong>0 stock</strong>. What would you like to do?
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button onClick={handleDelete} className="neopop-button" style={{ background: '#ff7675', flex: 1 }}>
                                🗑️ Delete Item
                            </button>
                            <button onClick={handleKeepEmpty} className="neopop-button" style={{ background: '#fff', color: 'black', flex: 1 }}>
                                Keep as Empty
                            </button>
                        </div>
                        <button onClick={() => setShowModal(false)} style={{ marginTop: '1rem', border: 'none', background: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
