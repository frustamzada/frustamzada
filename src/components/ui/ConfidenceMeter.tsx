import { cn } from "@/lib/utils";

interface ConfidenceMeterProps {
  /** Confidence level from 1 to 10 */
  value: number;
  showLabel?: boolean;
  className?: string;
}

function getBarColor(value: number): string {
  if (value <= 3) return "bg-red-500";
  if (value <= 5) return "bg-orange-500";
  if (value <= 7) return "bg-yellow-500";
  return "bg-emerald-500";
}

function getTextColor(value: number): string {
  if (value <= 3) return "text-red-400";
  if (value <= 5) return "text-orange-400";
  if (value <= 7) return "text-yellow-400";
  return "text-emerald-400";
}

export default function ConfidenceMeter({
  value,
  showLabel = true,
  className,
}: ConfidenceMeterProps) {
  const clamped = Math.min(10, Math.max(1, Math.round(value)));
  const percentage = (clamped / 10) * 100;

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Track */}
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-dark-700">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-300",
            getBarColor(clamped)
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Label */}
      {showLabel && (
        <span
          className={cn(
            "min-w-[2ch] text-right text-xs font-bold tabular-nums",
            getTextColor(clamped)
          )}
        >
          {clamped}
        </span>
      )}
    </div>
  );
}
