"use client";

import { useState } from "react";
import { createArticle } from "../actions";
import Link from "next/link";
import CoverUploader from "./CoverUploader";

export default function NewArticlePage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

  
    if (coverUrl) {
      formData.set("cover_image", coverUrl);
    }

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
            Beyond3000
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
            لوحة التحكم
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">مقالة جديدة</h2>

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

        
          <CoverUploader onUpload={setCoverUrl} />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                المحتوى *
              </label>
              <span className="text-xs text-gray-400">يدعم Markdown</span>
            </div>
            <textarea
              name="content"
              required
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y font-mono text-sm leading-relaxed"
              placeholder={`اكتب ما تريد..`}
            />
            <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 space-y-1">
              <p className="font-bold text-gray-700 mb-1">تنسيق سريع:</p>
              <p><code className="bg-gray-200 px-1 rounded">## نص..</code> → عنوان فرعي</p>
              <p><code className="bg-gray-200 px-1 rounded">### نص..</code> → عنوان أصغر</p>
              <p><code className="bg-gray-200 px-1 rounded">- نص..</code> → قائمة نقطية</p>
              <p><code className="bg-gray-200 px-1 rounded">**نص**</code> → <strong>عريض</strong></p>
              <p><code className="bg-gray-200 px-1 rounded">[مثال](رابط)</code> → رابط</p>
            </div>
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
              نشر الآن
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              {loading ? "جاري الحفظ..." : "نشر"}
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
