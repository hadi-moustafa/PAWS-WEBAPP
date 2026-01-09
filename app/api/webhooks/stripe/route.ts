import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
    const body = await req.text()
    const sig = (await headers()).get('stripe-signature') as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    } catch (err: any) {
        console.error(`Webhook Signature Verification Failed: ${err.message}`)
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    const supabase = createClient()

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session
                // Example: Handle successful donation or payment
                if (session.metadata?.donationId) {
                    await supabase.from('Donation').update({ status: 'COMPLETED', paymentId: session.payment_intent as string }).eq('id', parseInt(session.metadata.donationId))
                }
                // Example: Handle Order
                if (session.metadata?.orderId) {
                    await supabase.from('Order').update({ status: 'PAID' }).eq('id', parseInt(session.metadata.orderId))
                }
                break
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent
                console.log(`PaymentIntent succeeded: ${paymentIntent.id}`)
                break
            default:
                console.log(`Unhandled event type ${event.type}`)
        }
    } catch (error) {
        console.error('Error processing webhook:', error)
        return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 })
    }

    return NextResponse.json({ received: true })
}
