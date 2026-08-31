const AVATAR_BUCKET = "avatars";

export function resolveAvatarUrl(avatarUrl?: string | null): string | null {
  if (!avatarUrl) return null;

  if (/^https?:\/\//i.test(avatarUrl) || avatarUrl.startsWith("data:")) {
    return avatarUrl;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return avatarUrl;

  const path = avatarUrl.replace(/^\/+/, "");
  return `${supabaseUrl}/storage/v1/object/public/${AVATAR_BUCKET}/${encodeURI(path)}`;
}

export function extractAvatarStoragePath(avatarUrl?: string | null): string | null {
  if (!avatarUrl) return null;

  const clean = avatarUrl.trim();
  if (!clean) return null;

  if (clean.startsWith("data:")) return null;

  if (/^https?:\/\//i.test(clean)) {
    try {
      const url = new URL(clean);
      const marker = `/storage/v1/object/public/${AVATAR_BUCKET}/`;
      const markerIndex = url.pathname.indexOf(marker);
      if (markerIndex !== -1) {
        return decodeURIComponent(url.pathname.slice(markerIndex + marker.length).replace(/^\/+/, ""));
      }

      const segments = url.pathname.split("/").filter(Boolean);
      const bucketIndex = segments.indexOf(AVATAR_BUCKET);
      if (bucketIndex !== -1 && bucketIndex < segments.length - 1) {
        return decodeURIComponent(segments.slice(bucketIndex + 1).join("/"));
      }
    } catch {
      return null;
    }
  }

  return clean.replace(/^\/+/, "");
}

export function getAvatarBucketName() {
  return AVATAR_BUCKET;
}
