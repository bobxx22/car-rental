import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/BookingForm";
import { CarImage } from "@/components/CarImage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Back, Bolt, Engine, Gauge, Seat, Timer } from "@/components/icons";
import { formatPrice, site } from "@/data/site";

// усі сторінки авто збираються заздалегідь; невідома адреса — 404
export const dynamicParams = false;
export const generateStaticParams = () => site.cars.map((c) => ({ id: c.id }));

const findCar = (id: string) => site.cars.find((c) => c.id === id);

export async function generateMetadata({ params }: PageProps<"/cars/[id]">): Promise<Metadata> {
  const car = findCar((await params).id);
  if (!car) return {};
  return {
    title: `Оренда ${car.name} ${site.cityIn}`,
    description: `${car.name} ${car.year}: ${car.power} к.с., 0–100 за ${String(car.acceleration).replace(".", ",")} с. Від ${formatPrice(car.pricePerHour)}/год або ${formatPrice(car.pricePerDay)}/доба.`,
  };
}

export default async function CarPage({ params }: PageProps<"/cars/[id]">) {
  const car = findCar((await params).id);
  if (!car) notFound();
  const R = site.rules;

  const specs = [
    { icon: <Bolt className="size-5" />, k: "Потужність", v: `${car.power} к.с.` },
    { icon: <Timer className="size-5" />, k: "0–100 км/год", v: `${String(car.acceleration).replace(".", ",")} с` },
    { icon: <Gauge className="size-5" />, k: "Максимальна", v: `${car.topSpeed} км/год` },
    { icon: <Engine className="size-5" />, k: "Двигун", v: car.engine },
    { icon: <Seat className="size-5" />, k: "Місць", v: `${car.seats} · ${car.body.toLowerCase()}` },
  ];

  const rates = [
    { t: `${R.minHours}–${R.hourlyUpTo} год`, p: formatPrice(car.pricePerHour), u: "/ год" },
    ...site.tiers.map((tier) => ({ t: tier.label, p: formatPrice(Math.round((car.pricePerDay * (100 - tier.discount)) / 100)), u: "/ доба" })),
    { t: `${R.maxDays} діб`, p: formatPrice(car.pricePerMonth), u: "/ місяць" },
  ];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 pt-6">
        <Link href="/#fleet" className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-foreground">
          <Back className="size-4" /> Увесь автопарк
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start">
          <div>
            <CarImage src={car.image} alt={`${car.name} ${car.year}`} priority className="aspect-[4/3] w-full rounded-[2rem]" />

            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{car.name}</h1>
              <span className="rounded-full bg-surface px-4 py-1.5 text-sm font-semibold ring-1 ring-line">
                {car.class} · {car.year}
              </span>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
              {specs.map((s) => (
                <div key={s.k} className="rounded-2xl bg-surface p-4 ring-1 ring-line">
                  <dt className="flex items-center gap-2 text-sm text-muted">
                    {s.icon}
                    {s.k}
                  </dt>
                  <dd className="mt-2 font-semibold">{s.v}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-4 flex flex-wrap gap-2">
              {car.features.map((f) => (
                <li key={f} className="rounded-full bg-accent/25 px-3 py-1.5 text-sm font-medium">
                  {f}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-display text-2xl font-bold">Тарифи</h2>
            <div className="mt-4 overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
              {rates.map((r, i) => (
                <div key={r.t} className={`flex items-baseline justify-between px-5 py-4 ${i ? "border-t border-line" : ""}`}>
                  <span className="text-muted">{r.t}</span>
                  <span className="font-display text-lg font-bold">
                    {r.p} <span className="text-sm font-normal text-muted">{r.u}</span>
                  </span>
                </div>
              ))}
              <div className="flex items-baseline justify-between border-t border-line bg-background px-5 py-4">
                <span className="text-muted">Застава</span>
                <span className="font-semibold">{formatPrice(car.deposit)}</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted">Страховка КАСКО та ОСЦПВ включена. 200 км на добу без доплати.</p>
          </div>

          <div className="lg:sticky lg:top-20">
            <BookingForm car={car} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
