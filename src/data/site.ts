// Усі дані прокату в одному файлі.
// Для нового клієнта міняємо цей файл і фото в public/images — решта сайту підлаштується.

export type CarClass = "Суперкар" | "Спорткар" | "Гран-турер" | "Позашляховик" | "Люкс";
export type Body = "Купе" | "Кабріолет" | "Седан" | "Позашляховик";
export type Fuel = "Бензин" | "Гібрид" | "Електро";

export type Car = {
  id: string; // латиницею: стає адресою сторінки /cars/<id>
  name: string;
  year: number;
  class: CarClass;
  body: Body;
  engine: string; // «V10 5,2 л»
  power: number; // к.с.
  acceleration: number; // 0–100 км/год, секунд
  topSpeed: number; // км/год
  seats: number;
  fuel: Fuel;
  features: string[];
  pricePerHour: number;
  pricePerDay: number; // базова ціна доби (1–2 доби)
  pricePerMonth: number; // 30 діб
  deposit: number; // застава, повертається після оренди
  image?: string; // /images/cars/....webp — поки фото немає, показуємо силует
};

const car = (id: string) => `/images/cars/${id}.webp`;

export const site = {
  name: "РУШ",
  type: "Прокат суперкарів",
  city: "Київ",
  cityIn: "у Києві",
  url: "https://rush-rent.com.ua",
  tagline: "Суперкар на годину, день чи місяць",
  lead: "Lamborghini, Ferrari, McLaren, Rolls-Royce. Подаємо до дверей з повним баком і повною страховкою.",

  // Валюта цін на сайті. Для люкс-прокату зазвичай долари; для звичайного — "₴".
  currency: "$" as "$" | "€" | "₴",

  phone: "+380 67 555 12 34",
  telegram: "rush_rent",
  instagram: "rush.rent",
  address: "вул. Велика Васильківська, 72, Київ",
  hours: "Подача щодня 08:00 – 22:00",

  hero: {
    image: "/images/site/hero.webp" as string | undefined, // фото — поки вантажиться відео
    video: "/video/hero.mp4" as string | undefined, // можна прибрати: тоді лишиться фото
  },

  perks: [
    { title: "Від 3 годин", text: "Фотосесія, побачення чи весілля — беріть рівно на стільки, скільки треба" },
    { title: "Повна страховка", text: "КАСКО та ОСЦПВ уже в ціні, без дрібного шрифту" },
    { title: "Подача до дверей", text: "Привеземо авто додому, в готель або в аеропорт" },
    { title: "Особистий водій", text: "Якщо хочете насолоджуватись, а не кермувати" },
  ],

  // знижка на добу залежно від терміну (від базової ціни доби)
  tiers: [
    { from: 1, to: 2, discount: 0, label: "1–2 доби" },
    { from: 3, to: 6, discount: 10, label: "3–6 діб" },
    { from: 7, to: 13, discount: 15, label: "7–13 діб" },
    { from: 14, to: 29, discount: 20, label: "14–29 діб" },
  ],

  rules: {
    minHours: 3, // найкоротша оренда
    hourlyUpTo: 12, // до скількох годин рахуємо погодинно
    maxDays: 30, // найдовша оренда онлайн; довше — за телефоном
    daysAhead: 60, // на скільки днів уперед можна бронювати
    firstSlotHours: 2, // найраніша подача — через 2 години від зараз
    openFrom: "08:00",
    openTo: "22:00",
    slotMinutes: 30,
    minAge: 25,
    minExperience: 5,
  },

  extras: [
    { id: "delivery", title: "Подача за адресою", text: "Привеземо й заберемо в межах Києва", price: 100, per: "rental" as const },
    { id: "chauffeur", title: "Особистий водій", text: "Досвідчений водій у костюмі, до 12 годин на добу", price: 250, per: "day" as const },
    { id: "photo", title: "Фотосесія з авто", text: "Фотограф на годину, 30+ оброблених фото", price: 200, per: "rental" as const },
  ],

  conditions: [
    { title: "Вік від 25 років", text: "І водійський стаж від 5 років. Для авто з особистим водієм — без обмежень" },
    { title: "Документи", text: "Паспорт або ID-картка, посвідчення водія та ІПН. Для іноземців — закордонний паспорт" },
    { title: "Застава", text: "Від $5 000, блокується на картці й повертається в день здачі авто" },
    { title: "Пробіг", text: "200 км на добу включено, далі — $5/км" },
    { title: "Паливо", text: "Подаємо з повним баком — так само й повертаєте" },
    { title: "Поїздки", text: "Київ та область. Далі — за погодженням з менеджером" },
  ],

  faq: [
    { q: "Можна взяти суперкар лише на кілька годин?", a: "Так, від 3 годин — для фотосесії, побачення чи весілля. До 12 годин рахуємо погодинно, і ніколи не дорожче за добу." },
    { q: "Як працює застава?", a: "Сума блокується на вашій картці при отриманні авто й розблоковується в день повернення, якщо авто ціле." },
    { q: "Чи можна з водієм?", a: "Так. Додайте «Особистий водій» у бронюванні — тоді вимог до віку й стажу немає." },
    { q: "Чи потрібна передоплата?", a: "Ні. Ви залишаєте заявку, менеджер підтверджує авто й час, оплата — при отриманні." },
    { q: "Що, якщо я поверну авто пізніше?", a: "Перші 59 хвилин — безкоштовно. Далі — погодинний тариф, але не більше ціни доби." },
  ],

  cars: [
    {
      id: "huracan", name: "Lamborghini Huracán EVO Spyder", year: 2022, class: "Суперкар", body: "Кабріолет",
      engine: "V10 5,2 л", power: 640, acceleration: 3.1, topSpeed: 325, seats: 2, fuel: "Бензин",
      features: ["Складаний дах", "Повний привід", "Карбонові вставки"],
      pricePerHour: 250, pricePerDay: 1100, pricePerMonth: 22000, deposit: 10000, image: car("huracan"),
    },
    {
      id: "296gtb", name: "Ferrari 296 GTB", year: 2023, class: "Суперкар", body: "Купе",
      engine: "V6 3,0 л + електромотор", power: 830, acceleration: 2.9, topSpeed: 330, seats: 2, fuel: "Гібрид",
      features: ["Гібрид 830 к.с.", "Режим eManettino", "Шкіра Alcantara"],
      pricePerHour: 300, pricePerDay: 1400, pricePerMonth: 28000, deposit: 15000, image: car("296gtb"),
    },
    {
      id: "750s", name: "McLaren 750S", year: 2024, class: "Суперкар", body: "Купе",
      engine: "V8 4,0 л біттурбо", power: 750, acceleration: 2.8, topSpeed: 332, seats: 2, fuel: "Бензин",
      features: ["Двері «крило метелика»", "Карбоновий монокок", "Аудіо Bowers & Wilkins"],
      pricePerHour: 320, pricePerDay: 1500, pricePerMonth: 30000, deposit: 15000, image: car("750s"),
    },
    {
      id: "911turbo", name: "Porsche 911 Turbo S", year: 2023, class: "Спорткар", body: "Купе",
      engine: "Опозитна 6 цил. 3,8 л", power: 650, acceleration: 2.7, topSpeed: 330, seats: 4, fuel: "Бензин",
      features: ["Повний привід", "Sport Chrono", "Burmester"],
      pricePerHour: 200, pricePerDay: 900, pricePerMonth: 18000, deposit: 8000, image: car("911turbo"),
    },
    {
      id: "urus", name: "Lamborghini Urus Performante", year: 2023, class: "Позашляховик", body: "Позашляховик",
      engine: "V8 4,0 л біттурбо", power: 666, acceleration: 3.3, topSpeed: 306, seats: 5, fuel: "Бензин",
      features: ["5 місць", "Режим Rally", "Панорамний дах"],
      pricePerHour: 260, pricePerDay: 1200, pricePerMonth: 24000, deposit: 10000, image: car("urus"),
    },
    {
      id: "g63", name: "Mercedes-AMG G 63", year: 2024, class: "Позашляховик", body: "Позашляховик",
      engine: "V8 4,0 л біттурбо", power: 585, acceleration: 4.4, topSpeed: 240, seats: 5, fuel: "Бензин",
      features: ["5 місць", "Масаж сидінь", "Burmester 3D"],
      pricePerHour: 150, pricePerDay: 700, pricePerMonth: 14000, deposit: 5000, image: car("g63"),
    },
    {
      id: "cullinan", name: "Rolls-Royce Cullinan", year: 2023, class: "Люкс", body: "Позашляховик",
      engine: "V12 6,75 л", power: 571, acceleration: 5.2, topSpeed: 250, seats: 5, fuel: "Бензин",
      features: ["Зоряне небо в салоні", "Задні сидіння-лаунж", "Двері проти ходу"],
      pricePerHour: 380, pricePerDay: 1800, pricePerMonth: 36000, deposit: 20000, image: car("cullinan"),
    },
    {
      id: "maybach", name: "Mercedes-Maybach S 680", year: 2023, class: "Люкс", body: "Седан",
      engine: "V12 6,0 л", power: 612, acceleration: 4.5, topSpeed: 250, seats: 4, fuel: "Бензин",
      features: ["Крісла-реклайнери", "Холодильник і келихи", "Двоколірне фарбування"],
      pricePerHour: 220, pricePerDay: 1000, pricePerMonth: 20000, deposit: 10000, image: car("maybach"),
    },
    {
      id: "continental", name: "Bentley Continental GT Speed", year: 2023, class: "Гран-турер", body: "Купе",
      engine: "W12 6,0 л", power: 659, acceleration: 3.6, topSpeed: 335, seats: 4, fuel: "Бензин",
      features: ["Обертова панель Bentley", "Шкіра з ручною строчкою", "Naim Audio"],
      pricePerHour: 220, pricePerDay: 1000, pricePerMonth: 20000, deposit: 10000, image: car("continental"),
    },
  ] satisfies Car[] as Car[],
};

export const carClasses: CarClass[] = ["Суперкар", "Спорткар", "Гран-турер", "Позашляховик", "Люкс"];
export const bodies: Body[] = ["Купе", "Кабріолет", "Седан", "Позашляховик"];

export const phoneHref = `tel:${site.phone.replace(/[^\d+]/g, "")}`;
export const telegramUrl = `https://t.me/${site.telegram}`;
export const instagramUrl = `https://instagram.com/${site.instagram}`;

// «$1 100», «€900» або «1 100 ₴»
export const formatPrice = (n: number) => {
  const v = Math.round(n).toLocaleString("uk-UA");
  return site.currency === "₴" ? `${v} ₴` : `${site.currency}${v}`;
};
