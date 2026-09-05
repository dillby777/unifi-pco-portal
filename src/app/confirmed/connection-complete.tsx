"use client";

import { useEffect } from "react";

type ConnectionCompleteProps = {
  destination: string;
};

export function ConnectionComplete({ destination }: ConnectionCompleteProps) {
  useEffect(() => {
    const redirectTimer = window.setTimeout(() => {
      window.location.assign(destination);
    }, 1400);

    return () => window.clearTimeout(redirectTimer);
  }, [destination]);

  return (
    <a className="button button-primary" href={destination}>
      Connected! Taking you back...
    </a>
  );
}