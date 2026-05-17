import type { Work } from "@/lib/types";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ProductJsonLdProps {
  work: Work;
}

export function ProductJsonLd({ work }: ProductJsonLdProps) {
  // 最安価格を計算
  const dlsiteFinalPrice =
    work.priceDlsite && work.discountRateDlsite
      ? Math.round(work.priceDlsite * (1 - work.discountRateDlsite / 100))
      : work.priceDlsite;
  const fanzaFinalPrice =
    work.priceFanza && work.discountRateFanza
      ? Math.round(work.priceFanza * (1 - work.discountRateFanza / 100))
      : work.priceFanza;

  const lowestPrice = Math.min(
    ...[dlsiteFinalPrice, fanzaFinalPrice].filter((p): p is number => p !== null)
  );

  // 評価情報
  const rating = work.ratingDlsite || work.ratingFanza;
  const reviewCount = work.reviewCountDlsite || work.reviewCountFanza;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: work.title,
    description: work.aiSummary || work.aiRecommendReason || `${work.title}の詳細ページ`,
    image: work.thumbnailUrl || work.sampleImages[0],
    brand: work.circleName
      ? {
          "@type": "Brand",
          name: work.circleName,
        }
      : undefined,
    category: work.category || "デジタルコンテンツ",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "JPY",
      lowPrice: lowestPrice || 0,
      highPrice: Math.max(work.priceDlsite || 0, work.priceFanza || 0),
      offerCount: [work.priceDlsite, work.priceFanza].filter(Boolean).length || 1,
      availability: "https://schema.org/InStock",
    },
    ...(rating &&
      reviewCount && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: rating.toFixed(1),
          bestRating: "5",
          worstRating: "1",
          reviewCount: reviewCount,
        },
      }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ReviewJsonLd({ work }: ProductJsonLdProps) {
  const reviewBody = work.aiReview || work.aiAppealPoints || work.aiSummary;

  if (!reviewBody) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: work.title,
      ...(work.thumbnailUrl && { image: work.thumbnailUrl }),
    },
    author: {
      "@type": "Organization",
      name: "みみぱら",
    },
    reviewBody: reviewBody,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
  baseUrl?: string;
}

export function BreadcrumbJsonLd({
  items,
  baseUrl = "https://bl-mimipara.com",
}: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${baseUrl}${item.href}` : undefined,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// =============================================================================
// Organization JSON-LD
// =============================================================================
export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BL耳パラ",
    alternateName: "BL耳パラ編集部",
    url: "https://bl-mimipara.com",
    description:
      "BL同人ASMR・BL同人音声の厳選レビューサイト。声優・サークル・シチュエーション別の人気作品・セール情報をAIによる分析と人手の編集で整理してお届けします。",
    sameAs: [
      "https://x.com/bl_mimipara",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// =============================================================================
// WebSite JSON-LD
// =============================================================================
export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BL耳パラ",
    alternateName: "BL耳パラ | BL同人ASMR・BL同人音声の厳選レビューサイト",
    url: "https://bl-mimipara.com",
    inLanguage: "ja",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://bl-mimipara.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// =============================================================================
// Person JSON-LD（声優ページ）
// =============================================================================
interface PersonJsonLdProps {
  name: string;
  workCount: number;
  avgRating?: number | null;
  thumbnailUrl?: string | null;
  pageUrl: string;
}

export function PersonJsonLd({
  name,
  workCount,
  avgRating,
  thumbnailUrl,
  pageUrl,
}: PersonJsonLdProps) {
  const description = `BL同人ASMR・BL同人音声に出演する声優「${name}」の出演作品${workCount}件をまとめたページ。レビュー・評価・人気作・セール情報をBL耳パラ編集部が整理しています。`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: pageUrl,
    description,
    jobTitle: "声優",
    knowsAbout: ["BL ASMR", "BL同人音声"],
  };

  if (thumbnailUrl) {
    jsonLd.image = thumbnailUrl;
  }

  if (avgRating && avgRating > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(2),
      reviewCount: workCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// =============================================================================
// Circle (Organization) JSON-LD
// =============================================================================
interface CircleOrganizationJsonLdProps {
  name: string;
  workCount: number;
  mainGenre?: string | null;
  pageUrl: string;
}

export function CircleOrganizationJsonLd({
  name,
  workCount,
  mainGenre,
  pageUrl,
}: CircleOrganizationJsonLdProps) {
  const genreText = mainGenre ? `（${mainGenre}）` : "";
  const description = `同人サークル「${name}」${genreText}の作品${workCount}件をまとめたページ。代表作・人気作・セール情報をBL耳パラ編集部が整理しています。`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: pageUrl,
    description,
    additionalType: "https://schema.org/CreativeWork",
  };

  if (mainGenre) {
    jsonLd.knowsAbout = [mainGenre, "BL同人作品"];
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
