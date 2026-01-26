import { createClient } from '@/lib/supabase/server'
import DonationAnalytics from './DonationAnalytics'

export default async function DonationsPage() {
    const supabase = await createClient()

    // Fetch recent donations (limit 100 or something reasonable?)
    // User didn't specify limit, but we don't want to crash. Let's take last 100 for visual.
    const { data: donations } = await supabase
        .from('Donation')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(50)

    return <DonationAnalytics initialDonations={donations || []} />
}
