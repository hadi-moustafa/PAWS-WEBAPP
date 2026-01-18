"use server";

import { createClient } from "@/lib/supabase/server";

export async function getFinanceStats() {
    const supabase = await createClient();

    // 1. Total Funds (Sum of all orders)
    const { data: totalSalesData, error: totalSalesError } = await supabase
        .from("Order")
        .select("totalAmount");

    if (totalSalesError) {
        console.error("Error fetching total sales:", totalSalesError);
        return { totalFunds: 0, categoryStats: [] };
    }

    const totalFunds = totalSalesData.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
    );

    // 2. Category Stats (Join Order -> Product)
    // We need to fetch Orders and their associated Products to aggregate in JS
    // because Supabase Client doesn't support complex JOIN/GROUP BY directly easily without RPC.
    // Alternatively, we can use RPC if one existed, but I'll do it in application code for "simple" logic.

    const { data: ordersWithProduct, error: categoryError } = await supabase
        .from("Order")
        .select(`
      totalAmount,
      Product (
        name,
        category
      )
    `)
        .not("product_id", "is", null);

    if (categoryError) {
        console.error("Error fetching category stats:", categoryError)
        return { totalFunds, categoryStats: [] }
    }

    // Aggregate by category
    const categoryMap: Record<string, { count: number; revenue: number }> = {};

    ordersWithProduct.forEach((order: any) => {
        const category = order.Product?.category || "Uncategorized";
        if (!categoryMap[category]) {
            categoryMap[category] = { count: 0, revenue: 0 };
        }
        categoryMap[category].count += 1;
        categoryMap[category].revenue += (order.totalAmount || 0);
    });

    const categoryStats = Object.entries(categoryMap).map(([name, stats]) => ({
        name,
        value: stats.count, // Sold out faster (quantity)
        revenue: stats.revenue // We sell from the most (money)
    })).sort((a, b) => b.value - a.value); // Sort by quantity desc

    return {
        totalFunds,
        categoryStats,
    };
}

export async function getRecentTransactions() {
    const supabase = await createClient();

    const { data: transactions, error } = await supabase
        .from("Order")
        .select(`
            id,
            createdAt,
            totalAmount,
            status,
            type,
            Product (
                name
            )
        `)
        .order("createdAt", { ascending: false })
        .limit(10);

    if (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }

    return transactions.map((t: any) => ({
        id: `ORD-${t.id}`,
        date: new Date(t.createdAt).toLocaleDateString(),
        description: t.Product?.name ? `Sale: ${t.Product.name}` : "Order",
        amount: t.totalAmount,
        type: "credit", // Orders are income
        status: t.status
    }));
}
