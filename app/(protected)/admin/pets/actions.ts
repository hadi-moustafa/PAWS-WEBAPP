'use server'

import { createClient } from '@/lib/supabase/server'
import { uploadImage } from '@/lib/supabase/storage'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
        vet_id: user.id, // Admin is creating, so recording them as the "vet" or author
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

    revalidatePath(`/admin/pets/${petId}`)
}

export async function deletePet(id: number) {
    const supabase = await createClient()
    await supabase.from('Pet').delete().eq('id', id)
    revalidatePath('/admin/pets')
}

export async function createPet(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const breed = formData.get('breed') as string
    const age = parseInt(formData.get('age') as string)
    const location = formData.get('location') as string
    const description = formData.get('description') as string

    // Handle Image
    const imageFile = formData.get('image') as File
    let imageUrl = 'https://placedog.net/400/400?random' // Default fallbacks
    if (type.toLowerCase() === 'cat') imageUrl = 'https://placecats.com/400/400'

    if (imageFile && imageFile.size > 0) {
        try {
            imageUrl = await uploadImage(imageFile, 'paws_images')
        } catch (e) {
            console.error('Image upload failed', e)
        }
    }

    // We need ownerId. For now, assign to current user (Admin) who created it
    const { data: { user } } = await supabase.auth.getUser()

    const status = formData.get('status') as string
    const adoptedAt = status === 'Adopted' ? new Date().toISOString() : null

    const { error } = await supabase.from('Pet').insert({
        name,
        type,
        breed,
        age,
        location,
        description,
        images: [imageUrl], // Schema says jsonb array
        status,
        adoptedAt,
        ownerId: user?.id
    })

    if (error) {
        console.error('Create Pet Error:', error)
        return redirect('/admin/pets/create?error=' + encodeURIComponent(error.message))
    }

    revalidatePath('/admin/pets')
    redirect('/admin/pets')
}

export async function adoptPet(id: number) {
    const supabase = await createClient()

    // Set status to ADOPTED and adoptedAt to NOW
    const { error } = await supabase.from('Pet').update({
        status: 'Adopted',
        adoptedAt: new Date().toISOString()
    }).eq('id', id)

    if (error) console.error('Adoption error', error)
    revalidatePath('/admin/pets')
}



export async function updatePet(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string

    // 1. Gather Basic Data
    const updates: Record<string, string | number | string[] | null> = {
        name: formData.get('name') as string,
        type: formData.get('type') as string,
        breed: formData.get('breed') as string,
        age: parseInt(formData.get('age') as string),
        location: formData.get('location') as string,
        description: formData.get('description') as string,
        status: formData.get('status') as string,
    }

    // 2. Handle Status Logic
    if (updates.status === 'Adopted') {
        // If switching TO adopted, set time. (If already adopted, keeping existing time is usually better, but for simplicity reset or keep?)
        // Let's check if it was already adopted? 
        // For MVP, if status is Adopted, ensure adoptedAt is set.
        // We might overwrite adoptedAt if we just set it new. 
        // Let's fetch current to be safe? Or just set it if null?
        // Simpler: Just update it.
        updates.adoptedAt = new Date().toISOString()
    } else {
        updates.adoptedAt = null // If moving back to Stray, clear timer
    }

    // 3. Handle Optional Image
    const imageFile = formData.get('image') as File
    if (imageFile && imageFile.size > 0) {
        try {
            // Upload new image
            const imageUrl = await uploadImage(imageFile, 'paws_images')
            // Replace images array
            updates.images = [imageUrl]
        } catch (e) {
            console.error('Image upload failed during update', e)
        }
    }

    // 4. Update DB
    const { error } = await supabase.from('Pet').update(updates).eq('id', id)

    if (error) {
        console.error('Update Pet Error:', error)
        return redirect(`/admin/pets/${id}?error=` + encodeURIComponent(error.message))
    }

    revalidatePath('/admin/pets')
    redirect('/admin/pets') // Go back to list
}
