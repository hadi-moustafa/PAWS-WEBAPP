'use server'

import { sendEmail } from '@/lib/mail'

export async function subscribeToNewsletter(formData: FormData) {
    const email = formData.get('email') as string

    if (!email || !email.includes('@')) {
        return { success: false, message: 'Please provide a valid email address.' }
    }

    try {
        // 1. In a real app, you would save this to your database (e.g., Supabase 'subscribers' table)
        // const supabase = createClient()
        // await supabase.from('subscribers').insert({ email })

        // 2. Send confirmation email via Nodemailer
        await sendEmail({
            to: email,
            subject: 'Welcome to the Pack! 🐾',
            html: `
                <div style="font-family: sans-serif; padding: 20px; text-align: center;">
                    <h1 style="color: #FF9F1C;">Welcome to PAWS News!</h1>
                    <p>You're officially part of the squad.</p>
                    <p>Get ready for weekly doses of cuteness, adoption stories, and very good boys.</p>
                    <br/>
                    <p><strong>Don't shop, Adopt!</strong></p>
                    <p>- The PAWS Team</p>
                </div>
            `
        })

        return { success: true, message: 'Welcome to the pack! Check your email.' }
    } catch (error) {
        console.error('Newsletter error:', error)
        return { success: false, message: 'Something went wrong. Please try again.' }
    }
}
