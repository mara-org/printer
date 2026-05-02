import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PaperLens — Understand any document",
  description:
    "Snap any contract, lease, insurance policy, or medical bill. Get a plain-language explanation in your language, with risks flagged.",
  openGraph: {
    title: "PaperLens — Understand any document",
    description:
      "Plain-language explanations of contracts, leases, insurance, and medical paperwork. In 20+ languages.",
    type: "website",
  },
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: { locale?: string };
}) {
  return (
    <html lang={params?.locale ?? "en"}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
