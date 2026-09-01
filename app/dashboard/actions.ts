"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function generateSlug(title: string): string {
  
  let slug = title
    .trim()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[^\u0600-\u06FF\u0750-\u077Fa-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") 
    .replace(/^-|-$/g, "") 
    .substring(0, 60);
  
  if (!slug) {
    slug = "maqal-" + Math.random().toString(36).slice(2, 8);
  }

  return slug;
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
  
  const excerpt = content
    .replace(/[#*_`\[\]\(\)!]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 150) + "...";

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
