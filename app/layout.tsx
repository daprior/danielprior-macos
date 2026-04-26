import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://macos.maenababneh.dev"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Maen Ababneh | Full Stack Web Developer",
    template: "%s | Maen Ababneh",
  },
  description:
    "A clear macOS-style portfolio for Maen Ababneh with project highlights, services, and an easy way to book a call.",
  keywords: [
    "Maen Ababneh",
    "معن عبابنة",
    "Web Developer",
    "Software Engineer",
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "GSAP",
    "Jordan Developer",
    "macOS Portfolio",
  ],
  authors: [{ name: "Maen Ababneh", url: "https://macos.maenababneh.dev" }],
  creator: "Maen Ababneh",
  // إعدادات بطاقات المشاركة (عند إرسال الرابط في وسائل التواصل)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://macos.maenababneh.dev",
    title: "Maen Ababneh | Creative Web Developer",
    description:
      "A clear macOS-style portfolio for Maen Ababneh with project highlights, services, and an easy way to book a call.",
    siteName: "Maen Ababneh Portfolio",
    images: [
      {
        url: "https://res.cloudinary.com/djy5oyivn/image/upload/q_auto/f_auto/v1775839278/macos-demo_ajjcda.png",
        width: 1200,
        height: 630,
        alt: "Maen Ababneh Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maen Ababneh | Creative Web Developer",
    description:
      "A clear macOS-style portfolio for Maen Ababneh with project highlights, services, and an easy way to book a call.",
    images: [
      "https://res.cloudinary.com/djy5oyivn/image/upload/q_auto/f_auto/v1775839278/macos-demo_ajjcda.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Maen Ababneh Portfolio",
        url: "https://macos.maenababneh.dev",
      },
      {
        "@type": "Person",
        name: "Maen Ababneh",
        alternateName: "معن عبابنة",
        jobTitle: "Full Stack Web Developer",
        url: "https://macos.maenababneh.dev",
        email: "mailto:hi@maenababneh.dev",
        sameAs: [
          "https://github.com/maenababneh",
          "https://www.linkedin.com/in/maenababneh/",
          "https://www.youtube.com/@thecompasstech",
          "https://maenababneh.dev",
        ],
      },
    ],
  } as const;

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
