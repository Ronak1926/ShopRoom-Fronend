import LoginClient from "./_components/LoginClient";

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function CustomerLoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialTab: "customer" | "shopkeeper" =
    params.tab === "shopkeeper" ? "shopkeeper" : "customer";

  return <LoginClient initialTab={initialTab} />;
}
