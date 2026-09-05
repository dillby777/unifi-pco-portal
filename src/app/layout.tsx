import type { Metadata } from "next";
import "./globals.css";
import { portalTheme } from "../lib/portal-config";

export const metadata: Metadata = {
  title: "LEMC Guest WiFi",
  description: "Guest WiFi access portal for LEMC.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const themeVariables = {
    "--forest-deep": portalTheme.background,
    "--background-accent": portalTheme.backgroundAccent,
    "--mist": portalTheme.card,
    "--ink": portalTheme.text,
    "--forest": portalTheme.primary,
    "--primary-hover": portalTheme.primaryHover,
    "--pco": portalTheme.planningCenter,
    "--pco-hover": portalTheme.planningCenterHover,
    "--portal-font": portalTheme.fontFamily,
    "--portal-accent-logo": `url("${portalTheme.accentLogoPath}")`,
  } as React.CSSProperties;

  return (
    <html lang="en">
      <head>
        {portalTheme.googleFontStylesheet && (
          <link rel="stylesheet" href={portalTheme.googleFontStylesheet} />
        )}
      </head>
      <body data-portal-accent={portalTheme.accentMode} style={themeVariables}>{children}</body>
    </html>
  );
}