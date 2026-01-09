'use client'

import { useState } from 'react'
import { createAppointment } from '../actions'

type Props = {
    vets: { id: string; name?: string; email?: string }[]
    pets: { id: number; name: string; breed?: string }[]
}

export default function AppointmentForm({ vets, pets }: Props) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="neopop-button"
                style={{ background: '#74b9ff', color: 'black', fontWeight: 'bold', padding: '0.8rem 1.5rem', cursor: 'pointer' }}
            >
                + New Appointment
            </button>

            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        background: '#fff',
                        padding: '2rem',
                        borderRadius: '1rem',
                        border: '3px solid black',
                        boxShadow: '8px 8px 0px black',
                        width: '100%',
                        maxWidth: '500px',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            ✕
                        </button>

                        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.8rem', textAlign: 'center' }}>📅 Book Appointment</h2>

                        <form action={async (formData) => {
                            await createAppointment(formData)
                            setIsOpen(false)
                        }} style={{ display: 'grid', gap: '1.2rem' }}>

                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>👨‍⚕️ Vet</label>
                                <select name="vetId" className="neopop-input" style={{ width: '100%', padding: '0.8rem' }} required>
                                    <option value="">Select a Vet</option>
                                    {vets.map(vet => (
                                        <option key={vet.id} value={vet.id}>{vet.name || vet.email}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>🐶 Pet</label>
                                <select name="petId" className="neopop-input" style={{ width: '100%', padding: '0.8rem' }} required>
                                    <option value="">Select a Pet</option>
                                    {pets.map(pet => (
                                        <option key={pet.id} value={pet.id}>{pet.name} ({pet.breed})</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Date</label>
                                    <input type="date" name="date" className="neopop-input" style={{ width: '100%', padding: '0.8rem' }} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Time</label>
                                    <input type="time" name="time" className="neopop-input" style={{ width: '100%', padding: '0.8rem' }} required />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Type</label>
                                <select name="type" className="neopop-input" style={{ width: '100%', padding: '0.8rem' }} required>
                                    <option value="General Checkup">General Checkup</option>
                                    <option value="Vaccination">Vaccination</option>
                                    <option value="Surgery">Surgery</option>
                                    <option value="Dental">Dental</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="neopop-button" style={{ background: '#93C572', flex: 1, padding: '1rem' }}>Confirm Booking</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
