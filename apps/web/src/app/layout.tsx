import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
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
    default: "Pranav Srivastava — AI, Cloud & API Architect",
    template: "%s · Pranav Srivastava",
  },
  description:
    "AI, Cloud & API Architect. Builder of Qubitsy and Wynoot. Public workshop: portfolio, AI lab, second brain, courses, and live experiments.",
  keywords: [
    "AI architect",
    "cloud engineer",
    "API platform",
    "LangGraph",
    "MCP",
    "agentic systems",
    "Qubitsy",
  ],
  authors: [{ name: "Pranav Srivastava" }],
  creator: "Pranav Srivastava",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pranavsrivastava.com",
    siteName: "Pranav Srivastava",
    title: "Pranav Srivastava — AI, Cloud & API Architect",
    description:
      "Building practical AI, cloud and API systems — and documenting the journey from idea to working product.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranav Srivastava — AI, Cloud & API Architect",
    description:
      "Building practical AI, cloud and API systems — and documenting the journey from idea to working product.",
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
        </ThemeProvider>
      </body>
    </html>
  );
}
