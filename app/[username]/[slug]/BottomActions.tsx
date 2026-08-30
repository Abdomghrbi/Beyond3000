"use client";

import { useState, useEffect, useRef } from "react";

export default function BottomActions({ url }: { url: string }) {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);


  const linkedinProfile = "https://www.linkedin.com/in/abdullrahmanalmaghrebi";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.5, rootMargin: "0px 0px -50px 0px" }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  function copyLink() {
    navigator.clipboard.writeText(url);
    alert("تم نسخ الرابط!");
  }

  return (
    <>
    
      <div ref={sentinelRef} className="h-1 w-full" />

      {/* شريط الأزرار */}
      <div
        className={`mt-8 pt-6 border-t border-gray-100 transition-all duration-700 ease-out ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <p className="text-sm text-gray-500 mb-4">شارك المقالة</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={copyLink}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition"
          >
            نسخ الرابط
          </button>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              url
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition"
          >
            LinkedIn
          </a>

          <a
            href={linkedinProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition"
          >
            Feedback
          </a>
        </div>
      </div>
    </>
  );
}
