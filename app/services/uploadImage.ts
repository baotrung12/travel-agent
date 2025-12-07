import { createClient } from '@supabase/supabase-js'
import toast from "react-hot-toast";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function uploadImages(files: File[], bucket): Promise<string[] | null> {
  try {
    const imageUrls: string[] = []

    for (const file of files) {
      // unique filename
      const fileName = `${Date.now()}-${file.name}`;

      // upload to Supabase Storage bucket "tours"
      const {data, error} = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        toast.error("Failed to update image")
        continue
      }

      // get public URL
      const {data: publicUrlData} = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      imageUrls.push(publicUrlData.publicUrl);
    }

    return imageUrls;
  } catch (err) {
    console.error('Unexpected upload error:', err);
    return null;
  }
}
