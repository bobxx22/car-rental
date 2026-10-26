// Розрахунок оренди — спільний для сайту (браузер) і сервера, тож сума в заявці завжди збігається з тим, що бачив гість.
// Час рахуємо «за годинником на стіні» у Києві: дата + час без часових поясів.

import { formatPrice, site, type Car } from "@/data/site";

const R = site.rules;

export type Period = { fromDate: string; fromTime: string; toDate: string; toTime: string }; // "2026-10-22", "10:00"

const TZ = "Europe/Kyiv";

// «Зараз» за київським годинником у хвилинах від 1970 року (для порівнянь)
export function kyivNowMinutes(now = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    })
      .formatToParts(now)
      .map((x) => [x.type, x.value]),
  );
  return toMinutes(`${p.year}-${p.month}-${p.day}`, `${p.hour}:${p.minute}`);
}

export const toMinutes = (date: string, time: string) => {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return Date.UTC(y, m - 1, d, hh, mm) / 60000;
};

export const todayKyiv = (now = new Date()) => fromMinutes(kyivNowMinutes(now)).date;

export function fromMinutes(min: number) {
  const iso = new Date(min * 60000).toISOString();
  return { date: iso.slice(0, 10), time: iso.slice(11, 16) };
}

export const addDays = (date: string, n: number) => fromMinutes(toMinutes(date, "00:00") + n * 1440).date;

// Години видачі/повернення з кроком 30 хв: 08:00, 08:30 … 22:00
export const timeSlots = (() => {
  const out: string[] = [];
  for (let m = toMinutes("1970-01-01", R.openFrom); m <= toMinutes("1970-01-01", R.openTo); m += R.slotMinutes) out.push(fromMinutes(m).time);
  return out;
})();

// Період за замовчуванням: завтра 10:00 → післязавтра 10:00
export function defaultPeriod(now = new Date()): Period {
  const tomorrow = addDays(todayKyiv(now), 1);
  return { fromDate: tomorrow, fromTime: "10:00", toDate: addDays(tomorrow, 1), toTime: "10:00" };
}

export const durationHours = (p: Period) => (toMinutes(p.toDate, p.toTime) - toMinutes(p.fromDate, p.fromTime)) / 60;

// Помилка в періоді (або null, якщо все гаразд)
export function periodError(p: Period, now = new Date()): string | null {
  if (![p.fromDate, p.toDate].every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)) || ![p.fromTime, p.toTime].every((t) => timeSlots.includes(t)))
    return "Оберіть дату й час з робочих годин";
  const start = toMinutes(p.fromDate, p.fromTime);
  const nowMin = kyivNowMinutes(now);
  if (start < nowMin + R.firstSlotHours * 60) return `Найраніша видача — через ${R.firstSlotHours} години від зараз`;
  if (start > nowMin + R.daysAhead * 1440) return `Бронювання доступне на ${R.daysAhead} днів уперед`;
  const h = durationHours(p);
  if (h <= 0) return "Повернення має бути пізніше за отримання";
  if (h < R.minHours) return `Мінімальна оренда — ${R.minHours} години`;
  if (h > R.maxDays * 24) return `Онлайн — до ${R.maxDays} діб. Для довшої оренди зателефонуйте нам`;
  return null;
}

export type Quote = {
  mode: "hours" | "days" | "month";
  units: number; // годин або діб
  unitPrice: number;
  discount: number; // %
  base: number; // оренда без додаткових послуг
  extras: { id: string; title: string; price: number }[];
  total: number;
  deposit: number;
  label: string; // «3 доби × 1 530 ₴ (−10%)»
};

// Людська тривалість: «5 год», «2 доби», «2 доби 4 год».
// asObject — для «за …»: «за 1 добу», а не «за 1 доба»
export function formatDuration(hours: number, asObject = false) {
  const d = Math.floor(hours / 24);
  const h = Math.round(hours - d * 24);
  const parts = [];
  if (d) parts.push(`${d} ${plural(d, asObject ? "добу" : "доба", "доби", "діб")}`);
  if (h) parts.push(`${h} год`);
  return parts.join(" ") || "0 год";
}

export function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}


