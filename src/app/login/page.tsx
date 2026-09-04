import Image from "next/image";
import Link from "next/link";

export default function PlanningCenterLoginPage() {
  console.info("[portal:planning-center]", { status: "oidc-placeholder-reached" });

  return (
    <main className="portal-shell">
      <section className="portal-card confirmation-card" aria-labelledby="login-title">
        <Image className="portal-logo" src="/lemc-main-colors.png" alt="LEMC" width={174} height={174} priority />
        <div className="portal-heading">
          <p className="eyebrow">Planning Center</p>
          <h1 id="login-title">Sign-in is coming next.</h1>
          <p className="lede">This route will start Planning Center OpenID Connect, then return you to the connection confirmation.</p>
        </div>
        <Link className="button button-pco" href="/confirmed">
          Continue to preview
        </Link>
      </section>
      <p className="portal-footer">LEMC guest access</p>
    </main>
  );
}