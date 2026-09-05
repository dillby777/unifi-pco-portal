# LEMC UniFi / Planning Center Portal

Phase one is a local guest WiFi portal prototype. It presents a guest-access option and a Planning Center entry point, then records development events before navigating to the respective preview route.

## Run locally

```bash
npm install
npm run dev:80
```

Open `http://localhost`. To simulate a UniFi redirect, add any query parameters, for example:

```text
http://localhost/?id=guest-device&ap=example-ap
```

The development server logs the incoming request path and query string. Clicking either option logs the event in both the browser console and the development-server terminal.

## Logo asset

The current logo is served from `public/lemc-main-colors.png`, a copy of the supplied `Assets/LEMC Main_Colors.png`. Replace that public file with a future logo while retaining its filename, or update the image references in `src/app`.

## Configuration

Copy `.env.example` to `.env.local` and change the portal's browser-safe appearance settings. Colors, font family, Google Fonts stylesheet, and logo path are configurable with `NEXT_PUBLIC_PORTAL_*` variables. A Google Fonts stylesheet URL must use `https://fonts.googleapis.com`; use the Embed code URL from Google Fonts.

Planning Center and UniFi settings use server-only variables without the `NEXT_PUBLIC_` prefix. They are reserved for the later OIDC and guest-authorization phases and are never sent to the browser. Do not commit `.env.local` or put client secrets or UniFi API keys in any `NEXT_PUBLIC_` variable.

Set `NEXT_PUBLIC_PORTAL_ACCENT_MODE=logo` to replace the upper-right circle with a subdued logo. Set it to `circle` to restore the default decoration. `NEXT_PUBLIC_PORTAL_ACCENT_LOGO_PATH` selects the public asset used for logo mode.

## UniFi guest authorization

The guest-access button calls the local UniFi Network integration API to find the device identified by the `id` MAC address in UniFi's captive-portal URL, then sends `AUTHORIZE_GUEST_ACCESS`. Set `UNIFI_API_URL` to the console's HTTPS address (for example `https://192.168.0.1`), along with `UNIFI_API_KEY` and the site's UUID in `UNIFI_SITE_ID`. `default` is the legacy site name and is not accepted by this API. Retrieve the UUID with `GET /proxy/network/integration/v1/sites`. `UNIFI_GUEST_ACCESS_MINUTES` is optional.

If the console uses a self-signed certificate, export its certificate or CA as a PEM file and set `UNIFI_CA_CERT_PATH` to its absolute path. This trusts that certificate only for the UniFi request; do not disable TLS certificate verification. Do not put API keys in browser-visible `NEXT_PUBLIC_` variables. Rotate any key that has been exposed in a terminal, chat, or source file.

For local testing only, `UNIFI_ALLOW_INSECURE_CONNECTION=true` permits an `http://` controller URL or a self-signed HTTPS certificate. It is scoped to UniFi API calls and does not alter Node's global TLS behavior. Use a trusted HTTPS certificate or `UNIFI_CA_CERT_PATH` before deployment.

## Current scope

Planning Center OpenID Connect is not yet implemented. The Planning Center route is a placeholder that will later start the OIDC flow and return to the shared confirmation page.
