import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TOKEN_KEY = "faculty-pedia-auth-token";
const ROLE_KEY = "user-role";
const STUDENT_DATA_KEY = "faculty-pedia-student-data";
const EDUCATOR_DATA_KEY = "faculty-pedia-educator-data";

const STUDENT = JSON.stringify({ _id: "stu123", name: "Alice", email: "alice@test.com" });
const EDUCATOR = JSON.stringify({ _id: "edu456", name: "Bob", email: "bob@test.com" });

function seedStudent() {
  localStorage.setItem(TOKEN_KEY, "fake-jwt");
  localStorage.setItem(ROLE_KEY, "student");
  localStorage.setItem(STUDENT_DATA_KEY, STUDENT);
}

function seedEducator() {
  localStorage.setItem(TOKEN_KEY, "fake-jwt");
  localStorage.setItem(ROLE_KEY, "educator");
  localStorage.setItem(EDUCATOR_DATA_KEY, EDUCATOR);
}

// Minimal consumer component that renders auth state
function AuthDisplay() {
  const { isLoggedIn, userRole, userData, studentId } = useAuth();
  return (
    <div>
      <span data-testid="logged-in">{String(isLoggedIn)}</span>
      <span data-testid="role">{userRole ?? "null"}</span>
      <span data-testid="name">{userData?.name ?? "null"}</span>
      <span data-testid="student-id">{studentId ?? "null"}</span>
    </div>
  );
}

function LogoutButton() {
  const { logout } = useAuth();
  return <button onClick={() => logout()}>Logout</button>;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Mock the session API route fetch
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    );
  });

  // ─── Initial state ──────────────────────────────────────────────────────

  it("starts with isLoggedIn=false when localStorage is empty", async () => {
    render(
      <AuthProvider>
        <AuthDisplay />
      </AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("logged-in")).toHaveTextContent("false");
    });
  });

  // ─── Student session ────────────────────────────────────────────────────

  it("reads student session from localStorage on mount", async () => {
    seedStudent();
    render(
      <AuthProvider>
        <AuthDisplay />
      </AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("logged-in")).toHaveTextContent("true");
      expect(screen.getByTestId("role")).toHaveTextContent("student");
      expect(screen.getByTestId("name")).toHaveTextContent("Alice");
      expect(screen.getByTestId("student-id")).toHaveTextContent("stu123");
    });
  });

  // ─── Educator session ───────────────────────────────────────────────────

  it("reads educator session from localStorage on mount", async () => {
    seedEducator();
    render(
      <AuthProvider>
        <AuthDisplay />
      </AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("logged-in")).toHaveTextContent("true");
      expect(screen.getByTestId("role")).toHaveTextContent("educator");
      expect(screen.getByTestId("name")).toHaveTextContent("Bob");
      // studentId is null for educators
      expect(screen.getByTestId("student-id")).toHaveTextContent("null");
    });
  });

  // ─── Cross-tab sync ─────────────────────────────────────────────────────

  it("syncs state when storage event fires for role key", async () => {
    render(
      <AuthProvider>
        <AuthDisplay />
      </AuthProvider>
    );

    // Initially not logged in
    await waitFor(() => {
      expect(screen.getByTestId("logged-in")).toHaveTextContent("false");
    });

    // Simulate another tab writing student data
    act(() => {
      localStorage.setItem(ROLE_KEY, "student");
      localStorage.setItem(STUDENT_DATA_KEY, STUDENT);
      window.dispatchEvent(
        new StorageEvent("storage", { key: ROLE_KEY })
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("logged-in")).toHaveTextContent("true");
      expect(screen.getByTestId("role")).toHaveTextContent("student");
    });
  });

  // ─── Custom events ──────────────────────────────────────────────────────

  it("refreshes when student-data-updated custom event fires", async () => {
    render(
      <AuthProvider>
        <AuthDisplay />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("logged-in")).toHaveTextContent("false");
    });

    act(() => {
      localStorage.setItem(ROLE_KEY, "student");
      localStorage.setItem(STUDENT_DATA_KEY, STUDENT);
      window.dispatchEvent(new Event("student-data-updated"));
    });

    await waitFor(() => {
      expect(screen.getByTestId("logged-in")).toHaveTextContent("true");
    });
  });

  // ─── useAuth outside provider ───────────────────────────────────────────

  it("throws if useAuth is called outside AuthProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<AuthDisplay />)).toThrow(
      "useAuth must be used inside <AuthProvider>"
    );
    consoleError.mockRestore();
  });

  // ─── Logout ─────────────────────────────────────────────────────────────

  it("logout clears localStorage and calls DELETE /api/auth/session", async () => {
    seedStudent();

    render(
      <AuthProvider>
        <LogoutButton />
        <AuthDisplay />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("logged-in")).toHaveTextContent("true");
    });

    await userEvent.click(screen.getByRole("button", { name: "Logout" }));

    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(ROLE_KEY)).toBeNull();
    expect(localStorage.getItem(STUDENT_DATA_KEY)).toBeNull();

    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      "/api/auth/session",
      expect.objectContaining({ method: "DELETE" })
    );
  });
});
