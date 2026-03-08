import type { DbVoiceActorFeature, DbSeihekiFeature } from "@/lib/db";

// 統合された特集アイテムの型
export interface UnifiedFeatureItem {
  type: "voice_actor" | "seiheki";
  name: string;
  slug: string;
  headline: string | null;
  thumbnail_url: string | null;
  href: string;
}

// 声優特集を統合型に変換
export function voiceActorFeatureToUnified(feature: DbVoiceActorFeature): UnifiedFeatureItem {
  return {
    type: "voice_actor",
    name: feature.name,
    slug: feature.slug,
    headline: feature.headline,
    thumbnail_url: feature.representative_thumbnail_url,
    href: `/tokushu/cv/${encodeURIComponent(feature.name)}`,
  };
}

// 性癖特集を統合型に変換
export function seihekiFeatureToUnified(feature: DbSeihekiFeature): UnifiedFeatureItem {
  return {
    type: "seiheki",
    name: feature.name,
    slug: feature.slug,
    headline: feature.headline,
    thumbnail_url: feature.representative_thumbnail_url,
    href: `/tokushu/seiheki/${feature.slug}`,
  };
}

// 2つの配列を交互に混ぜる
export function interleaveFeatures(
  voiceActors: DbVoiceActorFeature[],
  seihekis: DbSeihekiFeature[]
): UnifiedFeatureItem[] {
  const result: UnifiedFeatureItem[] = [];
  const maxLen = Math.max(voiceActors.length, seihekis.length);

  for (let i = 0; i < maxLen; i++) {
    if (i < voiceActors.length) {
      result.push(voiceActorFeatureToUnified(voiceActors[i]));
    }
    if (i < seihekis.length) {
      result.push(seihekiFeatureToUnified(seihekis[i]));
    }
  }

  return result;
}
