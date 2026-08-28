"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const displayName = formData.get("display_name") as string;

  // التحقق من أن username فريد
  const { data: existing } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single();

  if (existing) {
    return { error: "اسم المستخدم مستخدم مسبقاً" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: displayName || username,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/login?registered=true");
}
