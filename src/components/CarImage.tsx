"use client";

import { useState } from "react";
import { CarSilhouette } from "./icons";

// Фото авто; якщо файлу ще немає — акуратний силует замість «битої» картинки
export function CarImage({ src, alt, className = "", priority }: { src?: string; alt: string; className?: string; priority?: boolean }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div className={`flex items-center justify-center bg-[#141416] text-[#2c2c31] ${className}`}>
        <CarSilhouette />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      onError={() => setBroken(true)}
      // фото могло «впасти» ще до того, як сторінка ожила в браузері — перевіряємо одразу
      ref={(el) => {
        if (el?.complete && el.naturalWidth === 0) setBroken(true);
      }}
      className={`object-cover ${className}`}
    />
  );
}
