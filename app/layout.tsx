import type { Metadata } from "next";
import "./globals.css";
import FileManager from "../components/FileManager";

let title = "Gemini Coder – AI Code Generator";
let description = "Generate your next app with Gemini";
let url = "https://llamacoder.io/";
let ogimage = "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg";
let sitename = "geminicoder.io";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <div className="flex h-full">
          <FileManager />
          <div className="flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
