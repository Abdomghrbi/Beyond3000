import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ username: string; slug: string }> }): Promise<Metadata> {
  const { username, slug } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .eq("username", username)
    .single();

  if (!profile) return { title: "غير موجود" };

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("user_id", profile.id)
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!article) return { title: "غير موجود" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: `https://linkedin-articles-six.vercel.app/${username}/${slug}`,
      images: article.cover_image ? [{ url: article.cover_image }] : [],
      authors: [profile.display_name || profile.username],
      publishedTime: article.created_at,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.cover_image ? [article.cover_image] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ username: string; slug: string }> }) {
  const { username, slug } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("user_id", profile.id)
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!article) notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200 px-4 py-3 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            LinkedIn Articles
          </Link>
          <Link
            href={`/${profile.username}`}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            @{profile.username}
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 py-8">
        {/* Cover Image */}
        {article.cover_image && (
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8"
          />
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {article.title}
        </h1>

        {/* Author Info */}
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
            {profile.display_name?.charAt(0) || profile.username.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {profile.display_name || profile.username}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(article.created_at).toLocaleDateString("ar-SA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-3">شارك المقالة</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (typeof navigator !== "undefined") {
                  navigator.clipboard.writeText(window.location.href);
                  alert("تم نسخ الرابط!");
                }
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
            >
              نسخ الرابط
            </button>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                `https://linkedin-articles-six.vercel.app/${username}/${slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
            >
              مشاركة على LinkedIn
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
