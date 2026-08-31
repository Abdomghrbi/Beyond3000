"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { deleteAvatar, updateProfile, uploadAvatar } from "./actions";
import { resolveAvatarUrl } from "@/lib/avatar";

export default function AccountProfileClient({
  profile,
  email,
  savedMessage,
}: {
  profile: {
    username?: string | null;
    display_name?: string | null;
    bio?: string | null;
    avatar_url?: string | null;
  };
  email: string | null;
  savedMessage?: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFormRef = useRef<HTMLFormElement>(null);
  const deleteFormRef = useRef<HTMLFormElement>(null);

  const avatarSrc = useMemo(() => resolveAvatarUrl(profile.avatar_url), [profile.avatar_url]);
  const avatarFallback = (profile.display_name || profile.username || email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handlePickAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl((current) => {
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
      return nextPreviewUrl;
    });
    setFileName(file.name);
    setPreviewOpen(false);
  };

  const handleUploadAvatar = () => {
    uploadFormRef.current?.requestSubmit();
  };

  const handleDeleteAvatar = () => {
    const confirmed = window.confirm("هل تريد حذف الصورة الشخصية؟");
    if (!confirmed) return;
    deleteFormRef.current?.requestSubmit();
  };

  return (
    <div className="space-y-6">
      {savedMessage && (
        <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {savedMessage}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <section className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6 text-center">
          <div className="mx-auto flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={profile.display_name || profile.username || "Avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-6xl font-bold text-gray-400">{avatarFallback}</span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={handlePickAvatar}
              className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
            >
              تغيير الصورة
            </button>
            <button
              type="button"
              onClick={handleDeleteAvatar}
              className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
            >
              حذف الصورة
            </button>
          </div>

          {previewUrl && (
            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-3 text-right">
              <div className="flex items-center gap-3">
                <img
                  src={previewUrl}
                  alt="معاينة الصورة"
                  className="h-14 w-14 rounded-xl object-cover ring-1 ring-blue-200"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {fileName || "صورة جديدة"}
                  </p>
                  <p className="text-xs text-gray-500">الصورة جاهزة للمعاينة قبل الحفظ</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  معاينة الصورة
                </button>
                <button
                  type="button"
                  onClick={handleUploadAvatar}
                  className="rounded-full bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  رفع الصورة
                </button>
              </div>
            </div>
          )}

          <form ref={uploadFormRef} action={uploadAvatar} encType="multipart/form-data" className="hidden">
            <input
              ref={fileInputRef}
              type="file"
              name="avatar"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </form>

          <form ref={deleteFormRef} action={deleteAvatar} className="hidden" />
        </section>

        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
              <p className="text-sm text-gray-500">الاسم الظاهر</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {profile.display_name || "غير محدد"}
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
              <p className="text-sm text-gray-500">اسم المستخدم</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {profile.username ? `@${profile.username}` : "غير محدد"}
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
              <p className="text-sm text-gray-500">البريد الإلكتروني</p>
              <p className="mt-1 text-lg font-semibold text-gray-900 break-all">{email}</p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
              <p className="text-sm text-gray-500">حالة الحساب</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">نشِط</p>
            </div>
          </div>

          {profile.bio && (
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
              <p className="text-sm text-gray-500">Bio</p>
              <p className="mt-2 text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">تعديل الملف الشخصي</h2>
              
              </div>
              <button
                type="button"
                onClick={() => setEditing((value) => !value)}
                className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                {editing ? "إغلاق" : "تعديل"}
              </button>
            </div>

            {editing && (
              <form action={updateProfile} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="display_name" className="mb-1 block text-sm font-medium text-gray-700">
                    الاسم الظاهر
                  </label>
                  <input
                    id="display_name"
                    name="display_name"
                    type="text"
                    defaultValue={profile.display_name || ""}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="اسمك الظاهر"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="mb-1 block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={6}
                    defaultValue={profile.bio || ""}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="اكتب نبذة قصيرة عنك..."
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                  >
                    حفظ التغييرات
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>

      {previewOpen && previewUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900">معاينة الصورة</h3>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                ×
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl bg-gray-100">
              <img src={previewUrl} alt="معاينة الصورة" className="max-h-[70vh] w-full object-contain" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                إغلاق
              </button>
              <button
                type="button"
                onClick={handleUploadAvatar}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                رفع الصورة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
