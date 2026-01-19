'use client'

import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Since I don't know if Button exists, I will use a standard button with neopop class if available or just inline style for now to match NeoPop style I saw in other files.

const localizer = momentLocalizer(moment)


import { useState, useTransition } from 'react'
import { pushSchedule, updateAppointment, deleteAppointment } from '../actions'

type Appointment = {
    id: number
    date: string
    updatedDate?: string
    type: string
    bookingReason?: string
    vet?: { name: string }
    pet?: { name: string; breed?: string }
}

export default function AppointmentCalendar({ appointments }: { appointments: Appointment[] }) {
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [isPending, startTransition] = useTransition()
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({ date: '', time: '' })

    const events = appointments.map(apt => {
        const effectiveDate = apt.updatedDate ? new Date(apt.updatedDate) : new Date(apt.date)
        return {
            start: effectiveDate,
            end: moment(effectiveDate).add(1, 'hours').toDate(), // Assuming 1 hour duration
            title: `${apt.type} - ${apt.pet?.name || 'Unknown Pet'} ${apt.updatedDate && apt.updatedDate !== apt.date ? '⚠️' : ''}`,
            resource: apt
        }
    })

    const handleSelectEvent = (event: any) => {
        setSelectedAppointment(event.resource)
        setIsEditing(false) // Reset edit mode
        const effectiveDate = event.resource.updatedDate || event.resource.date
        setEditForm({
            date: moment(effectiveDate).format('YYYY-MM-DD'),
            time: moment(effectiveDate).format('HH:mm')
        })
    }

    const handlePushSchedule = () => {
        if (!selectedAppointment) return
        if (confirm('⚠️ EMERGENCY: Are you sure you want to push this and ALL following appointments by 15 minutes? This will notify all affected users.')) {
            startTransition(async () => {
                const result = await pushSchedule(selectedAppointment.id)
                if (result.success) {
                    alert(`Schedule pushed! ${result.count} appointments updated.`)
                    setSelectedAppointment(null)
                }
            })
        }
    }

    const handleDelete = () => {
        if (!selectedAppointment) return
        if (confirm('Are you sure you want to cancel this appointment? This action cannot be undone.')) {
            startTransition(async () => {
                try {
                    await deleteAppointment(selectedAppointment.id)
                    setSelectedAppointment(null)
                } catch (e: any) {
                    alert(e.message)
                }
            })
        }
    }

    const handleUpdate = () => {
        if (!selectedAppointment) return
        startTransition(async () => {
            try {
                await updateAppointment(selectedAppointment.id, editForm.date, editForm.time)
                alert('Appointment rescheduled successfully!')
                setSelectedAppointment(null)
            } catch (e: any) {
                alert(e.message)
            }
        })
    }

    return (
        <>
            <div style={{ height: '500px', background: 'white', padding: '1rem', borderRadius: '1rem', border: '2px solid black', boxShadow: '4px 4px 0px black' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    views={['month', 'week', 'day']}
                    defaultView={Views.MONTH}
                    onSelectEvent={handleSelectEvent}
                    popup
                />
            </div>

            {selectedAppointment && (
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
                            onClick={() => setSelectedAppointment(null)}
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

                        <h2 style={{ marginTop: 0, marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>📅 Appointment Details</span>
                            {!isEditing && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        style={{ background: '#f1c40f', border: '1px solid black', padding: '0.3rem 0.6rem', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        style={{ background: '#e74c3c', color: 'white', border: '1px solid black', padding: '0.3rem 0.6rem', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            )}
                        </h2>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', color: '#666', marginBottom: '0.2rem' }}>Pet</label>
                                <div style={{ fontSize: '1.2rem' }}>
                                    {selectedAppointment.pet?.name || 'Unknown'}
                                    {selectedAppointment.pet?.breed && <span style={{ fontSize: '0.9rem', color: '#888', marginLeft: '0.5rem' }}>({selectedAppointment.pet.breed})</span>}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', color: '#666', marginBottom: '0.2rem' }}>Vet</label>
                                <div>Dr. {selectedAppointment.vet?.name || 'Unknown'}</div>
                            </div>

                            {isEditing ? (
                                <div style={{ background: '#fff3cd', padding: '1rem', border: '1px dashed orange', borderRadius: '8px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <div>
                                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>New Date</label>
                                            <input
                                                type="date"
                                                value={editForm.date}
                                                onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                                                className="neopop-input" style={{ width: '100%', padding: '0.5rem' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>New Time</label>
                                            <input
                                                type="time"
                                                value={editForm.time}
                                                onChange={e => setEditForm({ ...editForm, time: e.target.value })}
                                                className="neopop-input" style={{ width: '100%', padding: '0.5rem' }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={handleUpdate}
                                            disabled={isPending}
                                            style={{ flex: 1, background: '#2ecc71', border: '1px solid black', padding: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            {isPending ? 'Saving...' : '💾 Save Changes'}
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            style={{ flex: 1, background: '#ecf0f1', border: '1px solid black', padding: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ fontWeight: 'bold', display: 'block', color: '#666', marginBottom: '0.2rem' }}>Date</label>
                                        <div>{moment(selectedAppointment.updatedDate || selectedAppointment.date).format('MMMM Do YYYY')}</div>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold', display: 'block', color: '#666', marginBottom: '0.2rem' }}>Time</label>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: selectedAppointment.updatedDate && selectedAppointment.updatedDate !== selectedAppointment.date ? '#e74c3c' : 'inherit' }}>
                                            {moment(selectedAppointment.updatedDate || selectedAppointment.date).format('h:mm A')}
                                        </div>
                                        {selectedAppointment.updatedDate && selectedAppointment.updatedDate !== selectedAppointment.date && (
                                            <div style={{ fontSize: '0.9rem', color: '#e74c3c', marginTop: '0.2rem', background: '#fadbd8', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'inline-block' }}>
                                                ⚠️ Postponed (Was {moment(selectedAppointment.date).format('h:mm A')})
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', color: '#666', marginBottom: '0.2rem' }}>Type</label>
                                <span className="neopop-tag" style={{ background: '#dfe6e9', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid black' }}>
                                    {selectedAppointment.type}
                                </span>
                            </div>

                            {selectedAppointment.bookingReason && (
                                <div style={{ background: '#f5f6fa', padding: '1rem', borderRadius: '8px', border: '1px dashed #ccc' }}>
                                    <label style={{ fontWeight: 'bold', display: 'block', color: '#666', marginBottom: '0.2rem' }}>📝 Reason</label>
                                    <p style={{ margin: 0, fontStyle: 'italic' }}>"{selectedAppointment.bookingReason}"</p>
                                </div>
                            )}

                            {!isEditing && (
                                <div style={{ borderTop: '2px dashed #e17055', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                    <button
                                        onClick={handlePushSchedule}
                                        disabled={isPending}
                                        className="neopop-button"
                                        style={{
                                            width: '100%',
                                            background: '#ff7675',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            padding: '0.8rem',
                                            cursor: isPending ? 'wait' : 'pointer'
                                        }}
                                    >
                                        {isPending ? '⏳ Updating Schedule...' : '⚠️ Emergency Push (+15m)'}
                                    </button>
                                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem', textAlign: 'center' }}>
                                        This will delay this appointment and all following ones today by 15 minutes.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
