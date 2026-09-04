"use client";

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

  return (
    <div className="portal-actions">
      <button
        className="button button-primary"
        type="button"
        onClick={() => recordAction("guest-access")}
        disabled={isSubmitting !== null}
      >
        {isSubmitting === "guest-access" ? "Connecting..." : "I&apos;m just here for the internet"}
      </button>
      <div className="action-divider" aria-hidden="true">or</div>
      <button
        className="button button-pco"
        type="button"
        onClick={() => recordAction("planning-center-login")}
        disabled={isSubmitting !== null}
      >
        <span className="pco-mark" aria-hidden="true">pco</span>
        {isSubmitting === "planning-center-login" ? "Opening Planning Center..." : "Log in with Planning Center"}
      </button>
    </div>
  );
}