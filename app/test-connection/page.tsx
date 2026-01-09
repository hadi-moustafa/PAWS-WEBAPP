
import { createClient } from "@/lib/supabase/server";

export default async function TestConnection() {
    const supabase = await createClient();

    // Test 1: Check Auth Service
    const { error: authError } = await supabase.auth.getSession();

    // Test 2: Check Database Connection (Querying a table that should exist or checking response)
    // We'll just check if we can reach the DB. Even a "table not found" error proves connection.
    const { error: dbError } = await supabase.from('random_table_check').select('*').limit(1);

    const isAuthConnected = !authError;
    // If the error code is 'PGRST204' (detected) or just '42P01' (relation does not exist), 
    // it means we effectively talked to Postgres.
    // Network errors look different.
    const isDbReachable = dbError?.code === '42P01' || !dbError || dbError?.code === 'PGRST116';

    return (
        <div style={{ padding: "4rem", fontFamily: "var(--font-outfit)" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Supabase Connection Status</h1>

            <div className="neopop-card" style={{ padding: "2rem", maxWidth: "600px" }}>
                <div style={{ marginBottom: "1rem" }}>
                    <strong>Auth Service: </strong>
                    <span style={{ color: isAuthConnected ? "green" : "red" }}>
                        {isAuthConnected ? "✅ Connected" : `❌ Failed: ${authError?.message}`}
                    </span>
                </div>

                <div>
                    <strong>Database: </strong>
                    <span style={{ color: isDbReachable ? "green" : "red" }}>
                        {isDbReachable ? "✅ Reachable" : `❌ Failed: ${dbError?.message}`}
                    </span>
                </div>

                <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
                    (Note: &apos;Reachable&apos; means we can talk to the database, even if tables aren&apos;t created yet.)
                </p>
            </div>
        </div>
    );
}
