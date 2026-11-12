import Link from "next/link";

const navigation = [
  { href: "/", label: "Dashboard" },
  { href: "/courses", label: "Khóa học" },
  { href: "/interview", label: "Phỏng vấn Java" },
  { href: "/problems", label: "Giải thuật 150" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur dark:bg-slate-900/95 dark:border-slate-800">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-semibold tracking-tight text-slate-950 dark:text-slate-100 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-500"
        >
          <img src="/brand-icon.svg" alt="" aria-hidden="true" className="mr-2 inline-block size-8 align-middle" />
          <span className="align-middle">QuantaVault</span>
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="flex items-center gap-1 sm:gap-2">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
