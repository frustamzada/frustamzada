"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Clock, Trophy, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils";
import type { MatchWithOdds } from "@/types";

interface MatchCardProps {
  match: MatchWithOdds;
}

export default function MatchCard({ match }: MatchCardProps) {
  const t = useTranslations("matches");

  const matchDate = new Date(match.matchDate);
  const isToday =
    new Date().toDateString() === matchDate.toDateString();

  return (
    <Link
      href={`/matches/${match.id}`}
      className="block rounded-xl bg-dark-800 border border-dark-700 hover:border-dark-600 transition-all duration-200 hover:shadow-lg hover:shadow-dark-900/50"
    >
      {/* League header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-dark-700">
        <div className="flex items-center gap-2">
          <Trophy className="h-3.5 w-3.5 text-primary-400" />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            {match.league}
          </span>
        </div>
        <span className="text-xs text-gray-500">{match.sport}</span>
      </div>

      {/* Match body */}
      <div className="px-4 py-3">
        {/* Teams & Score/Time */}
        <div className="flex items-center justify-between gap-3">
          {/* Home team */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {match.homeTeamLogo && (
                <img
                  src={match.homeTeamLogo}
                  alt={match.homeTeam}
                  className="h-6 w-6 rounded-full object-cover"
                />
              )}
              <span className="text-sm font-semibold text-white truncate">
                {match.homeTeam}
              </span>
            </div>
          </div>

          {/* Score or Time */}
          <div className="flex flex-col items-center shrink-0 px-3">
            {match.isLive ? (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  <span className="text-[10px] font-bold uppercase text-red-400 tracking-wider">
                    {t("live")}
                  </span>
                </div>
                <span className="text-lg font-bold text-white tabular-nums">
                  {match.homeScore ?? 0} - {match.awayScore ?? 0}
                </span>
              </div>
            ) : match.isFinished ? (
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium uppercase text-gray-500 tracking-wider">
                  {t("finished")}
                </span>
                <span className="text-lg font-bold text-gray-400 tabular-nums">
                  {match.homeScore ?? 0} - {match.awayScore ?? 0}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-sm font-semibold text-gray-300 tabular-nums">
                  {formatTime(match.matchDate)}
                </span>
                {!isToday && (
                  <span className="text-[10px] text-gray-500">
                    {matchDate.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Away team */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-end gap-2">
              <span className="text-sm font-semibold text-white truncate">
                {match.awayTeam}
              </span>
              {match.awayTeamLogo && (
                <img
                  src={match.awayTeamLogo}
                  alt={match.awayTeam}
                  className="h-6 w-6 rounded-full object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* Odds comparison row */}
        {(match.oddsMisliHome != null || match.oddsTopazHome != null) && (
          <div className="mt-3 pt-3 border-t border-dark-700">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {/* Misli.az */}
              {match.oddsMisliHome != null && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500 font-medium w-10 shrink-0">
                    Misli
                  </span>
                  <div className="flex gap-1 flex-1">
                    <span className="flex-1 text-center py-1 rounded bg-dark-700 text-gray-300 font-medium tabular-nums">
                      {match.oddsMisliHome?.toFixed(2)}
                    </span>
                    {match.oddsMisliDraw != null && (
                      <span className="flex-1 text-center py-1 rounded bg-dark-700 text-gray-300 font-medium tabular-nums">
                        {match.oddsMisliDraw.toFixed(2)}
                      </span>
                    )}
                    <span className="flex-1 text-center py-1 rounded bg-dark-700 text-gray-300 font-medium tabular-nums">
                      {match.oddsMisliAway?.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Topaz */}
              {match.oddsTopazHome != null && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500 font-medium w-10 shrink-0">
                    Topaz
                  </span>
                  <div className="flex gap-1 flex-1">
                    <span className="flex-1 text-center py-1 rounded bg-dark-700 text-gray-300 font-medium tabular-nums">
                      {match.oddsTopazHome?.toFixed(2)}
                    </span>
                    {match.oddsTopazDraw != null && (
                      <span className="flex-1 text-center py-1 rounded bg-dark-700 text-gray-300 font-medium tabular-nums">
                        {match.oddsTopazDraw.toFixed(2)}
                      </span>
                    )}
                    <span className="flex-1 text-center py-1 rounded bg-dark-700 text-gray-300 font-medium tabular-nums">
                      {match.oddsTopazAway?.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
