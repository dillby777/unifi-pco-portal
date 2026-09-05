"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PortalActionsProps = {
  redirectContext: string;
};

type PortalAction = "guest-access" | "planning-center-login";

export function PortalActions({ redirectContext }: PortalActionsProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<PortalAction | null>(null);

  async function recordAction(action: PortalAction) {
    console.info("[portal:action]", { action, redirectContext });
    setIsSubmitting(action);

    try {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, redirectContext }),
      });
    } catch (error) {
      console.error("[portal:event-error]", error);
    }

    const contextSuffix = redirectContext ? `?${redirectContext}` : "";
    router.push(action === "guest-access" ? `/confirmed${contextSuffix}` : `/login${contextSuffix}`);
  }

  async function authorizeGuestAccess() {
    const clientMacAddress = new URLSearchParams(redirectContext).get("id");

    if (!clientMacAddress) {
      console.error("[unifi:guest-authorization-error]", "Missing UniFi client MAC address.");
      return;
    }

    setIsSubmitting("guest-access");

    try {
      const response = await fetch("/api/unifi/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientMacAddress }),
      });
      const result = await response.json() as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to authorize guest access.");
      }

      await recordAction("guest-access");
    } catch (error) {
      setIsSubmitting(null);
      console.error("[unifi:guest-authorization-error]", error);
    }
  }

  return (
    <div className="portal-actions">
      <button
        className="button button-primary"
        type="button"
        onClick={authorizeGuestAccess}
        disabled={isSubmitting !== null}
      >
        {isSubmitting === "guest-access" ? "Connecting..." : "I'm just here for the internet"}
      </button>
      <div className="action-divider" aria-hidden="true">or</div>
      <button
        className="button button-pco"
        type="button"
        onClick={() => recordAction("planning-center-login")}
        disabled={isSubmitting !== null}
      >
        {isSubmitting === "planning-center-login" ? (
          "Opening Planning Center..."
        ) : (
          <span className="planning-center-logo-set">
            <Image
              className="planning-center-logo planning-center-logo-default"
              src="/planning-center-white.svg"
              alt="Log in with Planning Center"
              width={501}
              height={73}
            />
            <Image
              className="planning-center-logo planning-center-logo-hover"
              src="/planning-center-black.svg"
              alt=""
              width={501}
              height={73}
            />
          </span>
        )}
      </button>
    </div>
  );
}