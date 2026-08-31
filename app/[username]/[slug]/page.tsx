import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import BottomActions from "./BottomActions";
import { resolveAvatarUrl } from "@/lib/avatar";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 60);
}

export async function generateMetadata({ params }: { params: Promise<{ username: string; slug: string }> }): Promise<Metadata> {
  const { username, slug } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .eq("username", username)
    .single();

  if (!profile) return { title: "غير موجود" };

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("user_id", profile.id)
    .eq("published", true)
    .order("created_at", { ascending: false });

  const article = articles?.find((item) => (item.slug || generateSlug(item.title)) === slug);

  if (!article) return { title: "غير موجود" };

  const articleSlug = article.slug || generateSlug(article.title);

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: `https://beyond3000.vercel.app/${username}/${articleSlug}`,
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

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("user_id", profile.id)
    .eq("published", true)
    .order("created_at", { ascending: false });

  const article = articles?.find((item) => (item.slug || generateSlug(item.title)) === slug);

  if (!article) notFound();

  const articleSlug = article.slug || generateSlug(article.title);
  const articleUrl = `https://beyond3000.vercel.app/${username}/${articleSlug}`;
  const avatarSrc = resolveAvatarUrl(profile.avatar_url);
  const avatarFallback = (profile.display_name || profile.username || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 px-4 py-3 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Beyond3000
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
        {article.cover_image && (
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8"
          />
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden text-lg font-bold">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={profile.display_name || profile.username}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{avatarFallback}</span>
            )}
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

        <div
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        
        <BottomActions url={articleUrl} />
      </article>
    </div>
  );
}
