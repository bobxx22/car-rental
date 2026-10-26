"use client";

import { useRef, useState } from "react";
import { formatPrice, phoneHref, site, type Car } from "@/data/site";
import { usePeriod } from "@/lib/period";
import { driverRule, durationHours, formatDuration, formatPhone, formatWhen, fromYears, isValidPhone, normalizePhone, periodError, quote, yearsWord } from "@/lib/pricing";
import { PeriodPicker } from "./PeriodPicker";
import { Check } from "./icons";

type Errors = Partial<Record<"period" | "name" | "phone" | "address" | "driver" | "form", string>>;

export function BookingForm({ car }: { car: Car }) {
  const period = usePeriod();
  const [extras, setExtras] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [driver, setDriver] = useState(false);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const honeypot = useRef<HTMLInputElement>(null);

  const periodErr = period ? periodError(period) : null;
  const q = period && !periodErr ? quote(car, period, extras) : null;
  const delivery = extras.includes("delivery");
  // з особистим водієм гість сам не кермує — вимоги до віку й стажу не потрібні
  const selfDrive = !extras.includes("chauffeur");
  const clear = (k: keyof Errors) => setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));

  const toggle = (id: string) => setExtras((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]));

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Errors = {};
    if (!period || periodErr) e.period = periodErr ?? "Оберіть дати";
    if (name.trim().length < 2) e.name = "Вкажіть ім'я";
    if (!isValidPhone(phone)) e.phone = "Мобільний номер: +380 XX XXX XX XX";
    if (delivery && address.trim().length < 5) e.address = "Куди привезти авто?";
    if (selfDrive && !driver) e.driver = driverRule();
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ car: car.id, period, extras, address: address.trim(), name: name.trim(), phone, driver, comment: comment.trim(), company: honeypot.current?.value ?? "" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors({ ...(json.errors ?? {}), form: json.error ?? "Не вдалося відправити. Спробуйте ще раз або зателефонуйте." });
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setErrors({ form: "Немає з'єднання з інтернетом. Перевірте мережу і спробуйте ще раз." });
      setStatus("idle");
    }
  };

  if (status === "done" && period && q) {
    return (
      <div className="rounded-3xl bg-surface p-6 text-center ring-1 ring-line sm:p-8">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-black">
          <Check className="size-6" />
        </div>
        <h2 className="mt-5 font-display text-3xl font-bold tracking-tight">Заявку прийнято</h2>
        <p className="mt-3 text-muted">
          {car.name}, {formatWhen(period.fromDate, period.fromTime)} — {formatWhen(period.toDate, period.toTime)}.
          <br />
          Менеджер зателефонує протягом 15 хвилин, щоб підтвердити авто.
        </p>
        <div className="mt-5 font-display text-2xl font-bold">{formatPrice(q.total)}</div>
        <a href={phoneHref} className="mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold ring-1 ring-line">
          Є питання? {site.phone}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl bg-surface p-5 ring-1 ring-line sm:p-7">
      <h2 className="font-display text-2xl font-bold tracking-tight">Бронювання</h2>

      <div className="mt-5">
        <PeriodPicker compact />
        {errors.period && !periodErr && <p className="mt-2 text-sm text-danger">{errors.period}</p>}
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-muted">Додатково</legend>
        <div className="mt-2 grid gap-2">
          {site.extras.map((x) => {
            const on = extras.includes(x.id);
            return (
              <label key={x.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl p-3.5 ring-1 transition ${on ? "bg-accent/10 ring-accent" : "ring-line hover:ring-foreground/40"}`}>
                <input type="checkbox" checked={on} onChange={() => toggle(x.id)} className="peer sr-only" />
                <span className={`flex size-5 shrink-0 items-center justify-center rounded-md ring-1 ${on ? "bg-accent text-black ring-accent" : "ring-muted"}`}>{on && <Check className="size-3.5" />}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{x.title}</span>
                  <span className="block text-xs text-muted">{x.text}</span>
                </span>
                <span className="shrink-0 text-sm font-semibold">
                  {formatPrice(x.price)}
                  <span className="font-normal text-muted">{x.per === "day" ? " / доба" : ""}</span>
                </span>
              </label>
            );
          })}
        </div>
        {delivery && (
          <div className="mt-3">
            <input
              className="field"
              placeholder="Адреса доставки: вулиця, будинок"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                clear("address");
              }}
            />
            {errors.address && <p className="mt-1.5 text-sm text-danger">{errors.address}</p>}
          </div>
        )}
      </fieldset>

      <fieldset className="mt-6 grid gap-3">
        <legend className="mb-2 text-sm font-medium text-muted">Ваші дані</legend>
        <div>
          <input className="field" placeholder="Ім'я" autoComplete="name" value={name} onChange={(e) => (setName(e.target.value), clear("name"))} />
          {errors.name && <p className="mt-1.5 text-sm text-danger">{errors.name}</p>}
        </div>
        <div>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted">+380</span>
            <input
              className="field"
              style={{ paddingLeft: "3.5rem" }} // місце під «+380»
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="67 123 45 67"
              value={formatPhone(phone)}
              onChange={(e) => (setPhone(normalizePhone(e.target.value).slice(0, 9)), clear("phone"))}
            />
          </div>
          {errors.phone && <p className="mt-1.5 text-sm text-danger">{errors.phone}</p>}
        </div>
        <textarea className="field h-auto min-h-20 py-3" placeholder="Коментар (необов'язково): рейс, побажання…" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} />
        {selfDrive && (
          <label className="flex cursor-pointer items-start gap-3 pt-1">
            <input type="checkbox" checked={driver} onChange={(e) => (setDriver(e.target.checked), clear("driver"))} className="peer sr-only" />
            <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md ring-1 ${driver ? "bg-accent text-black ring-accent" : "ring-muted"}`}>{driver && <Check className="size-3.5" />}</span>
            <span className="text-sm">
              Мені вже є {yearsWord(site.rules.minAge)}, водійський стаж — {fromYears(site.rules.minExperience)}
            </span>
          </label>
        )}
        {selfDrive && errors.driver && <p className="text-sm text-danger">{errors.driver}</p>}
      </fieldset>

      {/* підсумок */}
      <div className="mt-6 rounded-2xl bg-background p-4">
        {q && period ? (
          <>
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-muted">{q.label}</span>
              <span className="shrink-0">{formatPrice(q.base)}</span>
            </div>
            {q.extras.map((x) => (
              <div key={x.id} className="mt-1.5 flex justify-between gap-3 text-sm">
                <span className="text-muted">{x.title}</span>
                <span>{formatPrice(x.price)}</span>
              </div>
            ))}
            <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
              <span className="font-semibold">Разом за {formatDuration(durationHours(period), true)}</span>
              <span className="font-display text-2xl font-bold">{formatPrice(q.total)}</span>
            </div>
            <div className="mt-1 text-xs text-muted">+ застава {formatPrice(q.deposit)}, повертаємо при здачі авто</div>
          </>
        ) : (
          <p className="text-sm text-muted">Оберіть дати — порахуємо вартість.</p>
        )}
      </div>

      {/* пастка для ботів: людина цього поля не бачить */}
      <input ref={honeypot} name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      {errors.form && <p className="mt-4 text-sm text-danger">{errors.form}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-4 h-14 w-full rounded-2xl bg-accent font-semibold text-black transition hover:brightness-95 disabled:opacity-60"
      >
        {status === "sending" ? "Відправляємо…" : "Забронювати"}
      </button>
      <p className="mt-3 text-center text-xs text-muted">Без передоплати. Менеджер підтвердить авто телефоном.</p>
    </form>
  );
}
