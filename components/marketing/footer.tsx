"use client";

import { useEffect, useState, type FormEvent, type SVGProps } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#projets", label: "Projets" },
  { href: "#faq", label: "FAQ" },
];

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "#", Icon: LinkedInIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "X (Twitter)", href: "#", Icon: XIcon },
];

function useDakarClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Africa/Dakar",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    function update() {
      setTime(formatter.format(new Date()));
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

export function Footer() {
  const dakarTime = useDakarClock();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
  }

  return (
    <footer className="border-t border-white/5 bg-background px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo size="md" />
            <p className="mt-4 text-sm text-text-secondary">
              Agence de création de logiciels web/mobile, d&apos;automatisation
              et d&apos;intégration d&apos;IA.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-text-secondary transition-colors duration-300 hover:text-brand-blue-light"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-text-primary">
              Navigation
            </h3>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors duration-300 hover:text-brand-blue-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-text-primary">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-blue-light" aria-hidden="true" />
                contact@afritech.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-blue-light" aria-hidden="true" />
                +221 33 000 00 00
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-blue-light" aria-hidden="true" />
                Dakar, Sénégal
              </li>
            </ul>
            <p className="mt-4 text-sm text-text-secondary">
              <span className="font-medium text-text-primary">
                {dakarTime ?? "--:--:--"}
              </span>{" "}
              à Dakar
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-text-primary">
              Newsletter
            </h3>
            <p className="mt-4 text-sm text-text-secondary">
              Recevez nos actualités et nos retours d&apos;expérience.
            </p>

            {isSubscribed ? (
              <p className="mt-4 text-sm text-text-primary">
                Merci, vous êtes inscrit·e !
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="vous@email.com"
                  aria-label="Adresse email"
                  className="border-white/10 bg-surface text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
                />
                <Button
                  type="submit"
                  size="icon"
                  aria-label="S'inscrire à la newsletter"
                  className="shrink-0 bg-brand-blue text-white hover:bg-brand-blue-light"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-text-secondary sm:flex-row">
          <p>© {new Date().getFullYear()} Afritech. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
