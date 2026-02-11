"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  ChevronDown,
  Loader2,
  Crown,
  Send,
  Plus,
  Trash2,
  X,
  Layers,
} from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import type { MatchWithOdds, PredictionType } from "@/types";

interface CouponMatchEntry {
  id: string;
  match: MatchWithOdds;
  predictionType: PredictionType | "";
  prediction: string;
  odds: string;
}

interface CouponFormProps {
  matches?: MatchWithOdds[];
  predictionTypes?: PredictionType[];
  isCollaborator?: boolean;
  isSubmitting?: boolean;
  onSubmit?: (data: {
    title: string;
    matches: {
      matchId: string;
      predictionType: PredictionType;
      prediction: string;
      odds: number | null;
    }[];
    confidence: number;
    reasoning: string;
    isPremium: boolean;
  }) => void;
}

let entryCounter = 0;

export default function CouponForm({
  matches = [],
  predictionTypes = [],
  isCollaborator = false,
  isSubmitting = false,
  onSubmit,
}: CouponFormProps) {
  const t = useTranslations("predictions");

  const [title, setTitle] = useState("");
  const [couponMatches, setCouponMatches] = useState<CouponMatchEntry[]>([]);
  const [confidence, setConfidence] = useState(5);
  const [reasoning, setReasoning] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  // Match selector state
  const [addingMatch, setAddingMatch] = useState(false);
  const [matchSearch, setMatchSearch] = useState("");
  const [matchDropdownOpen, setMatchDropdownOpen] = useState(false);

  const filteredMatches = useMemo(() => {
    const selectedIds = new Set(couponMatches.map((cm) => cm.match.id));
    const available = matches.filter((m) => !selectedIds.has(m.id));
    if (!matchSearch.trim()) return available.slice(0, 20);
    const q = matchSearch.toLowerCase();
    return available.filter(
      (m) =>
        m.homeTeam.toLowerCase().includes(q) ||
        m.awayTeam.toLowerCase().includes(q) ||
        m.league.toLowerCase().includes(q)
    );
  }, [matches, couponMatches, matchSearch]);

  const totalOdds = useMemo(() => {
    const oddsValues = couponMatches
      .map((cm) => parseFloat(cm.odds))
      .filter((v) => !isNaN(v) && v > 0);
    if (oddsValues.length === 0) return null;
    return oddsValues.reduce((acc, v) => acc * v, 1);
  }, [couponMatches]);

  const addMatch = (match: MatchWithOdds) => {
    entryCounter++;
    setCouponMatches((prev) => [
      ...prev,
      {
        id: `entry-${entryCounter}`,
        match,
        predictionType: "",
        prediction: "",
        odds: "",
      },
    ]);
    setMatchSearch("");
    setMatchDropdownOpen(false);
    setAddingMatch(false);
  };

  const removeMatch = (entryId: string) => {
    setCouponMatches((prev) => prev.filter((cm) => cm.id !== entryId));
  };

  const updateMatch = (
    entryId: string,
    field: keyof CouponMatchEntry,
    value: string
  ) => {
    setCouponMatches((prev) =>
      prev.map((cm) => (cm.id === entryId ? { ...cm, [field]: value } : cm))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || couponMatches.length < 2) return;

    const validMatches = couponMatches.filter(
      (cm) => cm.predictionType && cm.prediction.trim()
    );
    if (validMatches.length < 2) return;

    onSubmit?.({
      title: title.trim(),
      matches: validMatches.map((cm) => ({
        matchId: cm.match.id,
        predictionType: cm.predictionType as PredictionType,
        prediction: cm.prediction.trim(),
        odds: cm.odds ? parseFloat(cm.odds) || null : null,
      })),
      confidence,
      reasoning: reasoning.trim(),
      isPremium,
    });
  };

  const validEntries = couponMatches.filter(
    (cm) => cm.predictionType && cm.prediction.trim()
  );
  const isValid = title.trim() && validEntries.length >= 2;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("couponForm.title")} <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("couponForm.titlePlaceholder")}
          className="w-full px-4 py-2.5 rounded-lg bg-dark-700 border border-dark-600 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Match Predictions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-300">
            {t("couponForm.matches")} <span className="text-red-400">*</span>
            <span className="text-xs text-gray-500 ml-2">
              ({t("couponForm.minMatches")})
            </span>
          </label>
          {totalOdds != null && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">
                {t("totalOdds")}:
              </span>
              <span className="text-sm font-bold text-primary-400 tabular-nums">
                {totalOdds.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Existing match entries */}
        <div className="space-y-3">
          {couponMatches.map((entry, idx) => (
            <div
              key={entry.id}
              className="rounded-lg bg-dark-700 border border-dark-600 overflow-hidden"
            >
              {/* Match header */}
              <div className="flex items-center justify-between px-3 py-2 bg-dark-750 border-b border-dark-600">
                <div className="min-w-0">
                  <div className="text-[11px] text-gray-500">
                    #{idx + 1} &middot; {entry.match.league}
                  </div>
                  <div className="text-sm text-gray-200 font-medium">
                    {entry.match.homeTeam}{" "}
                    <span className="text-gray-600">vs</span>{" "}
                    {entry.match.awayTeam}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeMatch(entry.id)}
                  className="p-1.5 rounded text-gray-500 hover:text-red-400 hover:bg-dark-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Prediction fields */}
              <div className="p-3 space-y-2">
                {/* Prediction type radio buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {predictionTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        updateMatch(entry.id, "predictionType", type)
                      }
                      className={cn(
                        "px-2.5 py-1 rounded text-[11px] font-medium border transition-all",
                        entry.predictionType === type
                          ? "bg-primary-600 border-primary-500 text-white"
                          : "bg-dark-800 border-dark-600 text-gray-500 hover:text-white hover:border-dark-500"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={entry.prediction}
                    onChange={(e) =>
                      updateMatch(entry.id, "prediction", e.target.value)
                    }
                    placeholder={t("form.predictionPlaceholder")}
                    className="flex-1 px-3 py-1.5 rounded bg-dark-800 border border-dark-600 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
                  />
                  <input
                    type="text"
                    value={entry.odds}
                    onChange={(e) =>
                      updateMatch(entry.id, "odds", e.target.value)
                    }
                    placeholder={t("form.oddsPlaceholder")}
                    className="w-20 px-3 py-1.5 rounded bg-dark-800 border border-dark-600 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all tabular-nums text-center"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add match button / search */}
        {addingMatch ? (
          <div className="mt-3 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={matchSearch}
                onChange={(e) => {
                  setMatchSearch(e.target.value);
                  setMatchDropdownOpen(true);
                }}
                onFocus={() => setMatchDropdownOpen(true)}
                placeholder={t("form.searchMatch")}
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-dark-700 border border-dark-600 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  setAddingMatch(false);
                  setMatchSearch("");
                  setMatchDropdownOpen(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {matchDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => {
                    setMatchDropdownOpen(false);
                    setAddingMatch(false);
                  }}
                />
                <div className="absolute z-40 mt-1 w-full max-h-48 overflow-y-auto rounded-lg bg-dark-700 border border-dark-600 shadow-xl">
                  {filteredMatches.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      {t("form.noMatchesFound")}
                    </div>
                  ) : (
                    filteredMatches.map((match) => (
                      <button
                        key={match.id}
                        type="button"
                        onClick={() => addMatch(match)}
                        className="w-full text-left px-4 py-2.5 hover:bg-dark-600 transition-colors border-b border-dark-600 last:border-0"
                      >
                        <div className="text-[11px] text-gray-500">
                          {match.league}
                        </div>
                        <div className="text-sm text-gray-200">
                          {match.homeTeam}{" "}
                          <span className="text-gray-600">vs</span>{" "}
                          {match.awayTeam}
                        </div>
                        <div className="text-[11px] text-gray-500 tabular-nums">
                          {formatTime(match.matchDate)}
                          {match.isLive && (
                            <span className="ml-2 text-red-400 font-bold">
                              LIVE
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddingMatch(true)}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-dark-600 text-sm text-gray-500 hover:text-primary-400 hover:border-primary-500/30 transition-all"
          >
            <Plus className="h-4 w-4" />
            {t("couponForm.addMatch")}
          </button>
        )}
      </div>

      {/* Running Total Odds display */}
      {couponMatches.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-dark-700 border border-dark-600">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary-400" />
            <span className="text-sm text-gray-300">
              {t("couponForm.totalOdds")}
            </span>
          </div>
          <span className="text-lg font-bold text-white tabular-nums">
            {totalOdds != null ? totalOdds.toFixed(2) : "—"}
          </span>
        </div>
      )}

      {/* Confidence Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-300">
            {t("form.confidence")}
          </label>
          <span
            className={cn(
              "text-sm font-bold tabular-nums",
              confidence >= 8
                ? "text-green-400"
                : confidence >= 5
                  ? "text-yellow-400"
                  : "text-red-400"
            )}
          >
            {confidence}/10
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-dark-700 accent-primary-500"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-600">{t("form.low")}</span>
          <span className="text-[10px] text-gray-600">{t("form.high")}</span>
        </div>
      </div>

      {/* Reasoning */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("form.reasoning")}
        </label>
        <textarea
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          placeholder={t("form.reasoningPlaceholder")}
          rows={4}
          className="w-full px-4 py-2.5 rounded-lg bg-dark-700 border border-dark-600 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
        />
      </div>

      {/* Premium Toggle */}
      {isCollaborator && (
        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-dark-700 border border-dark-600">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-400" />
            <div>
              <span className="text-sm font-medium text-white">
                {t("form.premiumPrediction")}
              </span>
              <p className="text-xs text-gray-500">
                {t("form.premiumDescription")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPremium(!isPremium)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              isPremium ? "bg-amber-500" : "bg-dark-600"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                isPremium ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all",
          isValid && !isSubmitting
            ? "bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-600/20"
            : "bg-dark-700 text-gray-500 cursor-not-allowed"
        )}
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {isSubmitting ? t("form.submitting") : t("couponForm.submitCoupon")}
      </button>
    </form>
  );
}
