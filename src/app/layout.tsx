import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import {
  organizationSchema,
  StructuredData,
  webApplicationSchema,
  websiteSchema,
} from "@/components/structured-data";
import { ThemeProvider } from "@/components/theme-provider";
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
  title: "State Of The Art - Discover the Best Tech Implementations",
  description:
    "Community-driven platform to discover, vote on, and discuss the state-of-the-art implementations across different technology categories.",
  keywords: [
    "tech implementations",
    "developer tools",
    "best practices",
    "community voting",
    "state-of-the-art",
    "authentication",
    "database ORM",
    "build tools",
    "CSS frameworks",
    "testing tools",
  ],
  authors: [{ name: "State Of The Art Community" }],
  creator: "State Of The Art",
  publisher: "State Of The Art",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://stateofart.dev"),
  openGraph: {
    title: "State Of The Art - Discover the Best Tech Implementations",
    description:
      "Community-driven platform to discover, vote on, and discuss the state-of-the-art implementations across different technology categories.",
    url: "https://stateofart.dev",
    siteName: "State Of The Art",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "State Of The Art - Discover the Best Tech Implementations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "State Of The Art - Discover the Best Tech Implementations",
    description:
      "Community-driven platform to discover, vote on, and discuss the state-of-the-art implementations across different technology categories.",
    images: ["/og-image.png"],
    creator: "@stateofart",
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <StructuredData data={organizationSchema} />
            <StructuredData data={websiteSchema} />
            <StructuredData data={webApplicationSchema} />
            <QueryProvider>{children}</QueryProvider>
            <Toaster position="bottom-right" expand={true} richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
