import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SiteChat } from "@/components/chat/site-chat";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Pranav Srivastava — Building together",
    template: "%s · Pranav Srivastava",
  },
  description:
    "Product thinkengineer in the Netherlands. Fifteen years building software at scale, now deep in applied AI. Hands-on labs, courses, and writing on building AI systems that hold up in production.",
  keywords: [
    "applied AI",
    "AI agents",
    "MCP",
    "RAG",
    "production AI",
    "AI labs",
    "Pranav Srivastava",
  ],
  authors: [{ name: "Pranav Srivastava" }],
  creator: "Pranav Srivastava",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pranavsrivastava.com",
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
