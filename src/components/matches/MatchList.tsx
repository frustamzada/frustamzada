"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Calendar, Radio, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MatchWithOdds } from "@/types";
import MatchCard from "./MatchCard";

type FilterTab = "live" | "today" | "tomorrow" | "all";

interface MatchListProps {
  matches: MatchWithOdds[];
}

export default function MatchList({ matches }: MatchListProps) {
  const t = useTranslations("matches");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  const filteredMatches = useMemo(() => {
    switch (activeTab) {
      case "live":
        return matches.filter((m) => m.isLive);
      case "today":
        return matches.filter((m) => {
          const d = new Date(m.matchDate);
          return d >= today && d < tomorrow;
        });
      case "tomorrow":
        return matches.filter((m) => {
          const d = new Date(m.matchDate);
          return d >= tomorrow && d < dayAfterTomorrow;
        });
      case "all":
      default:
        return matches;
    }
  }, [matches, activeTab]);

  // Group matches by date
  const groupedMatches = useMemo(() => {
    const groups: Record<string, MatchWithOdds[]> = {};
    const sorted = [...filteredMatches].sort(
      (a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
    );

    for (const match of sorted) {
      const dateKey = new Date(match.matchDate).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(match);
    }

    return groups;
  }, [filteredMatches]);

  const liveCount = matches.filter((m) => m.isLive).length;

  const tabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: "live", label: t("filters.live"), count: liveCount },
    { key: "today", label: t("filters.today") },
    { key: "tomorrow", label: t("filters.tomorrow") },
    { key: "all", label: t("filters.all") },
  ];

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-dark-800 border border-dark-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === tab.key
                ? "bg-primary-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white hover:bg-dark-700"
            )}
          >
            {tab.key === "live" && (
              <span className="relative flex h-2 w-2">
                {liveCount > 0 && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                )}
                <span
                  className={cn(
                    "relative inline-flex h-2 w-2 rounded-full",
                    liveCount > 0 ? "bg-red-500" : "bg-gray-600"
                  )}
                />
              </span>
            )}
            {tab.label}
            {tab.count != null && tab.count > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Match groups */}
      {Object.keys(groupedMatches).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Inbox className="h-12 w-12 text-gray-600 mb-3" />
          <p className="text-gray-400 text-sm font-medium">
            {t("noMatches")}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {t("noMatchesDescription")}
          </p>
        </div>
      ) : (
        Object.entries(groupedMatches).map(([date, dateMatches]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-400">{date}</h3>
              <span className="text-xs text-gray-600">
                ({dateMatches.length})
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {dateMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
