'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAppointment(formData: FormData) {
    const supabase = await createClient()

    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const vetId = formData.get('vetId') as string
    const petId = formData.get('petId') as string // Form input name can remain petId, but DB col is pet_id
    const type = formData.get('type') as string

    const bookingReason = formData.get('bookingReason') as string

    // Combine date and time
    const appointmentDate = new Date(`${date}T${time}`)

    // Fetch the pet to get the ownerId
    const { data: pet, error: petError } = await supabase
        .from('Pet')
        .select('ownerId')
        .eq('id', petId)
        .single()

    if (petError || !pet) {
        throw new Error('Pet not found')
    }

    // Check for collision (30 min buffer)
    const bufferStart = moment(appointmentDate).subtract(29, 'minutes').toDate().toISOString()
    const bufferEnd = moment(appointmentDate).add(29, 'minutes').toDate().toISOString()

    const { data: conflicts } = await supabase
        .from('Appointment')
        .select('id')
        .eq('vetId', vetId)
        .gte('date', bufferStart)
        .lte('date', bufferEnd)

    if (conflicts && conflicts.length > 0) {
        // Return a cleaner error or throw logic that the UI can catch
        // Since the UI currently uses standard form submission, throwing works but might produce generic 500.
        // I will throw a specific string and hope we can catch it or user sees it.
        // Actually, returning an object is better but rewriting the signature might break client.
        // For now, I will throw which the Next.js ErrorBoundary might catch or user sees in console if specific implementation.
        // BUT wait, I saw AppointmentForm uses `action={async (formData) => { await createAppointment(formData) ... }}`
        // If I throw here, the client promise will reject.
        console.error('Time slot collision')
        // We can't easily return {error: ...} without changing signature to not be just formData input?
        // Actually server actions can return values.
        // I will keep throwing for now as it stops the insert.
        throw new Error('Time slot unavailable. Please select a time at least 30 minutes apart from existing appointments.')
    }

    const { error } = await supabase.from('Appointment').insert({
        date: appointmentDate.toISOString(),
        vetId, // Matches my added schema col
        pet_id: parseInt(petId), // Schema change
        type,
        bookingReason,
        userId: pet.ownerId,
    })

    if (error) {
        console.error('Error creating appointment:', error)
        throw new Error('Failed to create appointment')
    }

    revalidatePath('/admin/appointments')
}

import { sendEmail } from '@/lib/mail'
import moment from 'moment'

export async function pushSchedule(appointmentId: number) {
    const supabase = await createClient()

    // 1. Fetch target appointment to get time and vet
    const { data: targetAppt, error: fetchError } = await supabase
        .from('Appointment')
        .select('*')
        .eq('id', appointmentId)
        .single()

    if (fetchError || !targetAppt) {
        throw new Error('Appointment not found')
    }

    const vetId = targetAppt.vetId
    const targetDate = new Date(targetAppt.date) // This is the start of the chain reaction
    const endOfDay = new Date(targetDate)
    endOfDay.setHours(23, 59, 59, 999)

    // 2. Fetch ALL appointments for this vet on this day that are AT or AFTER the target time
    const { data: affectedAppointments, error: listError } = await supabase
        .from('Appointment')
        .select(`
            *,
            user:userId(email, name)
        `)
        .eq('vetId', vetId)
        .gte('date', targetDate.toISOString())
        .lte('date', endOfDay.toISOString())
        .order('date', { ascending: true })

    if (listError || !affectedAppointments?.length) {
        return { success: true, count: 0 } // No appointments to move
    }

    // 3. Update each appointment + send email
    const updates = affectedAppointments.map(async (appt) => {
        const newDate = moment(appt.date).add(15, 'minutes').toDate()

        // Update DB
        const { error: updateError } = await supabase
            .from('Appointment')
            .update({
                // date: newDate.toISOString(), // REMOVED: Keep original date
                updatedDate: newDate.toISOString() // Set updatedDate to the new appointment time
            })
            .eq('id', appt.id)

        if (updateError) {
            console.error(`Failed to update appointment ${appt.id}`, updateError)
        } else {
            // Send Email Notification
            if (appt.user?.email) {
                await sendEmail({
                    to: appt.user.email,
                    subject: '⚠️ Appointment Update: 15min Delay',
                    html: `
                        <div style="font-family: sans-serif; padding: 20px;">
                            <h2 style="color: #e74c3c;">Appointment Delayed</h2>
                            <p>Dear ${appt.user.name || 'Pet Parent'},</p>
                            <p>Due to an emergency case at the clinic, your appointment time has been pushed back by 15 minutes.</p>
                            <p><strong>New Time:</strong> ${moment(newDate).format('h:mm A')}</p>
                            <p>We apologize for the inconvenience and appreciate your understanding.</p>
                            <br/>
                            <p>- PAWS Veterinary Team</p>
                        </div>
                    `
                })
            }
        }
    })

    await Promise.all(updates)

    revalidatePath('/admin/appointments')
    return { success: true, count: affectedAppointments.length }
}

export async function updateAppointment(id: number, date: string, time: string) {
    const supabase = await createClient()

    const appointmentDate = new Date(`${date}T${time}`)

    // Validation: Future only
    if (moment(appointmentDate).isBefore(moment())) {
        throw new Error('Appointment cannot be moved to the past.')
    }

    // Check for collision (30 min buffer), excluding self
    // We need to fetch the current appointment to get vetId
    const { data: currentAppt, error: fetchError } = await supabase
        .from('Appointment')
        .select('vetId')
        .eq('id', id)
        .single()

    if (fetchError || !currentAppt) throw new Error('Appointment not found')

    const bufferStart = moment(appointmentDate).subtract(29, 'minutes').toDate().toISOString()
    const bufferEnd = moment(appointmentDate).add(29, 'minutes').toDate().toISOString()

    const { data: conflicts } = await supabase
        .from('Appointment')
        .select('id')
        .eq('vetId', currentAppt.vetId)
        .neq('id', id) // Exclude self
        .gte('date', bufferStart)
        .lte('date', bufferEnd)

    if (conflicts && conflicts.length > 0) {
        throw new Error('Time slot unavailable (collision).')
    }

    const { error } = await supabase
        .from('Appointment')
        .update({
            date: appointmentDate.toISOString(),
            updatedDate: appointmentDate.toISOString()
        })
        .eq('id', id)

    if (error) {
        console.error('Update error:', error)
        throw new Error('Failed to update appointment')
    }

    revalidatePath('/admin/appointments')
}

export async function deleteAppointment(id: number) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('Appointment')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Delete error:', error)
        throw new Error('Failed to delete appointment')
    }

    revalidatePath('/admin/appointments')
}