export function quote(car: Car, p: Period, extraIds: string[] = []): Quote {
  const hours = durationHours(p);

  let mode: Quote["mode"];
  let units: number;
  let unitPrice: number;
  let discount = 0;
  let base: number;
  let tierDays = 0; // якщо застосовано тариф довшого терміну

  // Погодинно — до 12 годин, але не дорожче за добу
  if (hours <= R.hourlyUpTo && Math.max(R.minHours, Math.ceil(hours)) * car.pricePerHour < car.pricePerDay) {
    mode = "hours";
    units = Math.max(R.minHours, Math.ceil(hours));
    unitPrice = car.pricePerHour;
    base = units * unitPrice;
  } else {
    // діб: кожні розпочаті 24 години, з годиною «на запізнення» без доплати
    const days = Math.max(1, Math.ceil((hours - 1) / 24));
    // Щоб 13 діб не коштували дорожче за 14 (а 29 — дорожче за місяць), беремо найвигідніший
    // з тарифів на цей або довший термін
    let bestDays = days;
    let best = daysCost(car, days);
    for (let d = days + 1; d <= R.maxDays; d++) {
      const c = daysCost(car, d);
      if (c.base < best.base) {
        best = c;
        bestDays = d;
      }
    }
    if (bestDays >= R.maxDays) {
      mode = "month";
      units = days;
      unitPrice = car.pricePerMonth / R.maxDays;
      base = car.pricePerMonth;
    } else {
      mode = "days";
      units = days;
      discount = best.discount;
      unitPrice = best.unitPrice;
      base = best.base;
    }
    tierDays = bestDays > days ? bestDays : 0;
  }

  const days = mode === "hours" ? 1 : units;
  const extras = site.extras
    .filter((e) => extraIds.includes(e.id))
    .map((e) => ({ id: e.id, title: e.title, price: e.per === "day" ? e.price * days : e.price }));

  const dayWord = (n: number) => plural(n, "доба", "доби", "діб");
  const label =
    mode === "hours"
      ? `${units} год × ${formatPrice(unitPrice)}`
      : mode === "month"
        ? units >= R.maxDays
          ? `Місячний тариф (${R.maxDays} діб)`
          : `${units} ${dayWord(units)} — за місячним тарифом, так вигідніше`
        : tierDays
          ? `${units} ${dayWord(units)} — за тарифом ${tierDays} діб (−${discount}%), так вигідніше`
          : `${units} ${dayWord(units)} × ${formatPrice(unitPrice)}${discount ? ` (−${discount}%)` : ""}`;

  return {
    mode,
    units,
    unitPrice,
    discount,
    base,
    extras,
    total: base + extras.reduce((s, e) => s + e.price, 0),
    deposit: car.deposit,
    label,
  };
}

// Вартість оренди на d діб за таблицею знижок
function daysCost(car: Car, d: number) {
  const discount = site.tiers.find((t) => d >= t.from && d <= t.to)?.discount ?? 0;
  const unitPrice = Math.round((car.pricePerDay * (100 - discount)) / 100);
  return { discount, unitPrice, base: d >= R.maxDays ? car.pricePerMonth : d * unitPrice };
}

// «21 рік», «22 роки»; і «від 21 року», «від 2 років»
export const yearsWord = (n: number) => `${n} ${plural(n, "рік", "роки", "років")}`;
export const fromYears = (n: number) => `від ${n} ${n % 10 === 1 && n % 100 !== 11 ? "року" : "років"}`;
export const driverRule = () => `Оренда — ${fromYears(site.rules.minAge)} і зі стажем ${fromYears(site.rules.minExperience)}`;

// ---------- телефон (як у шаблоні тату) ----------
export function normalizePhone(input: string) {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("380")) digits = digits.slice(3);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}
const OPERATORS = ["39", "50", "63", "66", "67", "68", "73", "75", "77", "91", "92", "93", "94", "95", "96", "97", "98", "99"];
export const isValidPhone = (nine: string) => /^\d{9}$/.test(nine) && OPERATORS.includes(nine.slice(0, 2));
export const formatPhone = (nine: string) =>
  [nine.slice(0, 2), nine.slice(2, 5), nine.slice(5, 7), nine.slice(7, 9)].filter(Boolean).join(" ");

const WEEKDAYS = ["нд", "пн", "вт", "ср", "чт", "пт", "сб"];
const MONTHS = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
// «чт, 22 жовтня, 10:00»
export function formatWhen(date: string, time: string) {
  const d = new Date(`${date}T12:00:00Z`);
  return `${WEEKDAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}, ${time}`;
}
