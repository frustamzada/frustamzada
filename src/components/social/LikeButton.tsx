"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  isLiked: boolean;
  count: number;
  onToggle: () => void;
}

export default function LikeButton({ isLiked, count, onToggle }: LikeButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
        "hover:bg-dark-700 active:scale-95",
        isLiked
          ? "text-red-500"
          : "text-dark-400 hover:text-dark-200"
      )}
      aria-label={isLiked ? "Unlike" : "Like"}
    >
      <Heart
        className={cn(
          "h-4.5 w-4.5 transition-all duration-300",
          isLiked && "fill-red-500 scale-110",
          !isLiked && "fill-none"
        )}
      />
      {count > 0 && (
        <span className="tabular-nums">{count}</span>
      )}
    </button>
  );
}
