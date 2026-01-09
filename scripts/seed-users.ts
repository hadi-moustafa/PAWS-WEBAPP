import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })


const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SERVICE_ROLE_KEY) {
    console.error('Error: SUPABASE_SERVICE_ROLE_KEY is required.')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

const users = [
    {
        email: 'super@paws.com',
        password: 'password123',
        role: 'Super_Admin',
        name: 'Super Admin User'
    },
    {
        email: 'admin@paws.com',
        password: 'password123',
        role: 'Admin',
        name: 'Admin User'
    },
    {
        email: 'vet@paws.com',
        password: 'password123',
        role: 'Vet',
        name: 'Dr. Vet User'
    }
]

async function seedUsers() {
    console.log('🌱 Seeding users...')

    for (const user of users) {
        console.log(`Creating ${user.role}: ${user.email}...`)

        // 1. Create User in Auth
        const { data, error } = await supabase.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true,
            user_metadata: {
                role: user.role,
                name: user.name,
                password: user.password // Passing password in metadata for trigger to use
            }
        })

        if (error) {
            console.error(`❌ Failed to create ${user.email}:`, error.message)
        } else {
            console.log(`✅ Created ${user.email} (ID: ${data.user.id})`)
        }
    }

    console.log('✨ Done!')
}

seedUsers()
