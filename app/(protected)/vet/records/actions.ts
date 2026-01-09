'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createMedicalRecord(formData: FormData) {
    const supabase = await createClient()

    const petId = formData.get('pet_id') as string
    const summary = formData.get('summary') as string
    const diagnosis = formData.get('diagnosis') as string
    const treatment = formData.get('treatment') as string
    const visit_type = formData.get('visit_type') as string
    const weight = formData.get('weight')
    const temperature = formData.get('temperature')
    const heart_rate = formData.get('heart_rate')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('MedicalRecord').insert({
        pet_id: parseInt(petId),
        vet_id: user.id,
        summary,
        diagnosis,
        treatment,
        visit_type,
        created_at: new Date().toISOString(),
        weight: weight ? parseFloat(weight as string) : null,
        temperature: temperature ? parseFloat(temperature as string) : null,
        heart_rate: heart_rate ? parseInt(heart_rate as string) : null,
    })

    if (error) {
        console.error('Error creating medical record:', error)
        throw new Error('Failed to create medical record')
    }

    revalidatePath(`/vet/records/${petId}`)
}

export async function updateMedicalRecord(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string
    const pet_id = formData.get('pet_id') as string

    const updates = {
        summary: formData.get('summary') as string,
        diagnosis: formData.get('diagnosis') as string,
        treatment: formData.get('treatment') as string,
        visit_type: formData.get('visit_type') as string,
        weight: parseFloat(formData.get('weight') as string) || null,
        temperature: parseFloat(formData.get('temperature') as string) || null,
        heart_rate: parseInt(formData.get('heart_rate') as string) || null,
    }

    const { error } = await supabase.from('MedicalRecord').update(updates).eq('id', id)

    if (error) {
        console.error('Update Medical Record Error:', error)
        throw new Error('Failed to update medical record')
    }

    revalidatePath(`/vet/records/${pet_id}`)
}
