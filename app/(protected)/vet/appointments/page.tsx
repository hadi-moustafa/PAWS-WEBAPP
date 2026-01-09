import { createClient } from '@/lib/supabase/server'
import AppointmentCalendar from '@/app/(protected)/admin/appointments/components/AppointmentCalendar'
import { redirect } from 'next/navigation'

export default async function VetAppointmentsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch appointments for this vet
    const { data: appointments, error } = await supabase
        .from('Appointment')
        .select(`
            *,
            vet:vetId (name),
            pet:pet_id (name)
        `)
        .eq('vetId', user.id)
        .order('date', { ascending: true })

    if (error) {
        console.error('Error fetching vet appointments:', error)
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="neopop-card" style={{ background: 'white', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>📅 My Schedule</h1>
                <p style={{ color: '#666' }}>View your upcoming appointments. Contact admin to reschedule.</p>
            </div>

            <AppointmentCalendar appointments={appointments || []} />
        </div>
    )
}
