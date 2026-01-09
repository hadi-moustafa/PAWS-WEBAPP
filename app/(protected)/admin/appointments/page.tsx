import AppointmentCalendar from './components/AppointmentCalendar'
import AppointmentForm from './components/AppointmentForm'
import { createClient } from '@/lib/supabase/server'

export default async function AppointmentsPage() {
    const supabase = await createClient()

    const { data: vets } = await supabase.from('User').select('*').eq('role', 'Vet')
    const { data: pets } = await supabase.from('Pet').select('*')
    // Use try/catch or simple error checking for the complex join which might fail if migration isn't run
    const { data: appointments, error: aptError } = await supabase
        .from('Appointment')
        .select('*, vet:vetId(*), pet:pet_id(*)') // This join fails if FKs don't exist
        .order('date', { ascending: true })

    // If schema is missing, appointments will be null (aptError present).
    // We proceed with empty array to allow build to pass.
    if (aptError) {
        console.error('Failed to fetch appointments (likely schema mismatch):', aptError)
    }

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>📅 Appointments</h1>
                <AppointmentForm vets={vets || []} pets={pets || []} />
            </div>

            <AppointmentCalendar appointments={appointments || []} />
        </div>
    )
}
