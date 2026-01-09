import ProductCard from './components/ProductCard'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function InventoryPage() {
    const supabase = await createClient()
    const { data: products, error } = await supabase.from('Product').select('*').order('name')

    if (error) return <div>Error loading inventory: {error.message}</div>

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="neopop-card" style={{ padding: '0.5rem 1rem', display: 'inline-block', fontSize: '1.5rem', margin: 0 }}>
                    📦 Inventory
                </h1>
                <Link href="/admin/inventory/create" className="neopop-button">
                    + Add Product
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {products?.map((item) => (
                    <ProductCard key={item.id} item={item} />
                ))}
            </div>

            {products?.length === 0 && (
                <div className="neopop-card" style={{ padding: '2rem', textAlign: 'center', background: 'white' }}>
                    <p>No products found. Start by adding one!</p>
                </div>
            )}
        </div>
    )
}


