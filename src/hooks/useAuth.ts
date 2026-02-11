"use client";

import { useSession } from "next-auth/react";
import { SessionUser, UserRole } from "@/types";

export function useAuth() {
  const { data: session, status } = useSession();

  const user = session?.user as SessionUser | undefined;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const isPremium =
    user?.role === "PREMIUM" ||
    user?.role === "COLLABORATOR" ||
    user?.role === "ADMIN";
  const isCollaborator =
    user?.role === "COLLABORATOR" || user?.role === "ADMIN";
  const isAdmin = user?.role === "ADMIN";

  return {
    user,
    isLoading,
    isAuthenticated,
    isPremium,
    isCollaborator,
    isAdmin,
  };
}
