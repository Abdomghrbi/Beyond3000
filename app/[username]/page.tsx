import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return {
    title: `${username} — LinkedIn Articles`,
  };
}

export default async function UserPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) {
    notFound();
  }

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("user_id", profile.id)
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            LinkedIn Articles
          </Link>
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
            تسجيل الدخول
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              {profile.display_name?.charAt(0) || profile.username.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.display_name || profile.username}
              </h1>
              <p className="text-gray-500">@{profile.username}</p>
            </div>
          </div>
          {profile.bio && (
            <p className="mt-4 text-gray-600 leading-relaxed">{profile.bio}</p>
          )}
        </div>

        {/* Articles */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">المقالات</h2>

        {articles && articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/${profile.username}/${article.slug}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
              >
                {article.cover_image && (
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {article.excerpt}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(article.created_at).toLocaleDateString("ar-SA")}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-500">لا توجد مقالات منشورة</p>
          </div>
        )}
      </main>
    </div>
  );
}
