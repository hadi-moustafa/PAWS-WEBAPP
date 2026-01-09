import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function StaffListPage() {
    const supabase = await createClient()

    // Fetch users. In a real scenario, we might default to filtering for staff roles 
    // or just show everyone. Let's show all for now.
    const { data: users, error } = await supabase
        .from('User')
        .select('*')
        .order('role', { ascending: true }) // Admin/Vet/User/Super_Admin sorting varies but groups them

    if (error) {
        return <div className="neopop-card" style={{ color: 'red', padding: '1rem' }}>Error loading staff: {error.message}</div>
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="neopop-card" style={{ padding: '0.5rem 1rem', display: 'inline-block', fontSize: '1.5rem', margin: 0 }}>
                    👥 Staff Directory
                </h1>
                <Link href="/superadmin/users/create" className="neopop-button">
                    + Add New Staff
                </Link>
            </div>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {users?.map((user) => (
                    <div key={user.id} className="neopop-card" style={{ padding: '1.5rem', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user.name || 'Unnamed'}</span>
                            <span style={{
                                background: getRoleColor(user.role),
                                padding: '0.2rem 0.6rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                border: '2px solid black'
                            }}>
                                {user.role}
                            </span>
                        </div>
                        <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            📧 {user.email}
                        </div>
                        <div style={{ color: '#666', fontSize: '0.8rem' }}>
                            📞 {user.phone || 'No phone'}
                        </div>
                    </div>
                ))}

                {users?.length === 0 && (
                    <p>No staff members found.</p>
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
