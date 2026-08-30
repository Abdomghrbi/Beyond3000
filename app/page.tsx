import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function signOutAction() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("username, display_name, bio")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  const displayName = profile?.display_name || profile?.username || user?.email || "ضيف";
  const username = profile?.username;

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <aside className="w-full md:w-72 shrink-0">
              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-5 md:sticky md:top-6">
                <div className="mb-6">
                  <p className="text-sm text-gray-500">مرحباً بك</p>
                  <h2 className="mt-1 text-xl font-bold text-gray-900">{displayName}</h2>
                  {username && <p className="text-sm text-gray-500 mt-1">@{username}</p>}
                </div>

                <nav className="space-y-2">
                  <Link
                    href="/"
                    className="block rounded-xl px-4 py-3 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                  >
                    الرئيسية
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block rounded-xl px-4 py-3 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                  >
                    المقالات
                  </Link>
                  <Link
                    href="/account"
                    className="block rounded-xl px-4 py-3 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                  >
                    الحساب
                  </Link>
                </nav>

                <form action={signOutAction} className="mt-6">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
                  >
                    تسجيل الخروج
                  </button>
                </form>
              </div>
            </aside>

            <main className="flex-1">
              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-8 md:p-12">
                <div className="max-w-3xl">
                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                    أنت الآن مسجل دخول
                  </span>
                  <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    ابدأ من هنا وادِر مقالاتك بسهولة
                  </h1>
                  <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                    يمكنك الانتقال إلى المقالات، مراجعة حسابك، أو إنشاء محتوى جديد مباشرة من القائمة الجانبية.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/dashboard"
                      className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition"
                    >
                      عرض المقالات
                    </Link>
                    <Link
                      href="/account"
                      className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
                    >
                      صفحة الحساب
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Beyond3000
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              إنشاء حساب
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          اكتب مقالاتك الطويلة<br />
          <span className="text-blue-600">وشاركها مع العالم</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          لينكدان يحدك بـ 3000 حرف؟ أنشئ حسابك واكتب مقالاتك بدون قيود.
          احصل على رابط جميل وشاركه مع متابعيك.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition text-lg"
          >
            ابدأ الآن — مجاناً
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-xl transition text-lg"
          >
            لدي حساب
          </Link>
        </div>
      </main>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-3xl mb-4">✍️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">كتابة حرة</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              اكتب بدون حدود للأحرف. مقالاتك تبقى ملكك بالكامل.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-3xl mb-4">🔗</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">رابط جميل</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              كل مقالة لها رابط فريد: beyond3000.vercel.app/username/article-slug
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">متوافق مع لينكدان</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              عند مشاركة الرابط على لينكدان، يظهر بشكل احترافي.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
