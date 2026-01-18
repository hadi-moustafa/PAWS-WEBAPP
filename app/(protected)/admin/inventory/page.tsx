import ProductCard from './components/ProductCard'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function InventoryPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const supabase = await createClient()
    const { category } = await searchParams

    // 1. Fetch Products with Filter
    let query = supabase.from('Product').select('*').order('name')
    if (category) {
        query = query.eq('category', category)
    }
    const { data: products, error } = await query

    // 2. Fetch Distinct Categories (for the filter UI)
    // currently supabase doesn't support .distinct() easily on client/query builder for simple lists without rpc
    // so we'll just fetch all categories and unique them, or use a known list.
    // simpler to just fetch all product categories for now if list is small.
    const { data: allProducts } = await supabase.from('Product').select('category')
    const uniqueCategories = Array.from(new Set(allProducts?.map(p => p.category).filter(Boolean) || []))

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

            {/* Category Filter */}
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                <Link
                    href="/admin/inventory"
                    className="neopop-button"
                    style={{
                        background: !category ? 'black' : 'white',
                        color: !category ? 'white' : 'black',
                        fontSize: '0.9rem',
                        padding: '0.5rem 1rem'
                    }}
                >
                    ALL
                </Link>
                {uniqueCategories.map((cat) => (
                    <Link
                        key={cat}
                        href={`/admin/inventory?category=${cat}`}
                        className="neopop-button"
                        style={{
                            background: category === cat ? 'black' : 'white',
                            color: category === cat ? 'white' : 'black',
                            fontSize: '0.9rem',
                            padding: '0.5rem 1rem',
                            textTransform: 'uppercase'
                        }}
                    >
                        {cat}
                    </Link>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {products?.map((item) => (
                    <ProductCard key={item.id} item={item} />
                ))}
            </div>

            {products?.length === 0 && (
                <div className="neopop-card" style={{ padding: '2rem', textAlign: 'center', background: 'white' }}>
                    <p>No products found in this category.</p>
                </div>
            )}
        </div>
    )
}


