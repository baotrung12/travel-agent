import {createClient} from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// "Bờ_biển_Vũng Tàu.JPG" -> "bo_bien_vung-tau.jpg"
function toStorageKey(name: string) {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  const safeBase = base
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "image";
  return ext ? `${safeBase}.${ext}` : safeBase;
}

// Uploads files to a public Supabase Storage bucket and returns their public URLs.
// Throws if any upload fails, so callers don't save a record with missing images.
export async function uploadImages(files: File[], bucket: string): Promise<string[]> {
  const imageUrls: string[] = []

  for (const file of files) {
    // unique, ASCII-only filename (Supabase rejects keys with accents or special characters)
    const fileName = `${Date.now()}-${toStorageKey(file.name)}`;

    const {error} = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      const reason = /bucket not found/i.test(error.message)
        ? `bucket "${bucket}" chưa được tạo trên Supabase`
        : error.message;
      throw new Error(`Không tải được ảnh "${file.name}": ${reason}`);
    }

    const {data: publicUrlData} = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    imageUrls.push(publicUrlData.publicUrl);
  }

  return imageUrls;
}
