import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import type { ReactNode } from "react";

type Status = "PENDING" | "WON" | "LOST" | "VOID";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

interface StatusConfig {
  label: string;
  icon: ReactNode;
  classes: string;
}

const iconSize = "h-3.5 w-3.5";

const statusConfigs: Record<Status, StatusConfig> = {
  PENDING: {
    label: "Pending",
    icon: <Clock className={iconSize} />,
    classes: "bg-amber-900/30 text-amber-400 border-amber-700/40",
  },
  WON: {
    label: "Won",
    icon: <CheckCircle2 className={iconSize} />,
    classes: "bg-emerald-900/30 text-emerald-400 border-emerald-700/40",
  },
  LOST: {
    label: "Lost",
    icon: <XCircle className={iconSize} />,
    classes: "bg-red-900/30 text-red-400 border-red-700/40",
  },
  VOID: {
    label: "Void",
    icon: <MinusCircle className={iconSize} />,
    classes: "bg-dark-700/50 text-dark-400 border-dark-600",
  },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfigs[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        config.classes,
        className
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
