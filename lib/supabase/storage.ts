import { createAdminClient } from './admin'

export async function uploadImage(file: File, bucket: string = 'paws_images') {
    const supabase = createAdminClient()

    // Create bucket if not exists (fail silently if exists)
    // Note: RLS policies might need manual setup on dashboard for public reads, 
    // but Service Role bypasses RLS for uploads.
    // We assume the bucket is public for reading.
    const { error: bucketError } = await supabase.storage.createBucket(bucket, {
        public: true
    })

    if (bucketError && !bucketError.message.includes('already exists')) {
        console.error('Bucket creation failed:', bucketError)
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, buffer, {
            contentType: file.type,
            upsert: false
        })

    if (uploadError) {
        throw new Error('Upload failed: ' + uploadError.message)
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

    return publicUrl
}
