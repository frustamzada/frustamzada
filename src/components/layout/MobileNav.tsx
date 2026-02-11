"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import {
  LayoutDashboard,
  Calendar,
  TrendingUp,
  BarChart3,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { key: "feed", href: "/feed", icon: LayoutDashboard },
  { key: "matches", href: "/matches", icon: Calendar },
  { key: "predictions", href: "/predictions", icon: TrendingUp },
  { key: "analytics", href: "/analytics", icon: BarChart3 },
  { key: "profile", href: "/profile", icon: UserCircle },
] as const;

export default function MobileNav() {
  const t = useTranslations("mobileNav");
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-dark-900 border-t border-dark-700 safe-area-bottom">
      <ul className="flex items-center justify-around h-16 px-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.key} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg transition-colors",
                  isActive
                    ? "text-primary-400"
                    : "text-gray-500 hover:text-gray-300"
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform",
                      isActive && "scale-110"
                    )}
                  />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-primary-400" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium leading-tight",
                    isActive && "font-semibold"
                  )}
                >
                  {t(item.key)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
