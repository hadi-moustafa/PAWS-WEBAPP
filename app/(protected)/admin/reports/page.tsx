import { createClient } from '@/lib/supabase/server'
import ReportCard from './components/ReportCard'
import { getPendingPets, getReports } from './actions'
import ReportsFeed from './components/ReportsFeed'
import PetApprovalCard from './components/PetApprovalCard'
import AdoptionManager from './components/AdoptionManager'

export default async function ReportsPage() {
    // 1. Fetch Reports
    const reports = await getReports()

    // 2. Fetch Pending Pets
    const pendingPets = await getPendingPets();

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 className="neopop-card" style={{
                    padding: '1rem 2rem',
                    display: 'inline-block',
                    fontSize: '2rem',
                    margin: 0,
                    background: '#0984e3', // Blue
                    color: 'white',
                    border: '3px solid black',
                    boxShadow: '6px 6px 0px black',
                    transform: 'rotate(2deg)'
                }}>
                    📋 CASE FILES
                </h1>
            </div>

            {/* Adoption Manager Section */}
            <AdoptionManager />

            {/* Pet Approvals Section */}
            {pendingPets.length > 0 && (
                <div style={{ marginBottom: '4rem' }}>
                    <div className="neopop-card" style={{
                        background: '#FFFBE6',
                        border: '3px solid black',
                        boxShadow: '4px 4px 0px black',
                        marginBottom: '2rem',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <span style={{ fontSize: '2rem' }}>🐶</span>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', textTransform: 'uppercase' }}>New Pet Listings</h2>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>Review user submissions below</p>
                        </div>
                        <div style={{ marginLeft: 'auto', background: '#FF6B6B', color: 'white', fontWeight: 'bold', padding: '0.2rem 0.8rem', borderRadius: '20px', border: '2px solid black' }}>
                            {pendingPets.length} PENDING
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
                        {pendingPets.map((pet) => (
                            <PetApprovalCard key={pet.id} pet={pet} />
                        ))}
                    </div>
                </div>
            )}

            {/* Reports Section */}
            <ReportsFeed initialReports={reports || []} />

            {reports?.length === 0 && pendingPets.length === 0 && (
                <div className="neopop-card" style={{ padding: '2rem', textAlign: 'center', background: 'white', border: '3px dashed black' }}>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>No active reports or pending approvals! Good job. 🎉</p>
                </div>
            )}
        </div>
    )
}
