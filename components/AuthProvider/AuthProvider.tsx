"use client";

import { useEffect, type ReactNode } from "react";
import { checkSession, getMe } from "../../lib/api/clientApi";
import { useAuthStore } from "../../lib/store/authStore";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, clearIsAuthenticated } = useAuthStore();
  useEffect(() => {
    let active = true;
    void checkSession()
      .then(async (session) => {
        if (!active) return;
        if (!session) {
          clearIsAuthenticated();
          return;
        }
        try {
          setUser(await getMe());
        } catch {
          clearIsAuthenticated();
        }
      })
      .catch(() => {
        if (active) clearIsAuthenticated();
      });
    return () => {
      active = false;
    };
  }, [clearIsAuthenticated, setUser]);
  return children;
}
