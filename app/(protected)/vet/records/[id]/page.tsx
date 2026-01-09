import { createClient } from '@/lib/supabase/server'
import { updateMedicalRecord, createMedicalRecord } from '../actions'
import Link from 'next/link'

export default async function VetRecordsPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id: petId } = await params

    // Fetch Pet Details
    const { data: pet } = await supabase.from('Pet').select('*').eq('id', petId).single()

    if (!pet) return <div>Patient not found</div>

    // Fetch Medical Records
    const { data: records } = await supabase
        .from('MedicalRecord')
        .select(`
            *,
            vet:vet_id(name)
        `)
        .eq('pet_id', petId)
        .order('created_at', { ascending: false })

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/vet/patients" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                    ← Back to Patients
                </Link>
                <h1 style={{ margin: 0 }}>📂 {pet.name}&apos;s Medical History</h1>
            </div>

            <div className="neopop-card" style={{ background: '#fff' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem', padding: '1rem', background: '#f5f6fa', borderRadius: '8px' }}>
                    <div>
                        <strong>Breed:</strong> {pet.breed}
                    </div>
                    <div>
                        <strong>Age:</strong> {pet.age} yrs
                    </div>
                    <div>
                        <strong>Type:</strong> {pet.type}
                    </div>
                </div>

                {/* Add New Record Form */}
                <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '2px solid #74b9ff' }}>
                    <h3 style={{ marginTop: 0 }}>➕ New Examination</h3>
                    <form action={createMedicalRecord} style={{ display: 'grid', gap: '1rem' }}>
                        <input type="hidden" name="pet_id" value={petId} />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>Visit Type</label>
                                <select name="visit_type" className="neopop-input" style={{ width: '100%' }} required>
                                    <option value="Checkup">Checkup</option>
                                    <option value="Emergency">Emergency</option>
                                    <option value="Surgery">Surgery</option>
                                    <option value="Vaccination">Vaccination</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>Weight (kg)</label>
                                <input name="weight" type="number" step="0.1" className="neopop-input" style={{ width: '100%' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold' }}>Summary</label>
                            <input name="summary" type="text" className="neopop-input" style={{ width: '100%' }} placeholder="Brief overview..." required />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>Diagnosis</label>
                                <textarea name="diagnosis" className="neopop-input" style={{ width: '100%' }} rows={3} placeholder="Optional detail"></textarea>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>Treatment</label>
                                <textarea name="treatment" className="neopop-input" style={{ width: '100%' }} rows={3} placeholder="Optional detail"></textarea>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>Temp (°C)</label>
                                <input name="temperature" type="number" step="0.1" className="neopop-input" style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>Heart Rate (bpm)</label>
                                <input name="heart_rate" type="number" className="neopop-input" style={{ width: '100%' }} />
                            </div>
                        </div>

                        <button type="submit" className="neopop-button" style={{ background: '#74b9ff', color: 'white' }}>Save Record</button>
                    </form>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {records?.map((record) => (
                        <div key={record.id} style={{ border: '2px solid black', borderRadius: '8px', padding: '1.5rem', background: '#fff', boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                                <div>
                                    <span className="neopop-tag" style={{ background: '#a29bfe', color: 'white' }}>{record.visit_type}</span>
                                    <span style={{ marginLeft: '1rem', fontWeight: 'bold' }}>{new Date(record.created_at).toLocaleDateString()}</span>
                                </div>
                                <div style={{ color: '#666' }}>
                                    Dr. {record.vet?.name || 'Unknown'}
                                </div>
                            </div>

                            <form action={updateMedicalRecord} style={{ display: 'grid', gap: '1rem' }}>
                                <input type="hidden" name="id" value={record.id} />
                                <input type="hidden" name="pet_id" value={petId} />

                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem' }}>Summary</label>
                                    <input name="summary" defaultValue={record.summary} className="neopop-input" style={{ width: '100%' }} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem' }}>Diagnosis</label>
                                        <textarea name="diagnosis" defaultValue={record.diagnosis} className="neopop-input" style={{ width: '100%' }} rows={3} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem' }}>Treatment</label>
                                        <textarea name="treatment" defaultValue={record.treatment} className="neopop-input" style={{ width: '100%' }} rows={3} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: '#f9f9f9', padding: '0.5rem', borderRadius: '4px' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem' }}>Weight (kg)</label>
                                        <input name="weight" type="number" step="0.1" defaultValue={record.weight} className="neopop-input" style={{ width: '100%' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem' }}>Temp (°C)</label>
                                        <input name="temperature" type="number" step="0.1" defaultValue={record.temperature} className="neopop-input" style={{ width: '100%' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem' }}>Heart Rate (bpm)</label>
                                        <input name="heart_rate" type="number" defaultValue={record.heart_rate} className="neopop-input" style={{ width: '100%' }} />
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <button type="submit" className="neopop-button" style={{ background: '#ffeaa7', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>💾 Update Record</button>
                                </div>
                            </form>
                        </div>
                    ))}
                    {(!records || records.length === 0) && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                            No medical records found for this patient.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
