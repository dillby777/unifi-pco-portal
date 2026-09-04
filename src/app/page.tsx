import Image from "next/image";
import { PortalActions } from "./portal-actions";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  requestedPathname?: string;
};

export default async function HomePage({ searchParams, requestedPathname = "/" }: HomePageProps) {
  const parameters = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(parameters)) {
    if (typeof value === "string") {
      query.set(key, value);
    }
  }

  const requestedPath = query.size > 0 ? `${requestedPathname}?${query.toString()}` : requestedPathname;
  console.info("[portal:request]", { requestedPath });

  return (
    <main className="portal-shell">
      <section className="portal-card" aria-labelledby="portal-title">
        <Image
          className="portal-logo"
          src="/lemc-main-colors.png"
          alt="LEMC"
          width={174}
          height={174}
          priority
        />
        <div className="portal-heading">
          <p className="eyebrow">Guest network</p>
          <h1 id="portal-title">Welcome to &quot;LEMC&apos;s WiFi&quot;</h1>
          <p className="lede">Choose how you&apos;d like to get connected.</p>
        </div>
        <PortalActions redirectContext={query.toString()} />
      </section>
      <p className="portal-footer">LEMC guest access</p>
    </main>
  );
}