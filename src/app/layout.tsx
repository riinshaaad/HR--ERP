import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "HRX — Human-Centered HR Platform",
  description: "A calm, intelligent HR Management ERP that simplifies workforce operations while making performance visible, fair, and actionable.",
  keywords: ["HR", "ERP", "People Platform", "Performance Management", "Payroll", "Leave Management"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
