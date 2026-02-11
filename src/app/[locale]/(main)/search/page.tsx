"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Search, Trophy, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const mockMatches = [
  { id: "1", homeTeam: "Qarabag FK", awayTeam: "Neftchi PFK", league: "Azerbaijan Premier League", matchDate: "2025-02-07" },
  { id: "2", homeTeam: "Real Madrid", awayTeam: "Manchester City", league: "UEFA Champions League", matchDate: "2025-02-08" },
  { id: "3", homeTeam: "Arsenal", awayTeam: "Liverpool", league: "English Premier League", matchDate: "2025-02-06" },
];

const mockUsers = [
  { id: "1", name: "PredictPro Admin", badge: "MASTER", successRate: 70.0, role: "ADMIN" },
  { id: "2", name: "Rashad Aliyev", badge: "EXPERT", successRate: 65.0, role: "COLLABORATOR" },
  { id: "3", name: "Elvin Mammadov", badge: "EXPERT", successRate: 66.7, role: "ADMIN" },
];

const mockPredictions = [
  { id: "1", match: "Qarabag FK vs Neftchi PFK", prediction: "HOME @ 1.65", user: "PredictPro Admin", status: "PENDING" },
  { id: "2", match: "Real Madrid vs Manchester City", prediction: "OVER 2.5 @ 1.85", user: "Rashad Aliyev", status: "PENDING" },
];

export default function SearchPage() {
  const t = useTranslations("search");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "matches" | "users" | "predictions">("all");

  const q = query.toLowerCase();
  const filteredMatches = mockMatches.filter((m) =>
    m.homeTeam.toLowerCase().includes(q) || m.awayTeam.toLowerCase().includes(q) || m.league.toLowerCase().includes(q)
  );
  const filteredUsers = mockUsers.filter((u) => u.name.toLowerCase().includes(q));
  const filteredPredictions = mockPredictions.filter((p) =>
    p.match.toLowerCase().includes(q) || p.user.toLowerCase().includes(q)
  );

  const tabs = [
    { key: "all" as const, label: t("title") },
    { key: "matches" as const, label: t("matches") },
    { key: "users" as const, label: t("users") },
    { key: "predictions" as const, label: t("predictions") },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("placeholder")}
          className="input-field pl-10 py-3"
          autoFocus
        />
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === tab.key ? "bg-primary-600 text-white" : "bg-dark-800 text-dark-400 hover:text-dark-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {query.length > 0 ? (
        <div className="space-y-6">
          {(activeTab === "all" || activeTab === "matches") && filteredMatches.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-dark-400 mb-3">{t("matches")}</h2>
              <div className="space-y-2">
                {filteredMatches.map((match) => (
                  <Link key={match.id} href={`/matches/${match.id}`}>
                    <div className="card-hover p-4">
                      <div className="text-xs text-dark-400 mb-1">{match.league}</div>
                      <div className="font-medium">{match.homeTeam} vs {match.awayTeam}</div>
                      <div className="text-xs text-dark-500 mt-1">{match.matchDate}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(activeTab === "all" || activeTab === "users") && filteredUsers.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-dark-400 mb-3">{t("users")}</h2>
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <Link key={user.id} href={`/profile/${user.id}`}>
                    <div className="card-hover p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.name}</span>
                          {user.role === "ADMIN" && <span className="text-xs bg-primary-900/50 text-primary-400 px-1.5 py-0.5 rounded">Editor</span>}
                        </div>
                        <span className="text-sm text-dark-400">{user.successRate}% success rate</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(activeTab === "all" || activeTab === "predictions") && filteredPredictions.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-dark-400 mb-3">{t("predictions")}</h2>
              <div className="space-y-2">
                {filteredPredictions.map((pred) => (
                  <Link key={pred.id} href={`/predictions/${pred.id}`}>
                    <div className="card-hover p-4">
                      <div className="text-sm font-medium">{pred.match}</div>
                      <div className="text-sm text-primary-400">{pred.prediction}</div>
                      <div className="text-xs text-dark-500 mt-1">by {pred.user}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {filteredMatches.length === 0 && filteredUsers.length === 0 && filteredPredictions.length === 0 && (
            <div className="text-center py-12 text-dark-400">{t("noResults")}</div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-dark-400">
          <Search className="w-12 h-12 mx-auto mb-3 text-dark-600" />
          <p>{t("placeholder")}</p>
        </div>
      )}
    </div>
  );
}
