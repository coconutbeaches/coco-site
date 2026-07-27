import manifest from "@/content/media-manifest.json";

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

export function getMediaByCategory(category: MediaCategory, limit = 12): MediaAsset[] {
  const keys = manifest.categories[category] ?? [];
  return keys.slice(0, limit).map((objectKey, index) => ({
    objectKey,
    publicUrl: `${manifest.baseUrl}/${encodeObjectKey(objectKey)}`,
    category,
    altText: `${category.replaceAll("-", " ")} photo ${index + 1}`,
    provisional: true,
  }));
}

export function getHeroMedia(category: MediaCategory) {
  return getMediaByCategory(category, 1)[0] ?? null;
}
