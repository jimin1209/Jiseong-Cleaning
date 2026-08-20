import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "지성크리닝",
  description: "지성크리닝 데모",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
