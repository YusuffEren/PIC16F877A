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
  title: "PIC16F877A Dijital Saat Simülasyonu",
  description: "Gerçek zamanlı saat sisteminin web tabanlı interaktif simülasyonu. PIC16F877A, LCD ekran ve buton kontrollerini deneyimleyin.",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-slate-950`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
