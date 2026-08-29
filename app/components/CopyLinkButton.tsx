"use client";

export default function CopyLinkButton({ url }: { url: string }) {
  function copy() {
    navigator.clipboard.writeText(url);
    alert("تم نسخ الرابط!");
  }

  return (
    <button
      onClick={copy}
      className="text-sm text-gray-500 hover:text-blue-600 font-medium transition"
    >
      📋 نسخ الرابط
    </button>
  );
}
