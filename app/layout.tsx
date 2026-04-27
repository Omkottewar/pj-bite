import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Providers } from "@/components/Providers";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import ScrollToTop from "@/components/ui/ScrollToTop";
import ScrollUpButton from "@/components/ui/ScrollUpButton";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.pjbite.com'),
  title: "PJ Bite | Nature's Nutrition in Every Bite | 100% Natural",
  description: "Premium selection of 100% natural dried fruits and healthy snacks. No added sugar, no preservatives, packed with vitamins and goodness. Shop farm-direct now.",
  keywords: ["PJ Bite", "dried fruits", "healthy snacks", "natural dried fruits", "no added sugar", "premium dry fruits", "flax seed snacks", "farm direct"],
  openGraph: {
    title: "PJ Bite | 100% Natural Dried Fruits & Snacks",
    description: "Premium selection of 100% natural dried fruits. No added sugar, no preservatives. Direct from farms to your table.",
    url: "https://www.pjbite.com",
    siteName: "PJ Bite",
    images: [
      {
        url: "/pjbite-logo.svg", // Fallback to logo or you can create a specific 1200x630 OG image later
        width: 1200,
        height: 630,
        alt: "PJ Bite - Nature's Nutrition in Every Bite",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PJ Bite | Nature's Nutrition in Every Bite",
    description: "Premium selection of 100% natural dried fruits and healthy snacks. No added sugar, no preservatives.",
    images: ["/pjbite-logo.svg"], // Preferably use absolute URLs or next/image paths
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-TRACKING-ID" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TRACKING-ID');
          `}
        </Script>
      </head>

      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-screen flex flex-col bg-brand-bg text-brand-text`}>
        <NextTopLoader 
          color="#1E5C2A"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #1E5C2A,0 0 5px #1E5C2A"
          zIndex={1600}
        />
        <ScrollToTop />
        <ScrollUpButton />
        <Providers session={session}>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
