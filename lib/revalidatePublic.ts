import { revalidatePath } from "next/cache";

// Refresh cached public pages right after an admin change, instead of waiting for the timed revalidation.
export function revalidateTourPages() {
  revalidatePath("/");
  revalidatePath("/tours/[slug]", "page");
  revalidatePath("/past-tours/[slug]", "page");
}
