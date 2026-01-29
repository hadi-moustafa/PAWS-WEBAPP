import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import UserFilter from './components/UserFilter'
import { deleteUser } from './actions'
import DeleteUserButton from './components/DeleteUserButton'

// Define the shape of searchParams (Next.js 13/14 convention)
// Define the shape of searchParams (Next.js 15+ convention: it's a Promise)
type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function StaffListPage(props: Props) {
    const searchParams = await props.searchParams
    const supabase = await createClient()

    const searchTerm = typeof searchParams.search === 'string' ? searchParams.search : ''
    const roleFilter = typeof searchParams.role === 'string' ? searchParams.role : 'all'

    // Build the query
    // Build the query
    let query = supabase.from('User').select('*')

    // Define staff roles (Excluding Super_Admin as per request)
    const STAFF_ROLES = ['Admin', 'Vet']

    if (roleFilter === 'all') {
        // Show all staff roles
        query = query.in('role', STAFF_ROLES)
    } else {
        // Show specific role
        query = query.eq('role', roleFilter)
    }

    if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
    }

    const { data: users, error } = await query.order('role', { ascending: true })

    if (error) {
        return <div className="neopop-card" style={{ color: 'red', padding: '1rem', border: '3px solid black' }}>Error loading staff: {error.message}</div>
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="neopop-card" style={{
                    padding: '0.8rem 1.5rem',
                    display: 'inline-block',
                    fontSize: '1.8rem',
                    margin: 0,
                    background: '#FF9F1C',
                    color: 'white',
                    border: '3px solid black',
                    boxShadow: '4px 4px 0px black',
                    transform: 'rotate(-2deg)'
                }}>
                    👥 STAFF DIRECTORY
                </h1>
                <Link href="/superadmin/users/create" className="neopop-button" style={{
                    background: '#93C572', // Pistachio
                    color: 'black',
                    padding: '0.8rem 1.5rem',
                    border: '3px solid black',
                    borderRadius: '50px',
                    fontWeight: '900',
                    textDecoration: 'none',
                    boxShadow: '4px 4px 0px black',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>+</span> NEW STAFF
                </Link>
            </div>

            <UserFilter />

            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {users?.map((user) => (
                    <div key={user.id} className="neopop-card" style={{
                        padding: '1.5rem',
                        background: 'white',
                        border: '3px solid black',
                        boxShadow: '6px 6px 0px black',
                        borderRadius: '12px',
                        position: 'relative',
                        transition: 'transform 0.1s'
                    }}>
                        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                            <span style={{
                                background: getRoleColor(user.role),
                                padding: '0.3rem 0.8rem',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: '900',
                                border: '2px solid black',
                                textTransform: 'uppercase',
                                color: 'black'
                            }}>
                                {user.role}
                            </span>
                        </div>

                        <div style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: '#eee',
                                borderRadius: '50%',
                                border: '3px solid black',
                                marginBottom: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem'
                            }}>
                                {user.role === 'Vet' ? '🩺' : user.role === 'Super_Admin' ? '👑' : '👤'}
                            </div>
                            <span style={{ fontWeight: '900', fontSize: '1.4rem', display: 'block' }}>{user.name || 'Unnamed'}</span>
                        </div>

                        <div style={{ color: 'black', fontSize: '0.9rem', marginBottom: '0.3rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            📧 {user.email}
                        </div>
                        <div style={{ color: '#555', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            📞 {user.phone || 'No phone'}
                        </div>

                        {/* Actions Logic: Add Edit/Delete actions here */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                            <Link href={`/superadmin/users/${user.id}`} style={{ flex: 1 }}>
                                <button className="neopop-button" style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    fontSize: '0.9rem',
                                    background: '#FFD700', // Yellow
                                    color: 'black',
                                    border: '2px solid black',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}>
                                    ✏️ EDIT
                                </button>
                            </Link>

                            <DeleteUserButton userId={user.id} />
                        </div>
                    </div>
                ))}

                {users?.length === 0 && (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '3rem',
                        border: '3px dashed black',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.5)'
                    }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#666' }}>No staff members found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function getRoleColor(role: string) {
    switch (role) {
        case 'Super_Admin': return '#FF9F1C'; // Orange
        case 'Admin': return '#93C572'; // Pistachio
        case 'Vet': return '#4DD0E1'; // Cyan
        default: return '#eee';
    }
}
