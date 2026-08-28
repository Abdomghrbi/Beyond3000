"use client";

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  function copyLink() {
    navigator.clipboard.writeText(url);
    alert("تم نسخ الرابط!");
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <p className="text-sm text-gray-500 mb-3">شارك المقالة</p>
      <div className="flex gap-2">
        <button
          onClick={copyLink}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
        >
          📋 نسخ الرابط
        </button>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
        >
          💼 LinkedIn
        </a>
      </div>
    </div>
  );
}
