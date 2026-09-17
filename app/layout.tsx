import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Balkan Rehberim | Yolculuk burada başlar",
  description:
    "Balkan Rehberim pilotu: Arnavutluk ve Karadağ'da çiftler için kiralık araçla 4–6 günlük seyahat planlama.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
