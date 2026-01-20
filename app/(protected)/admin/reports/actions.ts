'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// --- REPORTS ---

export async function getReports() {
    const supabase = await createClient()
    const { data: reports, error } = await supabase
        .from('Report')
        .select(`
            *,
            User:userId (
                name,
                email
            )
        `)
        .order('createdAt', { ascending: false })

    if (error) {
        console.error('Error fetching reports:', error)
        return []
    }

    return reports
}

export async function updateReportStatus(reportId: string, status: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('Report')
        .update({ status, updatedAt: new Date().toISOString() })
        .eq('id', reportId)

    if (error) {
        console.error('Error updating report status:', error)
        throw new Error('Failed to update report status')
    }

    revalidatePath('/admin/reports')
}

// --- PET APPROVAL ---

export async function getPendingPets() {
    const supabase = await createClient()
    // Assuming 'Pending' is the status for pets waiting approval
    // The user's schema check constraint says: 'Stray','Pending','Adopted','Rejected'
    const { data: pets, error } = await supabase
        .from('Pet')
        .select('*')
        .eq('status', 'Pending')
        .order('createdAt', { ascending: false })

    if (error) {
        console.error('Error fetching pending pets:', error)
        return []
    }
    return pets
}

export async function updatePetStatus(petId: number, status: 'Stray' | 'Adopted' | 'Rejected', ownerId?: string) {
    const supabase = await createClient()

    const updateData: any = { status }
    if (status === 'Adopted' && ownerId) {
        updateData.ownerId = ownerId
        updateData.adoptedAt = new Date().toISOString()
    } else if (status === 'Stray') {
        // Ensure ownerId is null or shelter account if needed, but for now we might leave it or set to null
        // If the pet was submitted by a user, maybe we keep them as owner? 
        // Or if it's becoming a 'Shelter Stray', we might clear it. 
        // Based on user request "stray to make him a stray animal", usually implies shelter ownership.
        // For now, let's NOT clear ownerId automatically unless requested, 
        // BUT if it was a user submission, they might still be the 'finder'.
        // However, 'Stray' status usually means available for adoption.
        // Let's assume no change to ownerId is needed for Stray unless specified.
    }

    const { error } = await supabase
        .from('Pet')
        .update(updateData)
        .eq('id', petId)

    if (error) {
        console.error('Error updating pet status:', error)
        throw new Error('Failed to update pet status')
    }

    revalidatePath('/admin/reports')
    revalidatePath('/admin/pets')
}

// --- USER SEARCH ---

export async function searchUsers(query: string) {
    if (!query || query.length < 2) return []

    const supabase = await createClient()
    const { data: users, error } = await supabase
        .from('User')
        .select('id, name, email')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(5)

    if (error) {
        console.error('Error searching users:', error)
        return []
    }

    return users
}

export async function searchStrayPets(query: string) {
    if (!query || query.length < 2) return []

    const supabase = await createClient()
    const { data: pets, error } = await supabase
        .from('Pet')
        .select('*')
        .eq('status', 'Stray')
        .or(`name.ilike.%${query}%,breed.ilike.%${query}%`)
        .limit(5)

    if (error) {
        console.error('Error searching stray pets:', error)
        return []
    }

    return pets
}
