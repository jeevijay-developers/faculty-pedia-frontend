import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getUserRole,
  getUserData,
  isUserLoggedIn,
  isStudent,
  isEducator,
  clearUserData,
  getDashboardUrl,
  getProfileUrl,
} from "@/utils/userRole";

const STUDENT_DATA = JSON.stringify({ _id: "stu123", name: "Alice", email: "alice@test.com" });
const EDUCATOR_DATA = JSON.stringify({ _id: "edu456", name: "Bob", email: "bob@test.com" });

describe("userRole utilities", () => {
  // localStorage cleared before each test by setup.ts

  // ─── getUserRole ────────────────────────────────────────────────────────────

  describe("getUserRole", () => {
    it("returns null when no role is stored", () => {
      expect(getUserRole()).toBeNull();
    });

    it("returns 'student' when stored", () => {
      localStorage.setItem("user-role", "student");
      expect(getUserRole()).toBe("student");
    });

    it("returns 'educator' when stored", () => {
      localStorage.setItem("user-role", "educator");
      expect(getUserRole()).toBe("educator");
    });
  });

  // ─── getUserData ─────────────────────────────────────────────────────────────

  describe("getUserData", () => {
    it("returns null when no role is set", () => {
      expect(getUserData()).toBeNull();
    });

    it("returns parsed student data for student role", () => {
      localStorage.setItem("user-role", "student");
      localStorage.setItem("faculty-pedia-student-data", STUDENT_DATA);
      const data = getUserData();
      expect(data?._id).toBe("stu123");
      expect(data?.name).toBe("Alice");
    });

    it("returns parsed educator data for educator role", () => {
      localStorage.setItem("user-role", "educator");
      localStorage.setItem("faculty-pedia-educator-data", EDUCATOR_DATA);
      const data = getUserData();
      expect(data?._id).toBe("edu456");
      expect(data?.name).toBe("Bob");
    });

    it("returns null when role exists but data key is missing", () => {
      localStorage.setItem("user-role", "student");
      expect(getUserData()).toBeNull();
    });
  });

  // ─── isUserLoggedIn ──────────────────────────────────────────────────────────

  describe("isUserLoggedIn", () => {
    it("returns false when nothing is stored", () => {
      expect(isUserLoggedIn()).toBe(false);
    });

    it("returns false when role is set but data is missing", () => {
      localStorage.setItem("user-role", "student");
      expect(isUserLoggedIn()).toBe(false);
    });

    it("returns true when both role and data are present (student)", () => {
      localStorage.setItem("user-role", "student");
      localStorage.setItem("faculty-pedia-student-data", STUDENT_DATA);
      expect(isUserLoggedIn()).toBe(true);
    });

    it("returns true when both role and data are present (educator)", () => {
      localStorage.setItem("user-role", "educator");
      localStorage.setItem("faculty-pedia-educator-data", EDUCATOR_DATA);
      expect(isUserLoggedIn()).toBe(true);
    });
  });

  // ─── isStudent / isEducator ─────────────────────────────────────────────────

  describe("isStudent", () => {
    it("returns false with no role", () => {
      expect(isStudent()).toBe(false);
    });

    it("returns true when role is student", () => {
      localStorage.setItem("user-role", "student");
      expect(isStudent()).toBe(true);
    });

    it("returns false when role is educator", () => {
      localStorage.setItem("user-role", "educator");
      expect(isStudent()).toBe(false);
    });
  });

  describe("isEducator", () => {
    it("returns false with no role", () => {
      expect(isEducator()).toBe(false);
    });

    it("returns true when role is educator", () => {
      localStorage.setItem("user-role", "educator");
      expect(isEducator()).toBe(true);
    });

    it("returns false when role is student", () => {
      localStorage.setItem("user-role", "student");
      expect(isEducator()).toBe(false);
    });
  });

  // ─── clearUserData ───────────────────────────────────────────────────────────

  describe("clearUserData", () => {
    it("removes all user-related keys from localStorage", () => {
      localStorage.setItem("user-role", "student");
      localStorage.setItem("faculty-pedia-student-data", STUDENT_DATA);
      localStorage.setItem("faculty-pedia-educator-data", EDUCATOR_DATA);
      localStorage.setItem("token", "some-token");

      clearUserData();

      expect(localStorage.getItem("user-role")).toBeNull();
      expect(localStorage.getItem("faculty-pedia-student-data")).toBeNull();
      expect(localStorage.getItem("faculty-pedia-educator-data")).toBeNull();
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  // ─── getDashboardUrl ─────────────────────────────────────────────────────────

  describe("getDashboardUrl", () => {
    it("returns '/' when no role is set", () => {
      expect(getDashboardUrl()).toBe("/");
    });

    it("returns '/exams' for students", () => {
      localStorage.setItem("user-role", "student");
      expect(getDashboardUrl()).toBe("/exams");
    });

    it("returns educator dashboard URL for educators (uses env or default)", () => {
      localStorage.setItem("user-role", "educator");
      const url = getDashboardUrl();
      expect(url).toMatch(/\/dashboard$/);
      // Should be either the env var value or the localhost default
      expect(url).toMatch(/^https?:\/\//);
    });
  });

  // ─── getProfileUrl ───────────────────────────────────────────────────────────

  describe("getProfileUrl", () => {
    it("returns '/' when no role is set", () => {
      expect(getProfileUrl()).toBe("/");
    });

    it("returns '/profile' for students", () => {
      localStorage.setItem("user-role", "student");
      expect(getProfileUrl()).toBe("/profile");
    });

    it("returns '/educator/profile' for educators", () => {
      localStorage.setItem("user-role", "educator");
      expect(getProfileUrl()).toBe("/educator/profile");
    });
  });
});
