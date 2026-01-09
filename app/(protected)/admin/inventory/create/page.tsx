import { createProduct } from '../actions'
import styles from '@/app/login/login.module.css'
import Link from 'next/link'

export default function CreateProductPage() {
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1rem' }}>
                <Link href="/admin/inventory" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                    ← Back to Inventory
                </Link>
            </div>

            <div className={`neopop-card ${styles.formContainer}`} style={{ padding: '2rem', background: 'white' }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>📦 New Product</h1>

                <form action={createProduct} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Product Name</label>
                        <input name="name" type="text" required className={styles.input} placeholder="e.g. Premium Dog Food" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Description</label>
                        <textarea name="description" required className={styles.input} placeholder="Details about the product..." rows={3} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Category</label>
                        <select name="category" required className={styles.input} style={{ background: 'white' }}>
                            <option value="Food">Food</option>
                            <option value="Toys">Toys</option>
                            <option value="Medical">Medical Supplies</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Price ($)</label>
                        <input name="price" type="number" step="0.01" required className={styles.input} placeholder="0.00" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Initial Stock</label>
                        <input name="stock" type="number" required className={styles.input} placeholder="0" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Product Image</label>
                        <input name="image" type="file" accept="image/*" className={styles.input} style={{ padding: '0.5rem' }} />
                        <small style={{ color: '#666' }}>Upload a picture from your device.</small>
                    </div>

                    <button type="submit" className="neopop-button" style={{ marginTop: '1rem', width: '100%' }}>
                        Add to Inventory
                    </button>
                </form>
            </div>
        </div>
    )
}
