import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const locales = ["az", "en", "ru"] as const;
export const defaultLocale = "az" as const;

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales });
