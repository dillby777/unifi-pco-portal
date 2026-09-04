import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LEMC Guest WiFi",
  description: "Guest WiFi access portal for LEMC.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}