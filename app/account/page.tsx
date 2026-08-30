import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AuthSidebar from "../components/AuthSidebar";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
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

  const displayName = profile?.display_name || profile?.username || user.email || "ضيف";

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthSidebar displayName={displayName} username={profile?.username} />

      <main className="mx-auto max-w-6xl px-4 py-16 pt-24 md:px-6">
        <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-8 md:p-12">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-gray-500">قسم الحساب</p>
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

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">الاسم الظاهر</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {profile?.display_name || "غير محدد"}
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">اسم المستخدم</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {profile?.username ? `@${profile.username}` : "غير محدد"}
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">البريد الإلكتروني</p>
              <p className="mt-1 text-lg font-semibold text-gray-900 break-all">{user.email}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">الحالة</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">مسجل دخول</p>
            </div>
          </div>

          {profile?.bio && (
            <div className="mt-6 rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">نبذة</p>
              <p className="mt-1 text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
