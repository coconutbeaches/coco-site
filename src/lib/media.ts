import manifest from "@/content/media-manifest.json";
import approvedHeroes from "@/content/media-heroes.json";

export type MediaCategory = keyof typeof manifest.categories;

export type MediaAsset = {
  objectKey: string;
  publicUrl: string;
  category: MediaCategory;
  altText: string;
  provisional: boolean;
};

function encodeObjectKey(objectKey: string) {
  return objectKey.split("/").map(encodeURIComponent).join("/");
}

function toAsset(category: MediaCategory, objectKey: string, index: number, provisional: boolean): MediaAsset {
  return {
    objectKey,
    publicUrl: `${manifest.baseUrl}/${encodeObjectKey(objectKey)}`,
    category,
    altText: `${category.replaceAll("-", " ")} photo ${index + 1}`,
    provisional,
  };
}

export function getMediaByCategory(category: MediaCategory, limit = 12): MediaAsset[] {
  const keys = manifest.categories[category] ?? [];
  return keys.slice(0, limit).map((objectKey, index) => toAsset(category, objectKey, index, true));
}

export function getHeroMedia(category: MediaCategory) {
  const approved = (approvedHeroes as Partial<Record<MediaCategory, string>>)[category];
  if (approved) return toAsset(category, approved, 0, false);
  const fallback = manifest.categories[category]?.[0];
  return fallback ? toAsset(category, fallback, 0, true) : null;
}
