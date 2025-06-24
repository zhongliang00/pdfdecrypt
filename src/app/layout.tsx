import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "PDF Decryptor",
  description: "Decrypt password-protected PDF files in your browser using WebAssembly (qpdf)",
  keywords: ["PDF", "decrypt", "qpdf", "WebAssembly", "browser", "password"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "PDF Decryptor",
    description: "Decrypt password-protected PDF files in your browser using WebAssembly (qpdf)",
    url: "https://zhongliang00.github.io/pdfdecrypt/",
    siteName: "PDF Decryptor",
    images: [
      {
        url: "/pdfdecrypt/favicon.ico",
        width: 32,
        height: 32,
        alt: "PDF Decryptor Icon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
