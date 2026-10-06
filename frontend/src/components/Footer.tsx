"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Radio,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const linkGroups = [
  {
    title: "Platform",
    links: [
      { label: "Overview", href: "/" },
      { label: "Features", href: "/features" },
      { label: "Built for every role", href: "/about" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "About DeliveryOS", href: "/about" },
      { label: "Product overview", href: "/" },
      { label: "All platform features", href: "/features" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Built for every role", href: "/about" },
      { label: "See what we do", href: "/about" },
      { label: "Back to the top", href: "/home#top" },
    ],
  },
];

const technologies = ["Next.js", "NestJS", "PostgreSQL", "Redis", "WebSockets"];

const routeNodes = [
  { cx: 52, cy: 118, delay: 0 },
  { cx: 146, cy: 72, delay: 0.5 },
  { cx: 233, cy: 124, delay: 1 },
  { cx: 326, cy: 58, delay: 1.5 },
  { cx: 422, cy: 106, delay: 2 },
  { cx: 510, cy: 52, delay: 2.5 },
];

export default function Footer() {
  const reduceMotion = useReducedMotion();
  const enter = reduceMotion ? false : { opacity: 0, y: 24 };

  return (
    <footer className="relative isolate overflow-hidden bg-[#070B20] text-white">
     
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8B6BFF] to-transparent" />

      <div className="mx-auto max-w-7xl px-4 pb-6 pt-14 sm:px-6 sm:pt-20 lg:px-8">
 

        <div className="grid gap-12 border-b border-white/[0.09] pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)] lg:gap-10">
          <motion.div
            initial={enter}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <Link href="/home" className="group inline-flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A694FF]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#A694FF]/20 bg-gradient-to-br from-[#7658F6]/20 to-[#506DFF]/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                <Truck className="h-5 w-5 text-[#B7A8FF] transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
              </span>
              <span className="text-2xl font-semibold tracking-tight">
                Delivery<span className="text-[#9B85FF]">OS</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#AAB3D4]">
              One connected command center for orders, fleets and teams. Track in real time, dispatch intelligently and keep every delivery moving.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {technologies.map((technology) => (
                <span key={technology} className="rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-1.5 text-[11px] font-medium tracking-wide text-[#BCC5E4] transition duration-300 hover:-translate-y-0.5 hover:border-[#8B6BFF]/40 hover:bg-[#7658F6]/10 hover:text-white">
                  {technology}
                </span>
              ))}
            </div>
          </motion.div>

          {linkGroups.map((group, groupIndex) => (
            <motion.nav
              key={group.title}
              aria-label={group.title}
              initial={enter}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: groupIndex * 0.08 }}
            >
              <h3 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8C97C0]">
                {groupIndex === 0 ? <Zap className="h-3.5 w-3.5 text-[#A694FF]" aria-hidden /> : null}
                {group.title}
              </h3>
              <ul className="flex flex-col gap-3.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-[#B8C1E0] transition-colors duration-200 hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A694FF]"
                    >
                      <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-[#9B85FF] opacity-0 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                      <span className="-ml-5 transition-transform duration-200 group-hover:translate-x-5">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}
        </div>


        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/[0.09] pt-6 text-center text-xs text-[#8F99BC] sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} DeliveryOS. Built for deliveries in motion.</p>
          <p className="inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#9B85FF]" aria-hidden />
            Real-time logistics, made beautifully simple.
          </p>
          <Link
            href="/home#top"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2.5 font-medium text-white/85 transition duration-300 hover:-translate-y-0.5 hover:border-[#9B85FF]/40 hover:bg-[#7658F6]/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A694FF]"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </footer>
  );
}
