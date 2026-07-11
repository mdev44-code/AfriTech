import { Footer } from "@/components/marketing/footer";
import { Header } from "@/components/marketing/header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand-blue focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
      >
        Aller au contenu principal
      </a>
      <Header />
      <div id="main-content" className="pt-16">
        {children}
      </div>
      <Footer />
    </>
  );
}
