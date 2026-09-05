type PortalTheme = {
  background: string;
  backgroundAccent: string;
  card: string;
  text: string;
  primary: string;
  primaryHover: string;
  planningCenter: string;
  planningCenterHover: string;
  fontFamily: string;
  googleFontStylesheet: string | undefined;
  logoPath: string;
  accentMode: "circle" | "logo";
  accentLogoPath: string;
};

const defaultGoogleFontStylesheet =
  "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Raleway:wght@400;500;600;700&display=swap";

function configuredValue(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

function googleFontStylesheet(value: string | undefined) {
  if (!value) {
    return defaultGoogleFontStylesheet;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "fonts.googleapis.com" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function accentMode(value: string | undefined): "circle" | "logo" {
  return value?.trim().toLowerCase() === "logo" ? "logo" : "circle";
}

export const portalTheme: PortalTheme = {
  background: configuredValue(process.env.NEXT_PUBLIC_PORTAL_BACKGROUND, "#102a22"),
  backgroundAccent: configuredValue(process.env.NEXT_PUBLIC_PORTAL_BACKGROUND_ACCENT, "#315b4c"),
  card: configuredValue(process.env.NEXT_PUBLIC_PORTAL_CARD, "#f6f3ec"),
  text: configuredValue(process.env.NEXT_PUBLIC_PORTAL_TEXT, "#17241f"),
  primary: configuredValue(process.env.NEXT_PUBLIC_PORTAL_PRIMARY, "#1e3b32"),
  primaryHover: configuredValue(process.env.NEXT_PUBLIC_PORTAL_PRIMARY_HOVER, "#294e40"),
  planningCenter: configuredValue(process.env.NEXT_PUBLIC_PORTAL_PCO, "#2d7e9b"),
  planningCenterHover: configuredValue(process.env.NEXT_PUBLIC_PORTAL_PCO_HOVER, "#236b85"),
  fontFamily: configuredValue(process.env.NEXT_PUBLIC_PORTAL_FONT_FAMILY, 'Raleway, "Helvetica Neue", sans-serif'),
  googleFontStylesheet: googleFontStylesheet(process.env.NEXT_PUBLIC_PORTAL_GOOGLE_FONT_STYLESHEET),
  logoPath: configuredValue(process.env.NEXT_PUBLIC_PORTAL_LOGO_PATH, "/lemc-main-colors.png"),
  accentMode: accentMode(process.env.NEXT_PUBLIC_PORTAL_ACCENT_MODE),
  accentLogoPath: configuredValue(
    process.env.NEXT_PUBLIC_PORTAL_ACCENT_LOGO_PATH,
    configuredValue(process.env.NEXT_PUBLIC_PORTAL_LOGO_PATH, "/lemc-main-colors.png"),
  ),
};

export const portalConnectionConfig = {
  pco: {
    clientId: process.env.PCO_OIDC_CLIENT_ID,
    clientSecret: process.env.PCO_OIDC_CLIENT_SECRET,
    issuer: process.env.PCO_OIDC_ISSUER,
    redirectUri: process.env.PCO_OIDC_REDIRECT_URI,
  },
  unifi: {
    apiUrl: process.env.UNIFI_API_URL,
    apiKey: process.env.UNIFI_API_KEY,
    caCertificatePath: process.env.UNIFI_CA_CERT_PATH,
    allowInsecureConnection: process.env.UNIFI_ALLOW_INSECURE_CONNECTION === "true",
    siteId: process.env.UNIFI_SITE_ID,
    guestAccessMinutes: Number.parseInt(process.env.UNIFI_GUEST_ACCESS_MINUTES || "", 10) || undefined,
  },
};