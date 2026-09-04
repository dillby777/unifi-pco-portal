import Image from "next/image";
import Link from "next/link";

export default function ConfirmedPage() {
  return (
    <main className="portal-shell">
      <section className="portal-card confirmation-card" aria-labelledby="confirmation-title">
        <Image className="portal-logo" src="/lemc-main-colors.png" alt="LEMC" width={174} height={174} priority />
        <div className="confirmation-symbol" aria-hidden="true">✓</div>
        <div className="portal-heading">
          <p className="eyebrow">You&apos;re all set</p>
          <h1 id="confirmation-title">You&apos;re connected.</h1>
          <p className="lede">Enjoy the internet. This page will also welcome you after Planning Center sign-in.</p>
        </div>
        <Link className="button button-primary" href="/">
          Back to welcome
        </Link>
      </section>
      <p className="portal-footer">LEMC guest access</p>
    </main>
  );
}