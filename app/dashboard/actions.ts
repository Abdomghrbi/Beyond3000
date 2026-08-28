"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 60);
}

export async function createArticle(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "يجب تسجيل الدخول" };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const coverImage = formData.get("cover_image") as string;
  const published = formData.get("published") === "on";

  const slug = generateSlug(title);
  const excerpt = content.replace(/<[^>]*>/g, "").substring(0, 150) + "...";

  const { error } = await supabase.from("articles").insert({
    user_id: user.id,
    title,
    slug,
    content,
    excerpt,
    cover_image: coverImage || null,
    published,
  });

  if (error) {
    if (error.message.includes("duplicate")) {
      return { error: "عنوان المقالة مستخدم مسبقاً. جرّب عنواناً آخر." };
    }
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function deleteArticle(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "يجب تسجيل الدخول" };

  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}
