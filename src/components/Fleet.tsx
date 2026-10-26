"use client";

import Link from "next/link";
import { useState } from "react";
import { bodies, carClasses, formatPrice, type Body, type Car, type CarClass } from "@/data/site";
import { usePeriod } from "@/lib/period";
import { durationHours, formatDuration, periodError, quote } from "@/lib/pricing";
import { CarImage } from "./CarImage";
import { Arrow, Bolt, Seat, Timer } from "./icons";

export function Fleet({ cars }: { cars: Car[] }) {
  const [cls, setCls] = useState<CarClass | "Усі">("Усі");
  const [body, setBody] = useState<Body | "Будь-який">("Будь-який");
  const period = usePeriod();
  const valid = period && !periodError(period);

  const shown = cars.filter((c) => (cls === "Усі" || c.class === cls) && (body === "Будь-який" || c.body === body));

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {(["Усі", ...carClasses] as const).map((c) => {
            const n = c === "Усі" ? cars.length : cars.filter((x) => x.class === c).length;
            const on = c === cls;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCls(c)}
                className={`flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${on ? "bg-foreground text-background" : "bg-surface ring-1 ring-line hover:ring-foreground/40"}`}
              >
                {c}
                <span className={on ? "text-background/50" : "text-muted"}>{n}</span>
              </button>
            );
          })}
        </div>
        <div className="no-scrollbar -mx-4 flex shrink-0 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex shrink-0 rounded-full bg-surface p-1 ring-1 ring-line">
            {(["Будь-який", ...bodies] as const).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBody(b)}
                className={`h-8 shrink-0 rounded-full px-3 text-sm font-medium transition ${body === b ? "bg-accent text-black" : "text-muted hover:text-foreground"}`}
              >
                {b === "Будь-який" ? "Будь-який кузов" : b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-surface p-8 text-center text-muted ring-1 ring-line">
          Такого поєднання зараз немає. Спробуйте інший клас або кузов.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((car) => {
            const q = valid ? quote(car, period) : null;
            return (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="group flex flex-col overflow-hidden rounded-3xl bg-surface ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5"
              >
                <div className="relative">
                  <CarImage src={car.image} alt={`${car.name} ${car.year}`} className="aspect-[4/3] w-full" />
                  <span className="absolute top-3 left-3 rounded-full bg-surface/90 px-3 py-1 text-xs font-semibold backdrop-blur">{car.class}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl font-bold tracking-tight">{car.name}</h3>
                    <span className="text-sm text-muted">{car.year}</span>
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted">
                    <li className="flex items-center gap-1.5"><Bolt />{car.power} к.с.</li>
                    <li className="flex items-center gap-1.5"><Timer />{String(car.acceleration).replace(".", ",")} с до 100</li>
                    <li className="flex items-center gap-1.5"><Seat />{car.seats}</li>
                  </ul>

                  <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                    {q && period ? (
                      <div>
                        <div className="text-xs text-muted">За {formatDuration(durationHours(period), true)}</div>
                        <div className="font-display text-2xl font-bold tracking-tight">{formatPrice(q.base)}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-xs text-muted">від {formatPrice(car.pricePerHour)} / год</div>
                        <div className="font-display text-2xl font-bold tracking-tight">
                          {formatPrice(car.pricePerDay)}
                          <span className="text-base font-medium text-muted"> / доба</span>
                        </div>
                      </div>
                    )}
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-black transition group-hover:translate-x-0.5">
                      <Arrow />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
