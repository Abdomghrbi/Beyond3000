"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOutAction } from "./actions";
import { Menu, X, Home, FileText, User, LogOut, ExternalLink } from "lucide-react";

export default function AuthSidebar({
  displayName,
  username,
}: {
  displayName: string;
  username?: string | null;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        aria-expanded={open}
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur transition hover:bg-gray-50"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
        <span className="hidden sm:inline">{open ? "إغلاق" : "القائمة"}</span>
      </button>

      <div
        className={`fixed inset-0 z-40 transition ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        <aside
          className={`absolute left-0 top-0 flex h-full w-[85vw] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-start justify-between border-b border-gray-100 p-5">
            <div>
              <p className="text-sm text-gray-500">مرحباً بك</p>
              <h2 className="mt-1 text-xl font-bold text-gray-900">{displayName}</h2>
              {username && <p className="text-sm text-gray-500 mt-1">@{username}</p>}
              {username && (
                <Link
                  href={`/${username}`}
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  <ExternalLink size={14} />
                  <span>عرض الصفحة العامة</span>
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="إغلاق القائمة"
              className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-2 p-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <Home size={18} />
              <span>الرئيسية</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <FileText size={18} />
              <span>المقالات</span>
            </Link>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <User size={18} />
              <span>الحساب</span>
            </Link>
          </nav>

          <div className="mt-auto border-t border-gray-100 p-4">
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                <LogOut size={18} />
                <span>تسجيل الخروج</span>
              </button>
            </form>
          </div>
        </aside>
      </div>
    </>
  );
}
