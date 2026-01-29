'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createStaffUser(formData: FormData) {
    const supabaseAdmin = createAdminClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const role = formData.get('role') as string // 'Admin', 'Vet'

    // 1. Create User in Auth (trigger will handle public.User creation, assuming it works)
    // We pass password in metadata as well just in case the trigger needs it as per previous fix
    const { data: authData, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            role,
            name,
            password
        }
    })

    if (error) {
        console.error('Create User Error:', error)
        redirect('/superadmin/users/create?error=' + encodeURIComponent(error.message))
    }

    // Validate role explicitly as per requirements
    let finalRole = 'User'
    console.log('Incoming role from form:', role) // Debug log

    if (role === 'Vet') {
        finalRole = 'Vet'
    } else if (role === 'Admin') {
        finalRole = 'Admin'
    }
    console.log('Final determined role:', finalRole) // Debug log

    if (authData.user) {
        // Use UPSERT to handle potential race conditions with Supabase triggers.
        const { error: dbError } = await supabaseAdmin
            .from('User')
            .upsert({
                id: authData.user.id,
                email: email,
                name: name,
                role: finalRole
            }, { onConflict: 'id' })

        if (dbError) {
            console.error('Database Upsert Error:', dbError)
            // If DB update fails, we must notify the user or retry
            throw new Error(`Failed to save user role: ${dbError.message}`)
        }
    }



    revalidatePath('/superadmin/users')
    redirect('/superadmin/users')
}
