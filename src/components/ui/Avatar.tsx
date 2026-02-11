import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  badge?: ReactNode;
  className?: string;
}

const sizeMap: Record<AvatarSize, { container: string; text: string; px: number }> = {
  sm: { container: "h-8 w-8", text: "text-xs", px: 32 },
  md: { container: "h-10 w-10", text: "text-sm", px: 40 },
  lg: { container: "h-14 w-14", text: "text-lg", px: 56 },
};

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({
  src,
  alt = "Avatar",
  name,
  size = "md",
  badge,
  className,
}: AvatarProps) {
  const { container, text, px } = sizeMap[size];

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={px}
          height={px}
          className={cn(
            "rounded-full object-cover border-2 border-dark-700",
            container
          )}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-full border-2 border-dark-700 bg-dark-700 font-semibold text-dark-300",
            container,
            text
          )}
        >
          {getInitials(name)}
        </div>
      )}

      {badge && (
        <span className="absolute -bottom-0.5 -right-0.5">{badge}</span>
      )}
    </div>
  );
}
