import { NextResponse } from "next/server";

const validActions = new Set(["guest-access", "planning-center-login"]);

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);

  if (
    !body ||
    typeof body !== "object" ||
    !("action" in body) ||
    typeof body.action !== "string" ||
    !validActions.has(body.action)
  ) {
    return NextResponse.json({ error: "Invalid portal event." }, { status: 400 });
  }

  const redirectContext = "redirectContext" in body && typeof body.redirectContext === "string"
    ? body.redirectContext
    : "";

  if (process.env.NODE_ENV === "development") {
    console.info("[portal:action]", { action: body.action, redirectContext });
  }
  return NextResponse.json({ recorded: true });
}