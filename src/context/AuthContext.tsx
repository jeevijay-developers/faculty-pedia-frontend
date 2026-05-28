"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type UserRole = "student" | "educator" | null;

export interface AuthUser {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  [key: string]: unknown;
}

interface AuthState {
  isLoggedIn: boolean;
  userRole: UserRole;
  userData: AuthUser | null;
}

export interface AuthContextValue extends AuthState {
  studentId: string | null;
  logout: () => Promise<void>;
  refreshAuth: () => void;
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

const TOKEN_KEY = "faculty-pedia-auth-token";
const ROLE_KEY = "user-role";
const STUDENT_DATA_KEY = "faculty-pedia-student-data";
const EDUCATOR_DATA_KEY = "faculty-pedia-educator-data";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readAuthState(): AuthState {
  if (typeof window === "undefined") {
    return { isLoggedIn: false, userRole: null, userData: null };
  }

  const role = localStorage.getItem(ROLE_KEY) as UserRole;
  const dataKey =
    role === "student"
      ? STUDENT_DATA_KEY
      : role === "educator"
      ? EDUCATOR_DATA_KEY
      : null;

  let userData: AuthUser | null = null;
  if (dataKey) {
    try {
      const raw = localStorage.getItem(dataKey);
      userData = raw ? JSON.parse(raw) : null;
    } catch {
      userData = null;
    }
  }

  return {
    isLoggedIn: !!(role && userData),
    userRole: role,
    userData,
  };
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    userRole: null,
    userData: null,
  });

  const refreshAuth = useCallback(() => {
    setAuthState(readAuthState());
  }, []);

  // Hydrate from localStorage on mount (avoids SSR mismatch)
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // Sync across tabs and with in-page custom events fired by Login.jsx
  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      const watched = [ROLE_KEY, STUDENT_DATA_KEY, EDUCATOR_DATA_KEY, TOKEN_KEY];
      if (!e.key || watched.includes(e.key)) refreshAuth();
    };
    const onStudentUpdated = () => refreshAuth();
    const onEducatorUpdated = () => refreshAuth();

    window.addEventListener("storage", onStorageChange);
    window.addEventListener("student-data-updated", onStudentUpdated);
    window.addEventListener("educator-data-updated", onEducatorUpdated);

    return () => {
      window.removeEventListener("storage", onStorageChange);
      window.removeEventListener("student-data-updated", onStudentUpdated);
      window.removeEventListener("educator-data-updated", onEducatorUpdated);
    };
  }, [refreshAuth]);

  const logout = useCallback(async () => {
    // Clear all auth keys from localStorage
    [
      TOKEN_KEY,
      STUDENT_DATA_KEY,
      EDUCATOR_DATA_KEY,
      ROLE_KEY,
      "token",
      "authToken",
    ].forEach((key) => localStorage.removeItem(key));

    // Clear the httpOnly session cookie
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
    } catch {
      // Non-fatal — cookie expires naturally
    }

    setAuthState({ isLoggedIn: false, userRole: null, userData: null });
    window.location.href = "/login";
  }, []);

  const studentId =
    authState.userRole === "student"
      ? (authState.userData?._id ?? authState.userData?.id ?? null)
      : null;

  return (
    <AuthContext.Provider
      value={{ ...authState, studentId, logout, refreshAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
