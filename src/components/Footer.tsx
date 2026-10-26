import Link from "next/link";
import { instagramUrl, phoneHref, site, telegramUrl } from "@/data/site";
import { Clock, Mark, Phone, Pin } from "./icons";

export function Footer() {
  return (
    <footer id="contacts" className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <Mark />
            <span className="font-display text-2xl font-bold">{site.name}</span>
          </Link>
          <p className="mt-4 max-w-sm text-muted">{site.lead}</p>
        </div>
        <ul className="grid gap-4 text-foreground/80">
          <li className="flex gap-3"><Pin className="mt-0.5 size-5 shrink-0 text-accent" />{site.address}</li>
          <li className="flex gap-3"><Clock className="mt-0.5 size-5 shrink-0 text-accent" />{site.hours}. Підтримка на дорозі — 24/7</li>
        </ul>
        <div className="grid content-start gap-3">
          <a href={phoneHref} className="flex items-center gap-3 font-display text-2xl font-bold"><Phone className="size-5 text-accent" />{site.phone}</a>
          <div className="flex gap-2">
            <a href={telegramUrl} target="_blank" rel="noreferrer" className="rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-line transition hover:bg-background">Telegram</a>
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-line transition hover:bg-background">Instagram</a>
          </div>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">© 2026 {site.name}. Ціни включають страховку.</div>
    </footer>
  );
}
