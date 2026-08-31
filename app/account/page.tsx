import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AuthSidebar from "../components/AuthSidebar";
import AccountProfileClient from "./AccountProfileClient";

export const dynamic = "force-dynamic";

const ERROR_MESSAGES: Record<string, string> = {
  save_failed: "تعذر حفظ التغييرات",
  no_file: "اختر ملف صورة أولاً",
  invalid_file_type: "الملف يجب أن يكون صورة",
  file_too_large: "حجم الصورة كبير جداً. الحد الأقصى 5MB",
  upload_failed: "تعذر رفع الصورة",
  profile_update_failed: "تم رفع الصورة لكن فشل تحديث الملف",
  delete_failed: "تعذر حذف الصورة",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string; avatar_deleted?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const params = searchParams ? await searchParams : {};
  const savedMessage =
    params.saved === "1"
      ? "تم حفظ التغييرات بنجاح"
      : params.avatar_deleted === "1"
        ? "تم حذف الصورة بنجاح"
        : params.error
          ? ERROR_MESSAGES[params.error] || "حدث خطأ غير متوقع"
          : null;

  const displayName = profile?.display_name || profile?.username || user.email || "ضيف";

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthSidebar displayName={displayName} username={profile?.username} />

      <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-8 md:p-12">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">معلومات الحساب</h1>
            </div>
            {profile?.username && (
              <Link
                href={`/${profile.username}`}
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
              >
                عرض الصفحة العامة
              </Link>
            )}
          </div>

          <div className="mt-8">
            <AccountProfileClient
              profile={{
                username: profile?.username,
                display_name: profile?.display_name,
                bio: profile?.bio,
                avatar_url: profile?.avatar_url,
              }}
              email={user.email ?? null}
              savedMessage={savedMessage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
