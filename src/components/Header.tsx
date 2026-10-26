import Link from "next/link";
import { phoneHref, site } from "@/data/site";
import { Mark, Phone } from "./icons";

const nav = [
  { href: "/#fleet", label: "Автопарк" },
  { href: "/#prices", label: "Ціни" },
  { href: "/#conditions", label: "Умови" },
  { href: "/#faq", label: "Питання" },
  { href: "/#contacts", label: "Контакти" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Mark />
          <span className="font-display text-xl font-bold tracking-tight">{site.name}</span>
          <span className="hidden text-sm text-muted sm:inline">· {site.type.toLowerCase()}</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-muted transition hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={phoneHref} aria-label={`Подзвонити ${site.phone}`} className="flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold ring-1 ring-line transition hover:ring-foreground/40">
            <Phone />
            <span className="hidden md:inline">{site.phone}</span>
          </a>
          <Link href="/#fleet" className="flex h-10 items-center rounded-full bg-accent px-4 text-sm font-semibold text-black transition hover:brightness-95">
            Забронювати
          </Link>
        </div>
      </div>
    </header>
  );
}
