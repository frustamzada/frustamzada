"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import type { MatchWithOdds } from "@/types";

interface OddsComparisonTableProps {
  match: MatchWithOdds;
}

type OddsCategory = "home" | "draw" | "away";

export default function OddsComparisonTable({
  match,
}: OddsComparisonTableProps) {
  const t = useTranslations("matches");

  const misliOdds: Record<OddsCategory, number | null | undefined> = {
    home: match.oddsMisliHome,
    draw: match.oddsMisliDraw,
    away: match.oddsMisliAway,
  };

  const topazOdds: Record<OddsCategory, number | null | undefined> = {
    home: match.oddsTopazHome,
    draw: match.oddsTopazDraw,
    away: match.oddsTopazAway,
  };

  const categories: { key: OddsCategory; label: string }[] = [
    { key: "home", label: `1 - ${match.homeTeam}` },
    { key: "draw", label: `X - ${t("odds.draw")}` },
    { key: "away", label: `2 - ${match.awayTeam}` },
  ];

  function getBetterBookmaker(
    category: OddsCategory
  ): "misli" | "topaz" | "equal" | "none" {
    const m = misliOdds[category];
    const tp = topazOdds[category];
    if (m == null && tp == null) return "none";
    if (m == null) return "topaz";
    if (tp == null) return "misli";
    if (m > tp) return "misli";
    if (tp > m) return "topaz";
    return "equal";
  }

  const hasAnyOdds =
    misliOdds.home != null ||
    misliOdds.draw != null ||
    misliOdds.away != null ||
    topazOdds.home != null ||
    topazOdds.draw != null ||
    topazOdds.away != null;

  if (!hasAnyOdds) {
    return (
      <div className="rounded-xl bg-dark-800 border border-dark-700 p-6 text-center">
        <p className="text-sm text-gray-500">{t("odds.notAvailable")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-dark-800 border border-dark-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-dark-700">
        <h3 className="text-sm font-semibold text-white">
          {t("odds.comparison")}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {t("odds.bestHighlighted")}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("odds.market")}
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="inline-flex items-center gap-1">
                  Misli.az
                </span>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="inline-flex items-center gap-1">
                  Topaz
                </span>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("odds.best")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {categories.map((cat) => {
              const better = getBetterBookmaker(cat.key);
              const misliVal = misliOdds[cat.key];
              const topazVal = topazOdds[cat.key];

              return (
                <tr
                  key={cat.key}
                  className="hover:bg-dark-750 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-300 font-medium">
                    {cat.label}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {misliVal != null ? (
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-md font-semibold tabular-nums",
                          better === "misli"
                            ? "bg-green-500/10 text-green-400 ring-1 ring-green-500/20"
                            : "text-gray-300"
                        )}
                      >
                        {misliVal.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-600">
                        <Minus className="h-4 w-4 mx-auto" />
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {topazVal != null ? (
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-md font-semibold tabular-nums",
                          better === "topaz"
                            ? "bg-green-500/10 text-green-400 ring-1 ring-green-500/20"
                            : "text-gray-300"
                        )}
                      >
                        {topazVal.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-600">
                        <Minus className="h-4 w-4 mx-auto" />
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {better === "misli" && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-400">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        Misli.az
                      </span>
                    )}
                    {better === "topaz" && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-400">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        Topaz
                      </span>
                    )}
                    {better === "equal" && (
                      <span className="text-xs text-gray-500">
                        {t("odds.equal")}
                      </span>
                    )}
                    {better === "none" && (
                      <span className="text-gray-600">
                        <Minus className="h-4 w-4 mx-auto" />
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
