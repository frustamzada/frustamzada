"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  ChevronDown,
  Loader2,
  Crown,
  Send,
  X,
} from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import type { MatchWithOdds, PredictionType } from "@/types";

interface PredictionFormProps {
  matches?: MatchWithOdds[];
  predictionTypes?: PredictionType[];
  isCollaborator?: boolean;
  isSubmitting?: boolean;
  onSubmit?: (data: {
    matchId: string;
    predictionType: PredictionType;
    prediction: string;
    confidence: number;
    reasoning: string;
    isPremium: boolean;
  }) => void;
}

export default function PredictionForm({
  matches = [],
  predictionTypes = [],
  isCollaborator = false,
  isSubmitting = false,
  onSubmit,
}: PredictionFormProps) {
  const t = useTranslations("predictions");

  const [matchSearch, setMatchSearch] = useState("");
  const [matchDropdownOpen, setMatchDropdownOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchWithOdds | null>(
    null
  );
  const [predictionType, setPredictionType] = useState<PredictionType | "">("");
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(5);
  const [reasoning, setReasoning] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  const filteredMatches = useMemo(() => {
    if (!matchSearch.trim()) return matches.slice(0, 20);
    const q = matchSearch.toLowerCase();
    return matches.filter(
      (m) =>
        m.homeTeam.toLowerCase().includes(q) ||
        m.awayTeam.toLowerCase().includes(q) ||
        m.league.toLowerCase().includes(q)
    );
  }, [matches, matchSearch]);

  const handleSelectMatch = (match: MatchWithOdds) => {
    setSelectedMatch(match);
    setMatchSearch("");
    setMatchDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch || !predictionType || !prediction.trim()) return;

    onSubmit?.({
      matchId: selectedMatch.id,
      predictionType: predictionType as PredictionType,
      prediction: prediction.trim(),
      confidence,
      reasoning: reasoning.trim(),
      isPremium,
    });
  };

  const isValid = selectedMatch && predictionType && prediction.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Match Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("form.selectMatch")} <span className="text-red-400">*</span>
        </label>

        {selectedMatch ? (
          <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-dark-700 border border-dark-600">
            <div>
              <div className="text-xs text-gray-500 mb-0.5">
                {selectedMatch.league}
              </div>
              <div className="text-sm font-medium text-white">
                {selectedMatch.homeTeam}{" "}
                <span className="text-gray-500">vs</span>{" "}
                {selectedMatch.awayTeam}
              </div>
              <div className="text-xs text-gray-500 mt-0.5 tabular-nums">
                {formatTime(selectedMatch.matchDate)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedMatch(null)}
              className="p-1 rounded text-gray-500 hover:text-white hover:bg-dark-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
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
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-dark-700 border border-dark-600 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setMatchDropdownOpen(!matchDropdownOpen)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-gray-500 transition-transform",
                    matchDropdownOpen && "rotate-180"
                  )}
                />
              </button>
            </div>

            {matchDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMatchDropdownOpen(false)}
                />
                <div className="absolute z-40 mt-1 w-full max-h-60 overflow-y-auto rounded-lg bg-dark-700 border border-dark-600 shadow-xl">
                  {filteredMatches.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      {t("form.noMatchesFound")}
                    </div>
                  ) : (
                    filteredMatches.map((match) => (
                      <button
                        key={match.id}
                        type="button"
                        onClick={() => handleSelectMatch(match)}
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
        )}
      </div>

      {/* Prediction Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("form.predictionType")} <span className="text-red-400">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {predictionTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setPredictionType(type)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                predictionType === type
                  ? "bg-primary-600 border-primary-500 text-white"
                  : "bg-dark-700 border-dark-600 text-gray-400 hover:text-white hover:border-dark-500"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Prediction Value */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("form.prediction")} <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={prediction}
          onChange={(e) => setPrediction(e.target.value)}
          placeholder={t("form.predictionPlaceholder")}
          className="w-full px-4 py-2.5 rounded-lg bg-dark-700 border border-dark-600 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
      </div>

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

      {/* Premium Toggle (collaborators only) */}
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
        {isSubmitting ? t("form.submitting") : t("form.submit")}
      </button>
    </form>
  );
}
