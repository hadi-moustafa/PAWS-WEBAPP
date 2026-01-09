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
    const { error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            role,
            name,
            password // Passing for trigger compatibility
        }
    })

    if (error) {
        console.error('Create User Error:', error)
        // In a real app, we'd return state to display error
        redirect('/superadmin/users/create?error=' + encodeURIComponent(error.message))
    }

    revalidatePath('/superadmin/users')
    redirect('/superadmin/users')
}
