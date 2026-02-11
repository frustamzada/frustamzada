"use client";

import { cn } from "@/lib/utils";

interface OddsDisplayProps {
  oddsMisliHome: number;
  oddsMisliDraw: number;
  oddsMisliAway: number;
  oddsTopazHome: number;
  oddsTopazDraw: number;
  oddsTopazAway: number;
  className?: string;
}

function OddsCell({
  value,
  isBetter,
}: {
  value: number;
  isBetter: boolean;
}) {
  return (
    <span
      className={cn(
        "tabular-nums font-semibold text-sm",
        isBetter ? "text-emerald-400" : "text-dark-300"
      )}
    >
      {value.toFixed(2)}
    </span>
  );
}

export default function OddsDisplay({
  oddsMisliHome,
  oddsMisliDraw,
  oddsMisliAway,
  oddsTopazHome,
  oddsTopazDraw,
  oddsTopazAway,
  className,
}: OddsDisplayProps) {
  const pairs: { misli: number; topaz: number; label: string }[] = [
    { misli: oddsMisliHome, topaz: oddsTopazHome, label: "1" },
    { misli: oddsMisliDraw, topaz: oddsTopazDraw, label: "X" },
    { misli: oddsMisliAway, topaz: oddsTopazAway, label: "2" },
  ];

  return (
    <div
      className={cn(
        "rounded-lg border border-dark-700 bg-dark-800 p-3",
        className
      )}
    >
      {/* Header row */}
      <div className="grid grid-cols-4 gap-2 text-xs text-dark-400 mb-2">
        <span />
        {pairs.map((p) => (
          <span key={p.label} className="text-center font-medium">
            {p.label}
          </span>
        ))}
      </div>

      {/* Misli.az row */}
      <div className="grid grid-cols-4 gap-2 items-center py-1.5">
        <span className="text-xs font-medium text-dark-300 truncate">
          Misli.az
        </span>
        {pairs.map((p) => (
          <div key={`misli-${p.label}`} className="text-center">
            <OddsCell
              value={p.misli}
              isBetter={p.misli >= p.topaz}
            />
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-dark-700 my-1" />

      {/* Topaz row */}
      <div className="grid grid-cols-4 gap-2 items-center py-1.5">
        <span className="text-xs font-medium text-dark-300 truncate">
          Topaz
        </span>
        {pairs.map((p) => (
          <div key={`topaz-${p.label}`} className="text-center">
            <OddsCell
              value={p.topaz}
              isBetter={p.topaz >= p.misli}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
