import { cn } from "@/lib/utils";
import { Award, Star, TrendingUp, Zap } from "lucide-react";
import type { ReactNode } from "react";

type BadgeLevel = "BEGINNER" | "RISING_STAR" | "EXPERT" | "MASTER";
type PredictionStatus = "PENDING" | "WON" | "LOST";
type BadgeType = BadgeLevel | PredictionStatus;

interface BadgeProps {
  type: BadgeType;
  className?: string;
}

interface BadgeConfig {
  label: string;
  icon?: ReactNode;
  classes: string;
}

const iconSize = "h-3 w-3";

const badgeConfigs: Record<BadgeType, BadgeConfig> = {
  BEGINNER: {
    label: "Beginner",
    icon: <Star className={iconSize} />,
    classes: "bg-dark-700 text-dark-300 border-dark-600",
  },
  RISING_STAR: {
    label: "Rising Star",
    icon: <TrendingUp className={iconSize} />,
    classes: "bg-blue-900/40 text-blue-400 border-blue-700/50",
  },
  EXPERT: {
    label: "Expert",
    icon: <Zap className={iconSize} />,
    classes: "bg-purple-900/40 text-purple-400 border-purple-700/50",
  },
  MASTER: {
    label: "Master",
    icon: <Award className={iconSize} />,
    classes: "bg-amber-900/40 text-amber-400 border-amber-700/50",
  },
  PENDING: {
    label: "Pending",
    classes: "bg-amber-900/30 text-amber-400 border-amber-700/40",
  },
  WON: {
    label: "Won",
    classes: "bg-emerald-900/30 text-emerald-400 border-emerald-700/40",
  },
  LOST: {
    label: "Lost",
    classes: "bg-red-900/30 text-red-400 border-red-700/40",
  },
};

export default function Badge({ type, className }: BadgeProps) {
  const config = badgeConfigs[type];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.classes,
        className
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
