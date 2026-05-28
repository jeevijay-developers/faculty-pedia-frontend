import { test, expect, Page } from "@playwright/test";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TOKEN_KEY = "faculty-pedia-auth-token";
const ROLE_KEY = "user-role";
const STUDENT_DATA_KEY = "faculty-pedia-student-data";
const EDUCATOR_DATA_KEY = "faculty-pedia-educator-data";

async function seedStudentSession(page: Page) {
  await page.addInitScript(({ tokenKey, roleKey, dataKey }) => {
    localStorage.setItem(tokenKey, "fake-student-jwt");
    localStorage.setItem(roleKey, "student");
    localStorage.setItem(
      dataKey,
      JSON.stringify({ _id: "stu123", name: "Alice", email: "alice@test.com" })
    );
  }, { tokenKey: TOKEN_KEY, roleKey: ROLE_KEY, dataKey: STUDENT_DATA_KEY });
}

async function seedEducatorSession(page: Page) {
  await page.addInitScript(({ tokenKey, roleKey, dataKey }) => {
    localStorage.setItem(tokenKey, "fake-edu-jwt");
    localStorage.setItem(roleKey, "educator");
    localStorage.setItem(
      dataKey,
      JSON.stringify({ _id: "edu456", name: "Bob", email: "bob@test.com" })
    );
  }, { tokenKey: TOKEN_KEY, roleKey: ROLE_KEY, dataKey: EDUCATOR_DATA_KEY });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

test.describe("Authentication flows", () => {

  // ─── Login page ────────────────────────────────────────────────────────────

  test.describe("login page", () => {
    test("renders email and password inputs", async ({ page }) => {
      await page.goto("/login");
      await expect(page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i))).toBeVisible();
      await expect(page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i))).toBeVisible();
    });

    test("redirects to /exams when a student session already exists", async ({ page }) => {
      await seedStudentSession(page);
      await page.goto("/login");
      await expect(page).toHaveURL(/\/exams/);
    });

    test("shows error message on wrong credentials", async ({ page }) => {
      await page.goto("/login");

      await page
        .getByLabel(/email/i)
        .or(page.getByPlaceholder(/email/i))
        .fill("wrong@example.com");

      await page
        .getByLabel(/password/i)
        .or(page.getByPlaceholder(/password/i))
        .fill("wrongpassword");

      await page.getByRole("button", { name: /login|sign in/i }).click();

      // Should show some error feedback (toast or inline message)
      await expect(
        page.getByText(/invalid|incorrect|wrong|not found|failed/i)
      ).toBeVisible({ timeout: 8000 });
    });
  });

  // ─── Protected route: /exams ────────────────────────────────────────────────

  test.describe("protected route /exams", () => {
    test("redirects unauthenticated user to /login", async ({ page }) => {
      // Ensure no session
      await page.goto("/");
      await page.evaluate(() => {
        localStorage.clear();
      });
      await page.goto("/exams");

      // Should end up on login page or show login prompt
      await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
    });

    test("allows authenticated student to view /exams", async ({ page }) => {
      await seedStudentSession(page);
      await page.goto("/exams");

      // Should NOT redirect away from /exams
      await expect(page).not.toHaveURL(/\/login/);
      await expect(page).toHaveURL(/\/exams/);
    });
  });

  // ─── Session expiry (401 → clear + redirect) ───────────────────────────────

  test.describe("session expiry", () => {
    test("clears localStorage and redirects to /login when API returns 401", async ({
      page,
    }) => {
      await seedStudentSession(page);

      // Intercept any API call and return 401
      await page.route("**/api/**", (route) => {
        route.fulfill({ status: 401, body: JSON.stringify({ message: "Unauthorized" }) });
      });

      await page.goto("/exams");

      // The axios interceptor in config.js clears storage + redirects on 401
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

      // Verify localStorage was cleared
      const token = await page.evaluate(
        (key) => localStorage.getItem(key),
        TOKEN_KEY
      );
      expect(token).toBeNull();
    });
  });

  // ─── Student signup redirect ────────────────────────────────────────────────

  test.describe("join-as-student page", () => {
    test("redirects away from signup if already logged in as student", async ({
      page,
    }) => {
      await seedStudentSession(page);
      await page.goto("/join-as-student");
      await expect(page).toHaveURL(/\/exams/, { timeout: 5000 });
    });
  });
});
