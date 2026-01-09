import { createClient } from '@supabase/supabase-js'

// Note: This client uses the Service Role Key and should ONLY be used
// in secure server-side contexts (Server Actions, API Routes).
// NEVER expose this client to the browser.
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!serviceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.')
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}
