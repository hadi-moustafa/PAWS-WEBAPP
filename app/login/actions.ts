'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/login?error=Invalid credentials')
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const role = user.user_metadata?.role
        if (role === 'Super_Admin') redirect('/superadmin')
        if (role === 'Admin') redirect('/admin')
        if (role === 'Vet') redirect('/vet')
        if (role === 'User') redirect('/') // Mobile users stay on landing or go to profile
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
