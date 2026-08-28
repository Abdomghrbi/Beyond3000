"use client";

import { useState } from "react";
import { createArticle } from "../actions";
import Link from "next/link";

export default function NewArticlePage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createArticle(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            LinkedIn Articles
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
            رجوع للوحة التحكم
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">مقالة جديدة</h1>

        <form action={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              العنوان *
            </label>
            <input
              name="title"
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="عنوان مقالتك..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              صورة الغلاف (رابط)
            </label>
            <input
              name="cover_image"
              type="url"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المحتوى *
            </label>
            <textarea
              name="content"
              required
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y"
              placeholder="اكتب مقالتك هنا..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              name="published"
              type="checkbox"
              id="published"
              className="w-5 h-5 text-blue-600 rounded"
              defaultChecked
            />
            <label htmlFor="published" className="text-sm text-gray-700">
              نشر المقالة فوراً
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              {loading ? "جاري الحفظ..." : "نشر المقالة"}
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              إلغاء
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
