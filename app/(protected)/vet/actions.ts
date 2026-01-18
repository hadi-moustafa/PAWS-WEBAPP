'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEmergencyAppointment() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // 1. Create a "Stray/Emergency" Pet Placeholder
    // We create a temporary pet entry that the vet can fill in later
    const { data: pet, error: petError } = await supabase.from('Pet').insert({
        name: 'Emergency Patient ' + new Date().toLocaleTimeString(),
        type: 'Other', // Default
        location: 'Clinic',
        description: 'Emergency intake - details pending',
        status: 'Stray',
        ownerId: user.id
    }).select().single()

    if (petError || !pet) {
        console.error('Failed to create emergency pet', petError)
        throw new Error('Failed to initiate emergency protocol')
    }

    // 2. Create Emergency Appointment (Immediate)
    const { error: apptError } = await supabase.from('Appointment').insert({
        date: new Date().toISOString(),
        type: 'Emergency',
        bookingReason: 'Emergency Intake',
        userId: user.id, // Vet is the "user" context here? Or should it be the pet owner? 
        // For stray emergency, we might leave owner null or set to organization. 
        // Schema requires userId. We'll use the vet (admin) as the "requester" for now or a system user.
        // Using current user (Vet) is acceptable for "Reporter".
        pet_id: pet.id,
        is_emergency: true,
        vetId: user.id
    })

    if (apptError) {
        console.error('Failed to create emergency appointment', apptError)
        // Cleanup pet?
        throw new Error('Failed to create appointment')
    }

    revalidatePath('/vet')
    redirect(`/vet/records/${pet.id}`)
}
