import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SiteChat } from "@/components/chat/site-chat";
import { JsonLd } from "@/components/seo/json-ld";
import { personSchema, websiteSchema } from "@/lib/schema";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// metadataBase anchors every relative URL in this metadata object (OG images,
// icons, and any per-page `alternates.canonical` that doesn't specify a full
// origin) to an absolute one. Without it, Next.js falls back to localhost in
// dev and warns at build time — and social crawlers can silently fail to
// resolve the share image.
const SITE_URL = "https://pranavsrivastava.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pranav Srivastava — Building together",
    template: "%s · Pranav Srivastava",
  },
  // Kept under ~160 characters so it doesn't get truncated in a search snippet.
  description:
    "Pranav Srivastava — a product thinkengineer in the Netherlands, 15 years building software, now deep in applied AI. Hands-on labs, courses, and essays.",
  keywords: [
    "applied AI",
    "AI agents",
    "MCP",
    "RAG",
    "production AI",
    "AI labs",
    "Pranav Srivastava",
  ],
  authors: [{ name: "Pranav Srivastava", url: SITE_URL }],
  creator: "Pranav Srivastava",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Pranav Srivastava",
    title: "Pranav Srivastava — Building together",
    description:
      "Hands-on labs, courses, and writing on building AI systems that hold up in production — from someone who does it at scale.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranav Srivastava — Building together",
    description:
      "Hands-on labs, courses, and writing on building AI systems that hold up in production.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased">
        {/* Site-wide identity — one Person + WebSite graph every other
            page's structured data (Article, Course) refers back to by @id,
            rather than repeating the author's details on every page. */}
        <JsonLd data={personSchema()} />
        <JsonLd data={websiteSchema()} />
        {/*
          ThemeProvider from next-themes:
          - attribute="class" → writes class="dark" on <html>
          - defaultTheme="system" → respects OS preference on first visit
          - enableSystem → allows switching based on OS
          - disableTransitionOnChange → avoids flash when toggling theme
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <SiteChat />
        </ThemeProvider>
      </body>
    </html>
  );
}
