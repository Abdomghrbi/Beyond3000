"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CoverUploader({ onUpload }: { onUpload: (url: string | null) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("الرجاء اختيار ملف صورة");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setUploading(true);
    try {
      const croppedBlob = await cropToAspect(file, 18 / 9);
      const url = await uploadToSupabase(croppedBlob);
      onUpload(url);
    } catch (err) {
      alert("فشل رفع الصورة");
      console.error(err);
      onUpload(null);
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const handleRemove = () => {
    setPreview(null);
    onUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        صورة الغلاف <span className="text-gray-400 font-normal">(اختياري — نسبة 18:9)</span>
      </label>

      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-[18/9] bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
        >
          <div className="text-center">
            <p className="text-3xl mb-1">📷</p>
            <p className="text-sm text-gray-500">اضغط لاختيار صورة</p>
          </div>
        </div>
      ) : (
        <div className="relative w-full aspect-[18/9] rounded-xl overflow-hidden border border-gray-200">
          <img src={preview} alt="معاينة" className="w-full h-full object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <p className="text-white text-sm">جاري الرفع...</p>
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg hover:bg-red-600 transition"
          >
            ✕ إزالة
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

function cropToAspect(file: File, aspect: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      const currentAspect = width / height;

      let cropWidth: number, cropHeight: number, startX: number, startY: number;

      if (currentAspect > aspect) {
      
        cropHeight = height;
        cropWidth = height * aspect;
        startX = (width - cropWidth) / 2;
        startY = 0;
      } else {
      
        cropWidth = width;
        cropHeight = width / aspect;
        startX = 0;
        startY = (height - cropHeight) / 2;
      }

      canvas.width = Math.round(cropWidth);
      canvas.height = Math.round(cropHeight);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, startX, startY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas to blob failed"));
      }, "image/jpeg", 0.9);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });

async function uploadToSupabase(blob: Blob): Promise<string> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("يجب تسجيل الدخول");

  const fileName = `${user.id}/${Date.now()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("covers")
    .upload(fileName, blob, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from("covers")
    .getPublicUrl(fileName);

  return publicUrl;
        }
