import { describe, it, expect } from "vitest";
import { queryKeys } from "@/lib/query-keys";

// Query keys must be stable arrays — same inputs always produce the same key.
// TanStack Query uses deep-equality on these for cache lookup and invalidation.

describe("queryKeys", () => {
  describe("courses", () => {
    it("all returns stable array", () => {
      expect(queryKeys.courses.all).toEqual(["courses"]);
    });

    it("byId returns [courses, id]", () => {
      expect(queryKeys.courses.byId("abc123")).toEqual(["courses", "abc123"]);
    });

    it("byId is referentially stable for the same input", () => {
      expect(queryKeys.courses.byId("x")).toEqual(queryKeys.courses.byId("x"));
    });

    it("byId distinguishes different ids", () => {
      expect(queryKeys.courses.byId("a")).not.toEqual(queryKeys.courses.byId("b"));
    });

    it("byEducator returns [courses, educator, id]", () => {
      expect(queryKeys.courses.byEducator("edu1")).toEqual([
        "courses",
        "educator",
        "edu1",
      ]);
    });
  });

  describe("testSeries", () => {
    it("byId returns [testSeries, id]", () => {
      expect(queryKeys.testSeries.byId("ts1")).toEqual(["testSeries", "ts1"]);
    });

    it("byCourse returns [testSeries, course, id]", () => {
      expect(queryKeys.testSeries.byCourse("c1")).toEqual([
        "testSeries",
        "course",
        "c1",
      ]);
    });

    it("byEducator returns [testSeries, educator, id]", () => {
      expect(queryKeys.testSeries.byEducator("e1")).toEqual([
        "testSeries",
        "educator",
        "e1",
      ]);
    });
  });

  describe("webinars", () => {
    it("byId returns [webinars, id]", () => {
      expect(queryKeys.webinars.byId("w1")).toEqual(["webinars", "w1"]);
    });

    it("byEducator returns [webinars, educator, id]", () => {
      expect(queryKeys.webinars.byEducator("e1")).toEqual([
        "webinars",
        "educator",
        "e1",
      ]);
    });
  });

  describe("educators", () => {
    it("byId returns [educators, id]", () => {
      expect(queryKeys.educators.byId("e1")).toEqual(["educators", "e1"]);
    });

    it("profile returns [educators, id, profile]", () => {
      expect(queryKeys.educators.profile("e1")).toEqual([
        "educators",
        "e1",
        "profile",
      ]);
    });
  });

  describe("student", () => {
    it("byId returns [student, id]", () => {
      expect(queryKeys.student.byId("s1")).toEqual(["student", "s1"]);
    });

    it("stats returns [student, id, stats]", () => {
      expect(queryKeys.student.stats("s1")).toEqual(["student", "s1", "stats"]);
    });

    it("byId and stats are distinct for the same id", () => {
      expect(queryKeys.student.byId("s1")).not.toEqual(
        queryKeys.student.stats("s1")
      );
    });
  });

  describe("key uniqueness", () => {
    it("course byId and testSeries byId for the same id are distinct", () => {
      expect(queryKeys.courses.byId("shared")).not.toEqual(
        queryKeys.testSeries.byId("shared")
      );
    });

    it("course byCourse and testSeries byCourse are distinct", () => {
      expect(queryKeys.courses.byId("c1")).not.toEqual(
        queryKeys.testSeries.byCourse("c1")
      );
    });
  });
});
