import { readFileSync } from "node:fs";
import { Agent } from "undici";
import { portalConnectionConfig } from "./portal-config";

type ConnectedClient = {
  id: string;
  macAddress?: string;
};

type ConnectedClientsResponse = {
  data?: ConnectedClient[];
};

function integrationPath(path: string) {
  const { allowInsecureConnection, apiKey, apiUrl } = portalConnectionConfig.unifi;

  if (!apiKey || !apiUrl) {
    throw new Error("UniFi is not configured. Set UNIFI_API_URL and UNIFI_API_KEY.");
  }

  let controllerUrl: URL;

  try {
    controllerUrl = new URL(apiUrl);
  } catch {
    throw new Error("UNIFI_API_URL must be a complete HTTPS URL, for example https://192.168.0.1.");
  }

  if (controllerUrl.protocol !== "https:" && !allowInsecureConnection) {
    throw new Error("UNIFI_API_URL must use HTTPS. For local testing only, set UNIFI_ALLOW_INSECURE_CONNECTION=true to allow HTTP.");
  }

  return `${controllerUrl.origin}/proxy/network/integration${path}`;
}

async function unifiRequest(path: string, options: RequestInit = {}) {
  const dispatcher = unifiDispatcher();
  let response: Response;

  try {
    response = await fetch(integrationPath(path), {
      ...options,
      headers: {
        Accept: "application/json",
        "X-API-Key": portalConnectionConfig.unifi.apiKey!,
        ...options.headers,
      },
      cache: "no-store",
      ...(dispatcher ? { dispatcher } : {}),
    } as RequestInit);
  } catch (error) {
    const code = error instanceof TypeError && error.cause && typeof error.cause === "object" && "code" in error.cause
      ? error.cause.code
      : undefined;

    if (code === "DEPTH_ZERO_SELF_SIGNED_CERT" && !portalConnectionConfig.unifi.caCertificatePath) {
      throw new Error("UniFi uses a self-signed certificate. Export its PEM certificate and set UNIFI_CA_CERT_PATH.");
    }

    throw new Error("Unable to connect to UniFi. Check UNIFI_API_URL, network reachability, and its HTTPS certificate.");
  }

  if (!response.ok) {
    throw new Error(`UniFi request failed with status ${response.status}.`);
  }

  return response;
}

function unifiDispatcher() {
  const { allowInsecureConnection, caCertificatePath } = portalConnectionConfig.unifi;

  if (!caCertificatePath && !allowInsecureConnection) {
    return undefined;
  }

  try {
    return new Agent({
      connect: {
        ...(caCertificatePath ? { ca: readFileSync(caCertificatePath, "utf8") } : {}),
        ...(allowInsecureConnection ? { rejectUnauthorized: false } : {}),
      },
    });
  } catch {
    throw new Error("Unable to read UNIFI_CA_CERT_PATH. Provide the path to a PEM certificate file.");
  }
}

export async function authorizeGuestClient(macAddress: string) {
  const { siteId, guestAccessMinutes } = portalConnectionConfig.unifi;

  if (!siteId) {
    throw new Error("UniFi is not configured. Set UNIFI_SITE_ID.");
  }

  const normalizedMacAddress = macAddress.toLowerCase();
  const filter = `macAddress.eq('${normalizedMacAddress}')`;
  const clientsUrl = `/v1/sites/${encodeURIComponent(siteId)}/clients?limit=1&filter=${encodeURIComponent(filter)}`;
  const clientsResponse = await unifiRequest(clientsUrl);
  const clients = (await clientsResponse.json()) as ConnectedClientsResponse;
  const client = clients.data?.find((candidate) => candidate.macAddress?.toLowerCase() === normalizedMacAddress);

  if (!client) {
    throw new Error("The connecting device was not found in UniFi. Reconnect to the guest WiFi and try again.");
  }

  const authorizationResponse = await unifiRequest(
    `/v1/sites/${encodeURIComponent(siteId)}/clients/${encodeURIComponent(client.id)}/actions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "AUTHORIZE_GUEST_ACCESS",
        ...(guestAccessMinutes ? { timeLimitMinutes: guestAccessMinutes } : {}),
      }),
    },
  );

  return authorizationResponse.json();
}