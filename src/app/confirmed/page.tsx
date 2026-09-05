import Image from "next/image";
import { portalTheme } from "../../lib/portal-config";
import { ConnectionComplete } from "./connection-complete";

type ConfirmedPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function safeDestination(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    return "/";
  }

  try {
    const destination = new URL(value);
    return destination.protocol === "http:" || destination.protocol === "https:" ? destination.toString() : "/";
  } catch {
    return "/";
  }
}

export default async function ConfirmedPage({ searchParams }: ConfirmedPageProps) {
  const parameters = await searchParams;
  const destination = safeDestination(parameters.url);

  return (
    <main className="portal-shell">
      <section className="portal-card confirmation-card" aria-labelledby="confirmation-title">
        <Image className="portal-logo" src={portalTheme.logoPath} alt="LEMC" width={174} height={174} priority />
        <div className="confirmation-symbol" aria-hidden="true">✓</div>
        <div className="portal-heading">
          <p className="eyebrow">You&apos;re all set</p>
          <h1 id="confirmation-title">You&apos;re connected.</h1>
          <p className="lede">You&apos;ll continue online in a moment.</p>
        </div>
        <ConnectionComplete destination={destination} />
      </section>
      <p className="portal-footer">LEMC guest access</p>
    </main>
  );
}