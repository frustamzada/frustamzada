import { Link } from "@/i18n/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <header className="border-b border-dark-800 p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/feed" className="text-xl font-bold text-primary-500">
            PredictPro
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="p-4 text-center text-xs text-dark-500">
        <p>
          Bu platforma yalnız təhlil təqdim edir. Biz mərc prosesini
          asanlaşdırmırıq. İstifadəçilər 18+ yaşında olmalıdır.
        </p>
      </footer>
    </div>
  );
}
