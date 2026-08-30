import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { deleteArticle } from "./actions";
import CopyLinkButton from "../components/CopyLinkButton";

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

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Beyond3000
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">@{profile?.username}</span>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              أهلاً {profile?.display_name || profile?.username}!
            </h1>
            <p className="text-gray-600 mt-1">إدارة مقالاتك</p>
          </div>
          <Link
            href="/dashboard/new"
            className="px-4 py-2 bg-blue-300 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            + مقالة جديدة
          </Link>
        </div>

        {articles && articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => {
              const articleUrl = `https://beyond3000.vercel.app/${profile?.username}/${article.slug}`;
              return (
                <div
                  key={article.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {article.title}
                      </h3>
                      {!article.published && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                          مسودة
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(article.created_at).toLocaleDateString("ar-SA")}
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {article.published && (
                      <>
                        <Link
                          href={`/${profile?.username}/${article.slug}`}
                          target="_blank"
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          عرض
                        </Link>
                        <CopyLinkButton url={articleUrl} />
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-700 hover:text-blue-800 font-medium"
                        >
                          💼 LinkedIn
                        </a>
                      </>
                    )}
                    <form action={async () => {
                      "use server";
                      await deleteArticle(article.id);
                    }}>
                      <button
                        type="submit"
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        حذف
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500 mb-4">ما عندك مقالات حالياً</p>
            <Link
              href="/dashboard/new"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              اكتب أول مقالة
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
