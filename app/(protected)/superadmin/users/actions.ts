'use server'

import { createAdminClient } from '@/lib/supabase/admin' // Correct import for admin actions
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteUser(userId: string) {
    // START: Permissions Check
    // We must verify the requester is a Super_Admin before allowing them to use the admin client
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { data: requesterProfile } = await supabase
        .from('User')
        .select('role')
        .eq('id', user.id)
        .single()

    if (requesterProfile?.role !== 'Super_Admin') {
        return { error: 'Forbidden: Only Super Admins can delete users.' }
    }
    // END: Permissions Check

    // 0. Safety Check: Ensure we are not deleting a Super Admin
    // (Double check the target user's role before deleting)
    const { data: targetUser } = await supabase
        .from('User')
        .select('role')
        .eq('id', userId)
        .single()

    if (targetUser?.role === 'Super_Admin') {
        return { error: 'Forbidden: Cannot delete a Super Admin account.' }
    }

    const adminClient = createAdminClient()

    // 1. Check if user exists (optional, but good practice)
    // 2. Perform deletion
    const { error } = await adminClient.auth.admin.deleteUser(userId)

    if (error) {
        console.error('Error deleting user:', error)
        return { error: 'Failed to delete user. Ensure you have permissions.' }
    }

    // Attempt to delete from public.User table if not handled by trigger (SUPABASE AUTH SYNC)
    // Usually cascade or triggers handle this, but let's be safe if we are managing it manually
    const { error: dbError } = await adminClient.from('User').delete().eq('id', userId)

    if (dbError) {
        console.error('Error deleting user record:', dbError)
        // Not returning error here as auth deletion might have succeeded
    }

    revalidatePath('/superadmin/users')
    return { success: true }
}

export async function updateUser(userId: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const role = formData.get('role') as string

    if (!name || !role) {
        return { error: 'Name and Role are required.' }
    }

    // Update public User table
    const { error } = await supabase
        .from('User')
        .update({ name, role })
        .eq('id', userId)

    if (error) {
        console.error('Error updating user:', error)
        return { error: 'Failed to update user details.' }
    }

    // If needed: Update Auth Metadata (optional, based on requirement)
    // await supabase.auth.admin.updateUserById(userId, { user_metadata: { name, role } })

    revalidatePath('/superadmin/users')
    revalidatePath(`/superadmin/users/${userId}`)
    redirect('/superadmin/users')
}
