"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import {
  LayoutDashboard,
  Calendar,
  TrendingUp,
  BarChart3,
  Trophy,
  Dribbble,
  CircleDot,
  Volleyball,
  Swords,
  Gamepad2,
  Hash,
  Star,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { key: "feed", href: "/feed", icon: LayoutDashboard },
  { key: "matches", href: "/matches", icon: Calendar },
  { key: "predictions", href: "/predictions", icon: TrendingUp },
  { key: "analytics", href: "/analytics", icon: BarChart3 },
  { key: "leaderboard", href: "/leaderboard", icon: Trophy },
] as const;

const SPORTS = [
  { key: "football", icon: Dribbble },
  { key: "basketball", icon: CircleDot },
  { key: "tennis", icon: Volleyball },
  { key: "esports", icon: Gamepad2 },
  { key: "mma", icon: Swords },
] as const;

const TRENDING_TAGS = [
  "premierleague",
  "championsleague",
  "qarabag",
  "neftchi",
  "laliga",
  "seriea",
  "nba",
  "ufc",
] as const;

export default function Sidebar() {
  const t = useTranslations("sidebar");
  const pathname = usePathname();

  const [sportsExpanded, setSportsExpanded] = useState(true);
  const [tagsExpanded, setTagsExpanded] = useState(true);

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 bg-dark-900 border-r border-dark-700 overflow-y-auto scrollbar-thin scrollbar-thumb-dark-700 scrollbar-track-transparent">
      {/* Main navigation */}
      <nav className="px-3 py-4">
        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          {t("sections.main")}
        </p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary-400 bg-primary-500/10"
                      : "text-gray-400 hover:text-white hover:bg-dark-800"
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  <span>{t(`nav.${item.key}`)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mx-3 border-t border-dark-700" />

      {/* Sport filters */}
      <div className="px-3 py-4">
        <button
          onClick={() => setSportsExpanded(!sportsExpanded)}
          className="flex w-full items-center justify-between px-3 mb-2"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            {t("sections.sports")}
          </p>
          {sportsExpanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
          )}
        </button>

        <ul
          className={cn(
            "space-y-0.5 overflow-hidden transition-all duration-200",
            sportsExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          {SPORTS.map((sport) => {
            const Icon = sport.icon;
            const sportPath = `/matches?sport=${sport.key}`;
            return (
              <li key={sport.key}>
                <Link
                  href={sportPath}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-dark-800 transition-colors"
                >
                  <Icon className="h-[18px] w-[18px]" />
                  <span>{t(`sports.${sport.key}`)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mx-3 border-t border-dark-700" />

      {/* Editor's Picks */}
      <div className="px-3 py-4">
        <div className="flex items-center gap-2 px-3 mb-3">
          <Star className="h-3.5 w-3.5 text-yellow-500" />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            {t("sections.editorsPicks")}
          </p>
        </div>

        <div className="mx-3 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-lg bg-dark-800 border border-dark-700 p-3 animate-pulse"
            >
              <div className="h-3 w-3/4 rounded bg-dark-700" />
              <div className="mt-2 h-2 w-1/2 rounded bg-dark-700" />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-3 border-t border-dark-700" />

      {/* Trending tags */}
      <div className="px-3 py-4">
        <button
          onClick={() => setTagsExpanded(!tagsExpanded)}
          className="flex w-full items-center justify-between px-3 mb-3"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            {t("sections.trending")}
          </p>
          {tagsExpanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
          )}
        </button>

        <div
          className={cn(
            "px-3 flex flex-wrap gap-1.5 overflow-hidden transition-all duration-200",
            tagsExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          {TRENDING_TAGS.map((tag) => (
            <Link
              key={tag}
              href={`/search?tag=${tag}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-dark-800 border border-dark-700 text-gray-400 hover:text-primary-400 hover:border-primary-500/30 transition-colors"
            >
              <Hash className="h-3 w-3" />
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
