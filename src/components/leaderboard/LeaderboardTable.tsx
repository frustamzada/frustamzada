"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Trophy, TrendingUp, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { LeaderboardEntry } from "@/types";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

const badgeStyles: Record<string, string> = {
  BEGINNER: "badge-beginner",
  RISING_STAR: "badge-rising-star",
  EXPERT: "badge-expert",
  MASTER: "badge-master",
};

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  const t = useTranslations("leaderboard");
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("all");

  const periods = [
    { key: "7d" as const, label: t("last7Days") },
    { key: "30d" as const, label: t("last30Days") },
    { key: "all" as const, label: t("allTime") },
  ];

  return (
    <div>
      {/* Period filter */}
      <div className="flex gap-2 mb-6">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              period === p.key
                ? "bg-primary-600 text-white"
                : "bg-dark-800 text-dark-400 hover:text-dark-200"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Top 3 featured cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {entries.slice(0, 3).map((entry, index) => (
          <Link key={entry.id} href={`/profile/${entry.id}`}>
            <div
              className={cn(
                "card-hover text-center p-6 relative overflow-hidden",
                index === 0 && "border-yellow-500/30",
                index === 1 && "border-gray-400/30",
                index === 2 && "border-orange-500/30"
              )}
            >
              <div
                className={cn(
                  "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  index === 0
                    ? "bg-yellow-500/20 text-yellow-400"
                    : index === 1
                      ? "bg-gray-400/20 text-gray-300"
                      : "bg-orange-500/20 text-orange-400"
                )}
              >
                {index + 1}
              </div>

              <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center text-xl font-bold mx-auto mb-3">
                {entry.avatar ? (
                  <img
                    src={entry.avatar}
                    alt={entry.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  entry.name.charAt(0)
                )}
              </div>

              <h3 className="font-bold">{entry.name}</h3>
              <span className={cn("inline-block mt-1", badgeStyles[entry.badge])}>
                {t(`badges.${entry.badge.toLowerCase()}`)}
              </span>

              <div className="mt-4 text-2xl font-bold text-primary-400">
                {entry.successRate.toFixed(1)}%
              </div>
              <p className="text-xs text-dark-400 mt-1">
                {entry.wonPredictions}/{entry.totalPredictions} {t("won")}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Full table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700 text-dark-400 text-sm">
              <th className="text-left py-3 px-4">{t("rank")}</th>
              <th className="text-left py-3 px-4">{t("user")}</th>
              <th className="text-right py-3 px-4">{t("successRate")}</th>
              <th className="text-right py-3 px-4 hidden sm:table-cell">
                {t("totalPredictions")}
              </th>
              <th className="text-right py-3 px-4 hidden sm:table-cell">
                {t("won")}
              </th>
              <th className="text-right py-3 px-4 hidden sm:table-cell">
                {t("lost")}
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr
                key={entry.id}
                className="border-b border-dark-700/50 hover:bg-dark-800/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <span
                    className={cn(
                      "font-bold",
                      index < 3 ? "text-primary-400" : "text-dark-400"
                    )}
                  >
                    #{index + 1}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={`/profile/${entry.id}`}
                    className="flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {entry.avatar ? (
                        <img
                          src={entry.avatar}
                          alt={entry.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        entry.name.charAt(0)
                      )}
                    </div>
                    <span className="font-medium text-sm">{entry.name}</span>
                    <span className={badgeStyles[entry.badge]}>
                      {t(`badges.${entry.badge.toLowerCase()}`)}
                    </span>
                  </Link>
                </td>
                <td className="py-3 px-4 text-right">
                  <span
                    className={cn(
                      "font-bold",
                      entry.successRate >= 60
                        ? "text-win"
                        : entry.successRate >= 45
                          ? "text-pending"
                          : "text-loss"
                    )}
                  >
                    {entry.successRate.toFixed(1)}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-dark-300 hidden sm:table-cell">
                  {entry.totalPredictions}
                </td>
                <td className="py-3 px-4 text-right text-win hidden sm:table-cell">
                  {entry.wonPredictions}
                </td>
                <td className="py-3 px-4 text-right text-loss hidden sm:table-cell">
                  {entry.lostPredictions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
