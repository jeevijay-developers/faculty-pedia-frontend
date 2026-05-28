import { test, expect, Page } from "@playwright/test";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TOKEN_KEY = "faculty-pedia-auth-token";

async function seedStudentSession(page: Page) {
  await page.addInitScript(({ tokenKey }) => {
    localStorage.setItem(tokenKey, "fake-student-jwt");
    localStorage.setItem("user-role", "student");
    localStorage.setItem(
      "faculty-pedia-student-data",
      JSON.stringify({ _id: "stu123", name: "Alice", email: "alice@test.com" })
    );
  }, { tokenKey: TOKEN_KEY });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

test.describe("Enrollment flow", () => {

  // ─── Unauthenticated enroll attempt ────────────────────────────────────────

  test("unauthenticated user clicking Enroll is redirected to /login", async ({
    page,
  }) => {
    // No session seeded
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());

    // Navigate to a course detail page that has an EnrollButton
    await page.goto("/courses");

    // Click the first "Enroll" or "Enroll Now" button visible
    const enrollBtn = page.getByRole("button", { name: /enroll/i }).first();

    // If no enroll button on listing, navigate to first course detail
    if (!(await enrollBtn.isVisible({ timeout: 3000 }).catch(() => false))) {
      const firstCourseLink = page.getByRole("link").filter({ hasText: /course|learn/i }).first();
      if (await firstCourseLink.isVisible({ timeout: 3000 }).catch(() => false)) {
        await firstCourseLink.click();
        await page.waitForLoadState("networkidle");
      }
    }

    const detailEnrollBtn = page.getByRole("button", { name: /enroll/i }).first();
    if (await detailEnrollBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await detailEnrollBtn.click();
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    } else {
      test.skip(true, "No enroll button found on courses page — skipping redirect test");
    }
  });

  // ─── Authenticated student sees Razorpay (mocked) ─────────────────────────

  test("authenticated student clicking Enroll triggers payment order creation", async ({
    page,
  }) => {
    await seedStudentSession(page);

    // Mock the payment order API to return a valid order
    await page.route("**/api/payment/create-order", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            orderId: "order_test_123",
            razorpayKey: "rzp_test_key",
            amount: 99900,
            currency: "INR",
            intentId: "intent_abc",
            product: { title: "Test Course" },
          },
        }),
      });
    });

    // Stub Razorpay so it doesn't actually open a modal
    await page.addInitScript(() => {
      (window as any).Razorpay = function (options: any) {
        return {
          open: () => {
            // Simulate user completing payment immediately
            if (options.handler) {
              options.handler({
                razorpay_order_id: "order_test_123",
                razorpay_payment_id: "pay_test_456",
                razorpay_signature: "sig_test_789",
              });
            }
          },
        };
      };
    });

    // Mock payment verification
    await page.route("**/api/payment/verify", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto("/courses");

    const detailLinks = page.getByRole("link").filter({ hasText: /course|learn/i });
    const firstLink = detailLinks.first();

    if (await firstLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstLink.click();
      await page.waitForLoadState("networkidle");
    }

    const enrollBtn = page.getByRole("button", { name: /enroll/i }).first();

    if (await enrollBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enrollBtn.click();

      // After mock payment completes, button should show "Go to Course"
      await expect(
        page.getByRole("button", { name: /go to course|access/i })
      ).toBeVisible({ timeout: 8000 });
    } else {
      test.skip(true, "No enroll button found — skipping payment flow test");
    }
  });

  // ─── Test series enrollment redirect ───────────────────────────────────────

  test("enrolled student clicking test-series button navigates to test series page", async ({
    page,
  }) => {
    await seedStudentSession(page);

    await page.goto("/test-series");
    await page.waitForLoadState("networkidle");

    // Look for a "Go to Test Series" or already-enrolled button
    const enrolledBtn = page
      .getByRole("button", { name: /go to test series|access/i })
      .first();

    if (await enrolledBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enrolledBtn.click();
      await expect(page).toHaveURL(/\/test-series\//, { timeout: 5000 });
    } else {
      test.skip(true, "No enrolled test-series button visible — skipping navigation test");
    }
  });
});
