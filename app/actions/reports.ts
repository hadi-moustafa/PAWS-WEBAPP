"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPendingPets() {
    const supabase = await createClient();

    // Fetch pets with status 'Pending'
    const { data: pets, error } = await supabase
        .from("Pet")
        .select("*")
        .eq("status", "Pending")
        .order("createdAt", { ascending: false });

    if (error) {
        console.error("Error fetching pending pets:", error);
        return [];
    }

    return pets;
}

export async function updatePetStatus(petId: number, newStatus: "Stray" | "Rejected") {
    const supabase = await createClient();

    const { error } = await supabase
        .from("Pet")
        .update({ status: newStatus })
        .eq("id", petId);

    if (error) {
        console.error(`Error updating pet ${petId} to ${newStatus}:`, error);
        throw new Error("Failed to update pet status");
    }

    revalidatePath("/admin/reports");
    return { success: true };
}
