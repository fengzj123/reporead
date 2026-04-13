import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoRead - AI GitHub Repository Analyzer",
  description: "One click to understand any GitHub repo. Get instant AI-powered analysis of any public GitHub repository including tech stack, key features, how to run, and common pitfalls.",
  keywords: ["GitHub", "repository analyzer", "AI", "code analysis", "developer tools", "open source", "README analyzer"],
  authors: [{ name: "RepoRead" }],
  openGraph: {
    title: "RepoRead - AI GitHub Repository Analyzer",
    description: "One click to understand any GitHub repo",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RepoRead - AI GitHub Repository Analyzer",
    description: "One click to understand any GitHub repo",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%238B5CF6' width='100' height='100' rx='20'/><text y='.9em' x='50%' text-anchor='middle' font-size='70'>R</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
