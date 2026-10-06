"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Truck } from "lucide-react";
import { useRef } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Demo", href: "/demo" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);

  const closeMenu = () => {
    if (menu.current) menu.current.open = false;
  };

  // Home sirf "/" par active, baaki /about, /about/team jaise nested routes par bhi
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-gradient-to-r from-[#0A0F2C]/95 via-[#1A1F5C]/95 to-[#0A0F2C]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_40px_-12px_rgba(91,140,255,0.45)] backdrop-blur-2xl after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-[#5B8CFF] after:to-transparent">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 text-white sm:px-6 sm:py-5" aria-label="Main">
        <Link href="/" onClick={closeMenu} className="group flex items-center gap-2.5 text-xl font-semibold sm:text-2xl">
          <Truck className="h-7 w-7 text-[#8B6BFF] transition-transform duration-500 group-hover:translate-x-1 group-hover:-rotate-6" aria-hidden />
          <span>
            Delivery<span className="text-[#8B6BFF]">OS</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 text-sm md:flex">
          {navLinks.map((l) => {
            const active = isActive(l.href);
            return (
              <li key={l.label}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative py-1.5 transition-colors ${active ? "text-[#8B6BFF]" : "text-white/80 hover:text-white"}`}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-0.5 rounded bg-[#8B6BFF] transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="rounded-lg border border-white/30 px-5 py-2.5 text-sm font-medium transition hover:border-white/60 hover:bg-white/10">
            Login
          </Link>
          <Link
            href="/register"
            className="btn-shine rounded-lg bg-[#6C4DF6] px-5 py-2.5 text-sm font-medium shadow-lg shadow-[#6C4DF6]/30 transition hover:-translate-y-0.5 hover:bg-[#5A3DE0] hover:shadow-[#6C4DF6]/50"
          >
            Get Started
          </Link>
        </div>

        <details ref={menu} className="group relative md:hidden">
          <summary
            aria-label="Open menu"
            className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-lg border border-white/30 transition active:scale-95 [&::-webkit-details-marker]:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </summary>
          <div className="absolute right-0 mt-2 flex w-60 origin-top-right flex-col gap-1 rounded-2xl border border-white/10 bg-[#0A1030]/95 p-3 shadow-2xl backdrop-blur-xl">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={closeMenu}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-2.5 text-sm transition hover:bg-white/10 hover:pl-4 ${
                  isActive(l.href) ? "bg-white/10 text-[#B5A3FF]" : ""
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/login" onClick={closeMenu} className="rounded-lg px-3 py-2.5 text-sm hover:bg-white/10">
              Login
            </Link>
            <Link href="/register" onClick={closeMenu} className="mt-1 rounded-lg bg-[#6C4DF6] px-3 py-2.5 text-center text-sm font-medium">
              Get Started
            </Link>
          </div>
        </details>
      </nav>
    </header>
  );
}