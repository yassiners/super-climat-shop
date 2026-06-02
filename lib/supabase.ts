import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

// Server-side only — uses service role key for storage uploads
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Upload an image to Supabase Storage bucket "produits"
 * Returns the public URL of the uploaded file
 */
export async function uploadProductImage(
  file: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from('produits')
    .upload(filename, file, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: publicData } = supabaseAdmin.storage
    .from('produits')
    .getPublicUrl(data.path);

  return publicData.publicUrl;
}

/**
 * Delete an image from Supabase Storage bucket "produits"
 */
export async function deleteProductImage(filename: string): Promise<void> {
  await supabaseAdmin.storage.from('produits').remove([filename]);
}
