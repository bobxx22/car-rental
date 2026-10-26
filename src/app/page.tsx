import { Fleet } from "@/components/Fleet";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PeriodPicker } from "@/components/PeriodPicker";
import { Arrow, Check } from "@/components/icons";
import { formatPrice, site } from "@/data/site";

export default function Home() {
  const example = site.cars.find((c) => c.class === "Суперкар") ?? site.cars[0];
  const R = site.rules;

  return (
    <>
      <Header />

      <main>
        {/* Перший екран: відео на всю ширину, заголовок зліва, на темній частині кадру */}
        <section className="px-3 pt-3 sm:px-4 sm:pt-4">
          {/* телефон: відео 4:3 зверху, текст під ним; комп'ютер: відео на весь блок, текст поверх зліва */}
          <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-surface md:h-[calc(100svh-6rem)] md:max-h-[760px] md:min-h-[560px]">
            <div className="relative aspect-[4/3] md:absolute md:inset-0 md:aspect-auto">
            {site.hero.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={site.hero.image} alt="" className="absolute inset-0 size-full object-cover object-[75%_center]" />
            )}
            {site.hero.video && (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={site.hero.image}
                className="absolute inset-0 size-full object-cover object-[75%_center] motion-reduce:hidden"
              >
                <source src={site.hero.video} type="video/mp4" />
              </video>
            )}
              {/* знизу на телефоні — плавно в білий блок з текстом; на комп'ютері — темне затемнення зліва під білий текст */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent md:bg-gradient-to-r md:from-black/85 md:via-black/45 md:to-transparent" />
            </div>

            <div className="relative px-6 pt-2 pb-24 sm:px-10 md:absolute md:inset-y-0 md:left-0 md:flex md:max-w-2xl md:flex-col md:justify-center md:pt-0 md:pb-28 lg:px-14">
              <p className="text-sm font-semibold text-foreground/70 md:text-white/70">
                {site.type} {site.cityIn}
              </p>
              <h1 className="mt-3 font-display text-[2.6rem] leading-[1.18] md:leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-6xl md:text-white lg:text-7xl">
                {site.tagline.split(" ").slice(0, 2).join(" ")}{" "}
                <span className="bg-accent px-2 pb-0.5 box-decoration-clone text-black md:bg-transparent md:px-0 md:text-accent">{site.tagline.split(" ").slice(2).join(" ")}</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg text-foreground/75 md:text-white/80">{site.lead}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4">
          {/* вибір періоду «наїжджає» на низ першого екрана */}
          <div className="relative z-10 -mt-16 rounded-[1.75rem] bg-surface/95 p-5 shadow-2xl shadow-black/10 ring-1 ring-line backdrop-blur-md sm:p-7 lg:mx-8">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-xl font-bold">Коли потрібне авто?</h2>
              <span className="hidden text-sm text-muted sm:inline">
                Від {R.minHours} годин до {R.maxDays} діб
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <PeriodPicker />
              <a
                href="#fleet"
                className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-accent px-7 font-semibold text-black transition hover:brightness-95 lg:mb-9"
              >
                Показати авто <Arrow />
              </a>
            </div>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {site.perks.map((p) => (
              <li key={p.title} className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-black">
                  <Check className="size-3.5" />
                </span>
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-muted">{p.text}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Автопарк */}
        <section id="fleet" className="mx-auto mt-20 max-w-7xl px-4">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Автопарк</h2>
            <p className="text-muted">Ціни в картках — за обраний вами термін</p>
          </div>
          <Fleet cars={site.cars} />
        </section>

        {/* Як рахуємо ціну */}
        <section id="prices" className="mx-auto mt-20 max-w-7xl px-4">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Чим довше — тим дешевше</h2>
          <p className="mt-3 max-w-2xl text-muted">
            До {R.hourlyUpTo} годин рахуємо погодинно, але ніколи не дорожче за добу. Далі — доба зі знижкою за термін.
            Приклад — {example.name}:
          </p>
          <div className="no-scrollbar -mx-4 mt-6 overflow-x-auto px-4">
            <div className="grid min-w-[44rem] grid-cols-6 overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
              {[
                { t: `${R.minHours}–${R.hourlyUpTo} год`, p: `${formatPrice(example.pricePerHour)}`, u: "за годину" },
                ...site.tiers.map((tier) => ({
                  t: tier.label,
                  p: formatPrice(Math.round((example.pricePerDay * (100 - tier.discount)) / 100)),
                  u: tier.discount ? `за добу · −${tier.discount}%` : "за добу",
                })),
                { t: `${R.maxDays} діб`, p: formatPrice(example.pricePerMonth), u: "за місяць" },
              ].map((c, i) => (
                <div key={c.t} className={`p-5 ${i ? "border-l border-line" : ""} ${i === 5 ? "bg-accent text-black [&_.text-muted]:text-black/60" : ""}`}>
                  <div className="text-sm font-medium text-muted">{c.t}</div>
                  <div className="mt-3 font-display text-2xl font-bold tracking-tight">{c.p}</div>
                  <div className="mt-1 text-sm text-muted">{c.u}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Умови */}
        <section id="conditions" className="mx-auto mt-20 max-w-7xl px-4">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Умови оренди</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {site.conditions.map((c) => (
              <div key={c.title} className="rounded-3xl bg-surface p-6 ring-1 ring-line">
                <h3 className="font-display text-lg font-bold">{c.title}</h3>
                <p className="mt-2 text-muted">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Питання */}
        <section id="faq" className="mx-auto mt-20 max-w-3xl px-4">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Часті питання</h2>
          <div className="mt-6 divide-y divide-line rounded-3xl bg-surface ring-1 ring-line">
            {site.faq.map((f) => (
              <details key={f.q} className="group p-5 sm:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {f.q}
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-lg transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
