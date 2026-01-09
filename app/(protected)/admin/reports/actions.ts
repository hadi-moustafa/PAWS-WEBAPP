'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function convertTicketToPet(ticketId: number, formData: FormData) {
    const supabase = await createClient()

    // We need to fetch the ticket first to get the image URL
    const { data: ticket, error: fetchError } = await supabase
        .from('Ticket')
        .select('*')
        .eq('id', ticketId)
        .single()

    if (fetchError || !ticket) {
        console.error('Ticket fetch failed', fetchError)
        return
    }

    const { data: { user } } = await supabase.auth.getUser()

    // Create the Pet
    const { data: newPet, error: createError } = await supabase.from('Pet').insert({
        name: formData.get('name') as string || 'Unknown Stray',
        type: formData.get('type') as string || 'Other',
        breed: 'Unknown',
        age: 1, // Default estimate
        location: ticket.location_name || 'Shelter Intake',
        description: `Stray report #${ticket.id}: ${ticket.subject}. Converted from user report.`,
        images: ticket.imageUrl ? [ticket.imageUrl] : [],
        status: 'Stray',
        ownerId: user?.id,
        // We could link back to ticket here if we add a column, but for now we link ticket to pet
    })
        .select()
        .single()

    if (createError) {
        console.error('Pet creation failed', createError)
        return
    }

    // Update Ticket to Closed + Link Pet
    const { error: updateError } = await supabase.from('Ticket').update({
        status: 'CLOSED',
        convertedPetId: newPet.id
    }).eq('id', ticketId)

    if (updateError) console.error('Ticket update failed', updateError)

    revalidatePath('/admin/reports')
    revalidatePath('/admin/pets') // Update pets list too
}

export async function closeTicket(ticketId: number) {
    const supabase = await createClient()
    await supabase.from('Ticket').update({ status: 'CLOSED' }).eq('id', ticketId)
    revalidatePath('/admin/reports')
}

export async function sendMessage(ticketId: number, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('Message').insert({
        ticketId,
        senderId: user.id,
        content,
        type: 'TEXT',
        isRead: false,
        createdAt: new Date().toISOString()
    })

    if (error) throw new Error(error.message)
}
