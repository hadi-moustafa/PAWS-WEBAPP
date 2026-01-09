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

    const { error } = await supabase.from('Appointment').insert({
        date: appointmentDate.toISOString(),
        vetId, // Matches my added schema col
        pet_id: parseInt(petId), // Schema change
        type,
        status: 'CONFIRMED',
        userId: pet.ownerId,
    })

    if (error) {
        console.error('Error creating appointment:', error)
        throw new Error('Failed to create appointment')
    }

    revalidatePath('/admin/appointments')
}
