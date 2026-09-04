# LEMC UniFi / Planning Center Portal

Phase one is a local guest WiFi portal prototype. It presents a guest-access option and a Planning Center entry point, then records development events before navigating to the respective preview route.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. To simulate a UniFi redirect, add any query parameters, for example:

```text
http://localhost:3000/?id=guest-device&ap=example-ap
```

The development server logs the incoming request path and query string. Clicking either option logs the event in both the browser console and the development-server terminal.

## Logo asset

The current logo is served from `public/lemc-main-colors.png`, a copy of the supplied `Assets/LEMC Main_Colors.png`. Replace that public file with a future logo while retaining its filename, or update the image references in `src/app`.

## Current scope

This initial UI does not yet authenticate with Planning Center or authorize a guest client in UniFi. The Planning Center route is intentionally a placeholder that will later start the OpenID Connect flow and return to the shared confirmation page.
