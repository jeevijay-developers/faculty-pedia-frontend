import { describe, it, expect, beforeEach } from "vitest";
import {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  isAuthenticated,
  getUserFromToken,
  logout,
} from "@/utils/auth";

const TOKEN_KEY = "faculty-pedia-auth-token";
const FAKE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiVGVzdCJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

describe("auth utilities", () => {
  // localStorage is cleared before each test by setup.ts

  describe("setAuthToken", () => {
    it("stores the token under the correct key", () => {
      setAuthToken(FAKE_TOKEN);
      expect(localStorage.getItem(TOKEN_KEY)).toBe(FAKE_TOKEN);
    });

    it("overwrites an existing token", () => {
      setAuthToken("old-token");
      setAuthToken(FAKE_TOKEN);
      expect(localStorage.getItem(TOKEN_KEY)).toBe(FAKE_TOKEN);
    });
  });

  describe("getAuthToken", () => {
    it("returns null when no token is stored", () => {
      expect(getAuthToken()).toBeNull();
    });

    it("returns the stored token", () => {
      localStorage.setItem(TOKEN_KEY, FAKE_TOKEN);
      expect(getAuthToken()).toBe(FAKE_TOKEN);
    });
  });

  describe("removeAuthToken", () => {
    it("removes the token from localStorage", () => {
      localStorage.setItem(TOKEN_KEY, FAKE_TOKEN);
      removeAuthToken();
      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    });

    it("does not throw when no token exists", () => {
      expect(() => removeAuthToken()).not.toThrow();
    });
  });

  describe("isAuthenticated", () => {
    it("returns false when no token is stored", () => {
      expect(isAuthenticated()).toBe(false);
    });

    it("returns true when a token is stored", () => {
      localStorage.setItem(TOKEN_KEY, FAKE_TOKEN);
      expect(isAuthenticated()).toBe(true);
    });

    it("returns false after token is removed", () => {
      localStorage.setItem(TOKEN_KEY, FAKE_TOKEN);
      removeAuthToken();
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe("getUserFromToken", () => {
    it("returns null when no token is stored", () => {
      expect(getUserFromToken()).toBeNull();
    });

    it("decodes a valid JWT payload", () => {
      // Header: {"alg":"HS256"} Payload: {"sub":"123","name":"Test"}
      localStorage.setItem(TOKEN_KEY, FAKE_TOKEN);
      const user = getUserFromToken();
      expect(user).not.toBeNull();
      expect(user?.sub).toBe("123");
      expect(user?.name).toBe("Test");
    });

    it("returns null for a malformed token", () => {
      localStorage.setItem(TOKEN_KEY, "not.a.jwt");
      expect(getUserFromToken()).toBeNull();
    });
  });

  describe("logout", () => {
    it("removes the auth token", () => {
      localStorage.setItem(TOKEN_KEY, FAKE_TOKEN);
      // window.location.href assignment doesn't navigate in jsdom — safe to call
      logout("/login");
      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    });
  });
});
