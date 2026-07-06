import { Header } from "@/components/marketing/header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="pt-16">{children}</div>
    </>
  );
}
