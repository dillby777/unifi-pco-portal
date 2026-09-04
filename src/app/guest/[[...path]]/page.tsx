import HomePage from "../../page";

type GuestPortalPageProps = {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function GuestPortalPage({ params, searchParams }: GuestPortalPageProps) {
  const { path = [] } = await params;
  const requestedPathname = `/guest/${path.join("/")}`;

  return <HomePage searchParams={searchParams} requestedPathname={requestedPathname} />;
}