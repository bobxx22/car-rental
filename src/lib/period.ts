"use client";

// Обраний гостем період оренди. Спільний для головної і сторінки авто,
// зберігається в браузері — щоб не вводити дати двічі.

import { useSyncExternalStore } from "react";
import { defaultPeriod, kyivNowMinutes, toMinutes, type Period } from "./pricing";

const KEY = "rent-period";
let current: Period | null = null;
const listeners = new Set<() => void>();

function load(): Period {
  if (current) return current;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "null") as Period | null;
    // збережений період уже минув — починаємо з типового
    if (saved && toMinutes(saved.fromDate, saved.fromTime) > kyivNowMinutes()) return (current = saved);
  } catch {}
  return (current = defaultPeriod());
}

export function setPeriod(p: Period) {
  current = p;
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

// null — поки сторінка не відкрилась у браузері (дати залежать від «сьогодні»)
export const usePeriod = () => useSyncExternalStore(subscribe, load, () => null);
