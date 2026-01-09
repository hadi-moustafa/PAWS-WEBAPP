'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { uploadImage } from '@/lib/supabase/storage'

// ...

export async function createProduct(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)

    // Handle Image
    const imageFile = formData.get('image') as File
    let imageUrl = 'https://placedog.net/300/300?random' // Default

    if (imageFile && imageFile.size > 0) {
        try {
            imageUrl = await uploadImage(imageFile, 'paws_images')
        } catch (e) {
            console.error('Image upload failed', e)
            // Continue with default or handle error
        }
    }

    const { error } = await supabase.from('Product').insert({
        name,
        description,
        category,
        price,
        stock,
        imageUrl,
    })

    if (error) {
        console.error('Create Product Error:', error)
        return redirect('/admin/inventory/create?error=' + encodeURIComponent(error.message))
    }

    revalidatePath('/admin/inventory')
    redirect('/admin/inventory')
}

export async function deleteProduct(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string

    const { error } = await supabase.from('Product').delete().eq('id', id)

    if (error) {
        console.error('Delete Error', error)
    }

    revalidatePath('/admin/inventory')
}

export async function updateStock(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string
    const adjustment = parseInt(formData.get('amount') as string)

    // Simplified: Getting current stock then updating. 
    // Ideally use an RPC for atomic increment, but read-modify-write is okay for MVP prototype.
    const { data: product } = await supabase.from('Product').select('stock').eq('id', id).single()

    if (product) {
        const newStock = Math.max(0, product.stock + adjustment)
        await supabase.from('Product').update({ stock: newStock }).eq('id', id)
    }

    revalidatePath('/admin/inventory')
}
