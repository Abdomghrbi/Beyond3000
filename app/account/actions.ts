"use server";

import { createClient } from "@/lib/supabase/server";
import { extractAvatarStoragePath, getAvatarBucketName } from "@/lib/avatar";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getImageExtension(file: File): string {
  const byType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "image/svg+xml": "svg",
  };

  if (byType[file.type]) return byType[file.type];

  const nameExt = file.name.split(".").pop()?.toLowerCase();
  if (nameExt && nameExt.length <= 5) return nameExt;

  return "jpg";
}

function getErrorRedirect(code: string) {
  return `/account?error=${encodeURIComponent(code)}`;
}

async function getCurrentProfilePath(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  return data ?? null;
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const display_name = String(formData.get("display_name") || "").trim();
  const bio = String(formData.get("bio") || "").trim();

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: display_name || null,
      bio: bio || null,
    })
    .eq("id", user.id);

  if (error) {
    redirect(getErrorRedirect("save_failed"));
  }

  revalidatePath("/account");
  revalidatePath("/");
  redirect("/account?saved=1");
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) {
    redirect(getErrorRedirect("no_file"));
  }

  if (!file.type.startsWith("image/")) {
    redirect(getErrorRedirect("invalid_file_type"));
  }

  if (file.size > 5 * 1024 * 1024) {
    redirect(getErrorRedirect("file_too_large"));
  }

  const currentProfile = await getCurrentProfilePath(supabase, user.id);
  const oldStoragePath = extractAvatarStoragePath(currentProfile?.avatar_url);

  const bucket = getAvatarBucketName();
  const extension = getImageExtension(file);
  const storagePath = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, bytes, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    redirect(getErrorRedirect("upload_failed"));
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: storagePath })
    .eq("id", user.id);

  if (updateError) {
    await supabase.storage.from(bucket).remove([storagePath]);
    redirect(getErrorRedirect("profile_update_failed"));
  }

  if (oldStoragePath && oldStoragePath !== storagePath) {
    await supabase.storage.from(bucket).remove([oldStoragePath]);
  }

  revalidatePath("/account");
  revalidatePath("/");
  revalidatePath("/[username]", "page");
  revalidatePath("/[username]/[slug]", "page");
  redirect("/account?saved=1");
}

export async function deleteAvatar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const currentProfile = await getCurrentProfilePath(supabase, user.id);
  const storagePath = extractAvatarStoragePath(currentProfile?.avatar_url);

  if (storagePath) {
    await supabase.storage.from(getAvatarBucketName()).remove([storagePath]);
  }

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", user.id);

  if (error) {
    redirect(getErrorRedirect("delete_failed"));
  }

  revalidatePath("/account");
  revalidatePath("/");
  revalidatePath("/[username]", "page");
  revalidatePath("/[username]/[slug]", "page");
  redirect("/account?avatar_deleted=1");
}
