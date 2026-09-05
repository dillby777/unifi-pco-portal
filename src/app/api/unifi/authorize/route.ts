import { NextResponse } from "next/server";
import { authorizeGuestClient } from "../../../../lib/unifi";

function isMacAddress(value: string) {
  return /^([0-9a-f]{2}:){5}[0-9a-f]{2}$/i.test(value);
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const clientMacAddress = body && typeof body === "object" && "clientMacAddress" in body && typeof body.clientMacAddress === "string"
    ? body.clientMacAddress
    : "";

  if (!isMacAddress(clientMacAddress)) {
    return NextResponse.json({ error: "A valid connecting-device MAC address is required." }, { status: 400 });
  }

  try {
    await authorizeGuestClient(clientMacAddress);
    console.info("[unifi:guest-authorized]");
    return NextResponse.json({ authorized: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to authorize the connecting device.";
    console.error("[unifi:guest-authorization-error]", { message });
    return NextResponse.json({ error: message }, { status: 502 });
  }
}