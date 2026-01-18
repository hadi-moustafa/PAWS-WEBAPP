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
            <div className={styles.card}>
                <div style={{
                    height: '160px',
                    background: '#f9f9f9',
                    marginBottom: '1rem',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '3px solid black'
                }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl || 'https://via.placeholder.com/300'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', textTransform: 'uppercase' }}>{item.name}</h3>
                        <span style={{ fontWeight: '900', fontSize: '1.1rem', background: '#ffeaa7', padding: '0 5px', border: '2px solid black' }}>${item.price}</span>
                    </div>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.category}</p>

                    <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                        <span style={{
                            display: 'block',
                            background: item.stock < 5 ? '#ff7675' : '#55efc4',
                            padding: '0.3rem',
                            border: '3px solid black',
                            borderRadius: '50px',
                            fontWeight: '900',
                            fontSize: '0.8rem',
                            color: 'black',
                            textAlign: 'center',
                            boxShadow: '2px 2px 0px black'
                        }}>
                            {item.stock === 0 ? 'OUT OF STOCK' : item.stock < 5 ? `LOW STOCK: ${item.stock}` : `IN STOCK: ${item.stock}`}
                        </span>
                    </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', borderTop: '3px dashed black', paddingTop: '1rem' }}>
                    {/* Decrease Button */}
                    <button
                        onClick={handleDecrease}
                        className="neopop-button"
                        style={{ flex: 1, padding: '0.3rem', fontSize: '1rem', background: '#fff' }}
                        title="Sell / Decrease"
                    >
                        ➖
                    </button>

                    {/* Increase Button - Direct Form Action works fine here */}
                    <form action={updateStock} style={{ flex: 1 }}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="amount" value="1" />
                        <button className="neopop-button" style={{ padding: '0.3rem', width: '100%', fontSize: '1rem', background: '#fff' }} title="Restock / Increase">➕</button>
                    </form>

                    {/* Delete Button */}
                    <form action={deleteProduct} style={{ flex: 0 }}>
                        <input type="hidden" name="id" value={item.id} />
                        <button className="neopop-button" style={{ padding: '0.3rem 0.6rem', fontSize: '1rem', background: '#ff7675' }} title="Remove Item">🗑️</button>
                    </form>
                </div>
            </div>

            {/* Custom Modal */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', fontWeight: '900', textTransform: 'uppercase' }}>⚠️ Stock Empty</h2>
                        <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                            You just sold the last <strong>{item.name}</strong>!
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={handleDelete} className="neopop-button" style={{ background: '#ff7675', flex: 1, border: '3px solid black' }}>
                                Remove Item
                            </button>
                            <button onClick={handleKeepEmpty} className="neopop-button" style={{ background: '#fff', color: 'black', flex: 1, border: '3px solid black' }}>
                                Keep (0 Stock)
                            </button>
                        </div>
                        <button onClick={() => setShowModal(false)} style={{ marginTop: '1rem', border: 'none', background: 'none', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
