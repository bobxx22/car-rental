// Приймає бронювання, перевіряє все ще раз (браузеру не довіряємо), сам рахує суму і надсилає адмінам у Telegram.

import { formatPrice, site } from "@/data/site";
import { driverRule, durationHours, formatDuration, formatPhone, formatWhen, isValidPhone, normalizePhone, periodError, quote, type Period } from "@/lib/pricing";
import { escapeHtml, isConfigured, notifyAdmins } from "@/lib/telegram";

// Простий захист від спаму: не більше 5 заявок за 10 хвилин з однієї адреси.
// Лічильник живе в пам'яті сервера — для сайту-візитки цього достатньо.
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Не вдалося прочитати заявку." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Не вдалося прочитати заявку." }, { status: 400 });
  }

  // бот заповнив приховане поле — робимо вигляд, що все добре
  if (str(body.company)) return Response.json({ ok: true });

  const car = site.cars.find((c) => c.id === body.car);
  const raw = (body.period ?? {}) as Partial<Period>;
  const period: Period = { fromDate: str(raw.fromDate, 10), fromTime: str(raw.fromTime, 5), toDate: str(raw.toDate, 10), toTime: str(raw.toTime, 5) };
  const extras = Array.isArray(body.extras) ? body.extras.filter((x): x is string => site.extras.some((e) => e.id === x)) : [];
  const name = str(body.name, 60);
  const phone = normalizePhone(str(body.phone, 20));
  const address = str(body.address, 200);
  const comment = str(body.comment, 500);

  const errors: Record<string, string> = {};
  if (!car) errors.form = "Такого авто немає";
  const pErr = periodError(period);
  if (pErr) errors.period = pErr;
  if (name.length < 2) errors.name = "Вкажіть ім'я";
  if (!isValidPhone(phone)) errors.phone = "Невірний номер телефону";
  if (extras.includes("delivery") && address.length < 5) errors.address = "Вкажіть адресу доставки";
  const selfDrive = !extras.includes("chauffeur");
  if (selfDrive && body.driver !== true) errors.driver = driverRule();
  if (Object.keys(errors).length || !car) {
    return Response.json({ error: errors.form ?? "Перевірте поля форми.", errors }, { status: 400 });
  }

  // ліміт рахуємо лише для заповнених заявок: людина, що помилилась у формі, не блокується
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (tooMany(ip)) return Response.json({ error: "Забагато заявок. Спробуйте трохи пізніше." }, { status: 429 });

  if (!isConfigured()) {
    console.error("[booking] не задано TELEGRAM_BOT_TOKEN або TELEGRAM_CHAT_IDS у .env");
    return Response.json({ error: "Онлайн-бронювання тимчасово недоступне. Зателефонуйте нам, будь ласка." }, { status: 503 });
  }

  // суму рахуємо на сервері — та сама функція, що й на сайті
  const q = quote(car, period, extras);

  const message = [
    "<b>🚗 Нове бронювання</b>",
    "",
    `<b>Авто:</b> ${escapeHtml(car.name)} ${car.year} (${car.class})`,
    `<b>Отримання:</b> ${formatWhen(period.fromDate, period.fromTime)}`,
    `<b>Повернення:</b> ${formatWhen(period.toDate, period.toTime)}`,
    `<b>Термін:</b> ${formatDuration(durationHours(period))}`,
    "",
    `<b>Ім'я:</b> ${escapeHtml(name)}`,
    `<b>Телефон:</b> +380 ${formatPhone(phone)}`,
    selfDrive ? "<b>Вік і стаж:</b> підтверджено" : "<b>Кермує:</b> особистий водій",
    extras.includes("delivery") ? `<b>Доставка:</b> ${escapeHtml(address)}` : "<b>Де забрати:</b> в офісі",
    comment ? `<b>Коментар:</b> ${escapeHtml(comment)}` : "",
    "",
    `${escapeHtml(q.label)} — ${formatPrice(q.base)}`,
    ...q.extras.map((x) => `${escapeHtml(x.title)} — ${formatPrice(x.price)}`),
    `<b>Разом: ${formatPrice(q.total)}</b>`,
    `Застава: ${formatPrice(q.deposit)}`,
  ]
    .filter((l, i, a) => l !== "" || a[i - 1] !== "")
    .join("\n");

  const { delivered } = await notifyAdmins(message, [], "");
  if (!delivered) return Response.json({ error: "Не вдалося відправити заявку. Зателефонуйте нам, будь ласка." }, { status: 502 });
  return Response.json({ ok: true, total: q.total });
}
