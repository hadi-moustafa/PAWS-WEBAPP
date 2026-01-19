import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import VetNav from './components/VetNav'

export default async function VetLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch public user details for correct name
    const { data: dbUser } = await supabase
        .from('User')
        .select('name, role')
        .eq('id', user.id)
        .single()

    // Double check role
    const role = dbUser?.role || user.user_metadata.role
    if (role !== 'Vet' && role !== 'Super_Admin') {
        redirect('/unauthorized')
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f5f6fa', paddingBottom: '4rem' }}>
            {/* Top Bar */}
            <header style={{ background: '#74b9ff', padding: '1rem', borderBottom: '3px solid black' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', textShadow: '2px 2px 0px black', margin: 0 }}>PAWS</h2>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            background: 'white',
                            borderRadius: '50%',
                            border: '2px solid black',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: 'bob 2s infinite ease-in-out'
                        }}>
                            <img src="/images/cat-doctor.png" alt="Vet" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                        </div>
                        <style>{`
                            @keyframes bob {
                                0%, 100% { transform: translateY(0); }
                                50% { transform: translateY(-5px); }
                            }
                        `}</style>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <form action="/auth/signout" method="post">
                            <button className="neopop-button" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Sign Out</button>
                        </form>
                    </div>
                </div>
            </header>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
                {children}
            </div>

            <VetNav />
        </div>
    )
}
