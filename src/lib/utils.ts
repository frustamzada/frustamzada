import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSuccessRate(won: number, total: number): string {
  if (total === 0) return "0%";
  return `${((won / total) * 100).toFixed(1)}%`;
}

export function calculateBadge(
  successRate: number,
  totalPredictions: number
): "BEGINNER" | "RISING_STAR" | "EXPERT" | "MASTER" {
  if (totalPredictions < 10) return "BEGINNER";
  if (successRate >= 70 && totalPredictions >= 100) return "MASTER";
  if (successRate >= 60 && totalPredictions >= 50) return "EXPERT";
  if (successRate >= 50 && totalPredictions >= 20) return "RISING_STAR";
  return "BEGINNER";
}

export function formatCurrency(amount: number): string {
  return `₼${amount.toFixed(2)}`;
}

export function formatDate(date: Date | string, locale: string = "az"): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale === "az" ? "az-AZ" : locale === "ru" ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function getOddsChangeColor(current: number, previous: number): string {
  if (current > previous) return "text-odds-up";
  if (current < previous) return "text-odds-down";
  return "text-dark-400";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
