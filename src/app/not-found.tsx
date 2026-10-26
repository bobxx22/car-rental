import Link from "next/link";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <p className="font-display text-7xl font-bold">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold">Такої сторінки немає</h1>
        <p className="mt-3 text-muted">Можливо, цього авто вже немає в автопарку.</p>
        <Link href="/#fleet" className="mt-8 rounded-2xl bg-accent px-6 py-4 font-semibold text-black">
          Переглянути автопарк
        </Link>
      </main>
    </>
  );
}
