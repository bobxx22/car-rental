type P = { className?: string };
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const Seat = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="7" r="3" />
    <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
  </svg>
);
export const Gear = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <circle cx="6" cy="6" r="2" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="6" r="2" />
    <path d="M6 8v8M18 8v4H6" />
  </svg>
);
export const FuelIcon = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M4 10h10M14 8l3 2v7a1.5 1.5 0 0 0 3 0V9l-3-3" />
  </svg>
);
export const Bag = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <rect x="5" y="7" width="14" height="13" rx="2" />
    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
export const Phone = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);
export const Arrow = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const Back = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
export const Check = ({ className = "size-4" }: P) => (
  <svg {...base} strokeWidth={2.4} className={className}>
    <path d="M5 12.5 10 17 19 7" />
  </svg>
);
export const Pin = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);
export const Clock = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

// Знак прокату: жовтий квадрат зі стрілкою «вперед»
export const Mark = ({ className = "size-8" }: P) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden>
    <rect width="32" height="32" rx="9" fill="var(--accent)" />
    <path d="M9 22 17 10h6l-8 12z" fill="#0b0b0c" />
    <path d="M17 22l3-4.5h5L22 22z" fill="#0b0b0c" />
  </svg>
);

// Силует авто — поки немає фото
export const CarSilhouette = ({ className = "w-2/3" }: P) => (
  <svg viewBox="0 0 240 90" className={className} aria-hidden>
    <path
      d="M18 66c-6 0-10-4-10-9v-8c0-4 3-7 7-8l26-7 30-17c5-3 10-4 16-4h52c7 0 13 3 18 7l20 17 34 6c6 1 11 6 11 12v7c0 5-4 9-9 9h-11"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path d="M70 66h96" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <circle cx="52" cy="66" r="15" fill="none" stroke="currentColor" strokeWidth="4" />
    <circle cx="186" cy="66" r="15" fill="none" stroke="currentColor" strokeWidth="4" />
    <path d="M80 36 99 21c3-2 6-3 10-3h21v18zM140 18h21c5 0 9 2 12 5l13 13h-46z" fill="currentColor" opacity=".35" />
  </svg>
);

export const Bolt = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M13 3 5 13.5h6L10 21l8-10.5h-6z" />
  </svg>
);
export const Timer = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 13l3.5-3.5M10 2h4" />
  </svg>
);
export const Gauge = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M4.5 18a9 9 0 1 1 15 0" />
    <path d="M12 14l4-5" />
  </svg>
);
export const Engine = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M4 10v6M4 13h3M7 9h3V7h4v2h3l2 3v4l-2 2H9l-2-2V9z" />
  </svg>
);
