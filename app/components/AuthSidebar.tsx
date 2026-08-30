import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function signOutAction() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export default function AuthSidebar({
  displayName,
  username,
}: {
  displayName: string;
  username?: string | null;
}) {
  return (
    <aside className="w-full md:w-72 shrink-0">
      <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-5 md:sticky md:top-6">
        <div className="mb-6">
          <p className="text-sm text-gray-500">مرحباً بك</p>
          <h2 className="mt-1 text-xl font-bold text-gray-900">{displayName}</h2>
          {username && <p className="text-sm text-gray-500 mt-1">@{username}</p>}
        </div>

        <nav className="space-y-2">
          <Link
            href="/"
            className="block rounded-xl px-4 py-3 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
          >
            الرئيسية
          </Link>
          <Link
            href="/dashboard"
            className="block rounded-xl px-4 py-3 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
          >
            المقالات
          </Link>
          <Link
            href="/account"
            className="block rounded-xl px-4 py-3 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
          >
            الحساب
          </Link>
        </nav>

        <form action={signOutAction} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
          >
            تسجيل الخروج
          </button>
        </form>
      </div>
    </aside>
  );
}
