import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import AuthSidebar from "../components/AuthSidebar";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string }>;
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

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const displayName = profile?.display_name || profile?.username || user.email || "ضيف";
  const avatarUrl = profile?.avatar_url || "";
  const bio = profile?.bio || "";

  async function saveProfile(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const display_name = String(formData.get("display_name") || "").trim();
    const avatar_url = String(formData.get("avatar_url") || "").trim();
    const bio = String(formData.get("bio") || "").trim();

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: display_name || null,
        avatar_url: avatar_url || null,
        bio: bio || null,
      })
      .eq("id", user.id);

    if (error) {
      redirect("/account?error=save_failed");
    }

    revalidatePath("/account");
    revalidatePath("/");
    redirect("/account?saved=1");
  }

  const avatarFallback = (profile?.display_name || profile?.username || user.email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

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

          {resolvedSearchParams.saved === "1" && (
            <div className="mt-6 rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              تم حفظ التغييرات بنجاح
            </div>
          )}

          <div className="mt-8 grid gap-4 md:grid-cols-[220px_1fr] md:items-start">
            <div className="rounded-3xl bg-gray-50 p-6 text-center">
              <div className="mx-auto flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-gray-200">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={profile?.display_name || profile?.username || "Avatar"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold text-gray-400">{avatarFallback}</span>
                )}
              </div>
              <p className="mt-4 text-sm text-gray-500">صورة الحساب الحالية</p>
            </div>

            <form action={saveProfile} className="rounded-3xl bg-gray-50 p-6 md:p-8 space-y-5">
              <div>
                <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الظاهر
                </label>
                <input
                  id="display_name"
                  name="display_name"
                  type="text"
                  defaultValue={profile?.display_name || ""}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="اسمك الظاهر"
                />
              </div>

              <div>
                <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 mb-1">
                  رابط الصورة الشخصية
                </label>
                <input
                  id="avatar_url"
                  name="avatar_url"
                  type="url"
                  defaultValue={profile?.avatar_url || ""}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  الحقل مخزن كنص في قاعدة البيانات، لذلك ضع رابط صورة مباشر.
                </p>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  نبذة Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={6}
                  defaultValue={bio}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="اكتب نبذة قصيرة عنك..."
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                >
                  حفظ التغييرات
                </button>
                {profile?.username && (
                  <Link
                    href={`/${profile.username}`}
                    className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
                  >
                    عرض الصفحة العامة
                  </Link>
                )}
              </div>
            </form>
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
