"use client";

import { site } from "@/data/site";
import { setPeriod, usePeriod } from "@/lib/period";
import {
  addDays,
  durationHours,
  formatDuration,
  fromMinutes,
  periodError,
  timeSlots,
  todayKyiv,
  toMinutes,
  type Period,
} from "@/lib/pricing";

// Швидкі варіанти терміну: виставляють повернення від дати отримання
const QUICK = [
  { label: "3 год", hours: 3 },
  { label: "Доба", hours: 24 },
  { label: "3 доби", hours: 72 },
  { label: "Тиждень", hours: 168 },
  { label: "Місяць", hours: 720 },
];

export function PeriodPicker({ compact = false }: { compact?: boolean }) {
  const period = usePeriod();

  if (!period) {
    // поки сторінка не ожила в браузері — каркас тієї ж висоти
    return <div className={`animate-pulse rounded-2xl bg-line/60 ${compact ? "h-56" : "h-48"}`} />;
  }

  const today = todayKyiv();
  const maxDate = addDays(today, site.rules.daysAhead);
  const error = periodError(period);
  const hours = durationHours(period);

  const update = (patch: Partial<Period>) => setPeriod({ ...period, ...patch });
  const quick = (h: number) => {
    const end = fromMinutes(toMinutes(period.fromDate, period.fromTime) + h * 60);
    // якщо час повернення випадає з робочих годин — ставимо найближчий робочий
    const time = timeSlots.includes(end.time) ? end.time : end.time < site.rules.openFrom ? site.rules.openFrom : site.rules.openTo;
    setPeriod({ ...period, toDate: end.date, toTime: time });
  };

  return (
    <div className="min-w-0">
      <div className={`grid grid-cols-1 gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Slot
          max={maxDate}
          title="Отримання"
          date={period.fromDate}
          time={period.fromTime}
          min={today}
          onDate={(v) => {
            // разом з отриманням зсуваємо й повернення, щоб термін не змінився
            const shift = toMinutes(v, period.fromTime) - toMinutes(period.fromDate, period.fromTime);
            const end = fromMinutes(toMinutes(period.toDate, period.toTime) + shift);
            setPeriod({ ...period, fromDate: v, toDate: end.date });
          }}
          onTime={(v) => update({ fromTime: v })}
        />
        <Slot max={maxDate} title="Повернення" date={period.toDate} time={period.toTime} min={period.fromDate} onDate={(v) => update({ toDate: v })} onTime={(v) => update({ toTime: v })} />
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        {QUICK.map((q) => {
          const on = Math.round(hours) === q.hours;
          return (
            <button
              key={q.label}
              type="button"
              onClick={() => quick(q.hours)}
              className={`h-9 shrink-0 rounded-full px-4 text-sm font-medium transition ${
                on ? "bg-foreground text-background" : "bg-background ring-1 ring-line hover:ring-foreground/40"
              }`}
            >
              {q.label}
            </button>
          );
        })}
      </div>

      <p className={`mt-3 text-sm ${error ? "text-danger" : "text-muted"}`} aria-live="polite">
        {error ?? (
          <>
            Термін: <b className="font-semibold text-foreground">{formatDuration(hours)}</b>
          </>
        )}
      </p>
    </div>
  );
}

function Slot({
  title,
  date,
  time,
  onDate,
  onTime,
  min,
  max,
}: {
  title: string;
  date: string;
  time: string;
  onDate: (v: string) => void;
  onTime: (v: string) => void;
  min: string;
  max: string;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-1.5 text-sm font-medium text-muted">{title}</legend>
      <div className="grid grid-cols-[minmax(0,1fr)_6.5rem] gap-2">
        <input type="date" className="field min-w-0" value={date} min={min} max={max} onChange={(e) => e.target.value && onDate(e.target.value)} aria-label={`${title}: дата`} />
        <select className="field min-w-0" value={time} onChange={(e) => onTime(e.target.value)} aria-label={`${title}: час`}>
          {timeSlots.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
    </fieldset>
  );
}
