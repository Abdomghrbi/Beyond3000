import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            LinkedIn Articles
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              @{profile?.username}
            </span>
            <form action={async () => {
              "use server";
              const supabase = await createClient();
              await supabase.auth.signOut();
            }}>
              <button type="submit" className="text-sm text-red-600 hover:text-red-700">
                خروج
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            أهلاً {profile?.display_name || profile?.username}!
          </h1>
          <p className="text-gray-600 mb-6">
            لوحة التحكم جاهزة. قريباً رح تقدر تضيف مقالاتك هون.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
            🚀 المرحلة الجاية: إنشاء وعرض المقالات
          </div>
        </div>
      </main>
    </div>
  );
}
