import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Zen_Maru_Gothic, Noto_Sans_JP } from "next/font/google";
import { MobileNav } from "@/components/mobile-nav";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/json-ld";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-9PKG6F285S";

const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bl-mimipara.com"),
  title: {
    default: "みみぱら | BL ASMR＆ゲームまとめ",
    template: "%s | みみぱら",
  },
  description:
    "BL向けASMR・ゲームの厳選作品を紹介。評価・ランキング・セール情報もまとめてチェック。",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-256.png", type: "image/png", sizes: "256x256" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${zenMaruGothic.variable} ${notoSansJP.variable} font-body antialiased`}
      >
        {/* サイト全体の構造化データ */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        {children}
        <Suspense>
          <MobileNav />
        </Suspense>
      </body>
    </html>
  );
}
