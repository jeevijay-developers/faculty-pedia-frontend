import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import EnrollButton from "@/components/Common/EnrollButton";

// ─── Module mocks ────────────────────────────────────────────────────────────

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("react-hot-toast", () => ({
  toast: Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn(),
  }),
}));

vi.mock("@/components/server/payment.routes", () => ({
  createPaymentOrder: vi.fn(),
  verifyPayment: vi.fn(),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

import { toast } from "react-hot-toast";
import { createPaymentOrder } from "@/components/server/payment.routes";

const TOKEN_KEY = "faculty-pedia-auth-token";
const STUDENT_DATA = JSON.stringify({ _id: "stu123", name: "Alice", email: "alice@test.com" });

function setLoggedIn() {
  localStorage.setItem(TOKEN_KEY, "fake-jwt-token");
  localStorage.setItem("user-role", "student");
  localStorage.setItem("faculty-pedia-student-data", STUDENT_DATA);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("EnrollButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // ─── Rendering ─────────────────────────────────────────────────────────────

  describe("rendering", () => {
    it("shows the title when not enrolled", () => {
      render(<EnrollButton itemId="item1" title="Enroll Now" price={0} />);
      expect(screen.getByRole("button")).toHaveTextContent("Enroll Now");
    });

    it("shows price in title when price > 0", () => {
      render(<EnrollButton itemId="item1" title="Enroll Now" price={999} />);
      expect(screen.getByRole("button")).toHaveTextContent("Enroll Now - ₹999");
    });

    it("shows join label when initialEnrolled is true", () => {
      render(
        <EnrollButton itemId="item1" type="course" initialEnrolled={true} />
      );
      expect(screen.getByRole("button")).toHaveTextContent("Go to Course");
    });

    it("is disabled when disabled prop is true", () => {
      render(<EnrollButton itemId="item1" disabled={true} />);
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  // ─── Join labels by type ────────────────────────────────────────────────────

  describe("join label by type", () => {
    const cases: [string, string][] = [
      ["course", "Go to Course"],
      ["testseries", "Go to Test Series"],
      ["webinar", "Join the Webinar"],
      ["liveclass", "Join Class"],
    ];

    cases.forEach(([type, expected]) => {
      it(`shows "${expected}" for type="${type}" when enrolled`, () => {
        render(
          <EnrollButton itemId="item1" type={type} initialEnrolled={true} />
        );
        expect(screen.getByRole("button")).toHaveTextContent(expected);
      });
    });
  });

  // ─── Unauthenticated flow ───────────────────────────────────────────────────

  describe("unauthenticated click", () => {
    it("shows error toast and does not call createPaymentOrder", async () => {
      // localStorage is clear — not authenticated
      render(<EnrollButton itemId="item1" type="course" />);
      await userEvent.click(screen.getByRole("button"));

      expect(toast.error).toHaveBeenCalledWith(
        "Please login to enroll in this course"
      );
      expect(createPaymentOrder).not.toHaveBeenCalled();
    });
  });

  // ─── Missing student ID ─────────────────────────────────────────────────────

  describe("authenticated but no student ID in storage", () => {
    it("shows error toast when student data has no _id", async () => {
      // isLoggedIn=true but studentId=null (userData has no _id/id field)
      localStorage.setItem(TOKEN_KEY, "fake-jwt");
      localStorage.setItem("user-role", "student");
      localStorage.setItem(
        "faculty-pedia-student-data",
        JSON.stringify({ name: "No ID User", email: "noid@test.com" })
      );

      render(<EnrollButton itemId="item1" type="course" />);
      await userEvent.click(screen.getByRole("button"));

      expect(toast.error).toHaveBeenCalledWith(
        "Student information not found. Please login again."
      );
      expect(createPaymentOrder).not.toHaveBeenCalled();
    });
  });

  // ─── Already enrolled ──────────────────────────────────────────────────────

  describe("already enrolled", () => {
    it("does not call createPaymentOrder and uses onEnrollmentSuccess callback", async () => {
      setLoggedIn();
      const onSuccess = vi.fn().mockResolvedValue(true);

      render(
        <EnrollButton
          itemId="item1"
          type="course"
          initialEnrolled={true}
          onEnrollmentSuccess={onSuccess}
        />
      );

      await userEvent.click(screen.getByRole("button"));

      expect(createPaymentOrder).not.toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ alreadyEnrolled: true, itemId: "item1" })
      );
    });
  });

  // ─── "Already enrolled" API error ──────────────────────────────────────────

  describe("API returns already-enrolled error", () => {
    it("sets enrolled state and shows success toast without proceeding to Razorpay", async () => {
      setLoggedIn();

      // Simulate Razorpay being loaded
      (window as any).Razorpay = vi.fn();

      const alreadyEnrolledError = {
        response: { data: { message: "Student is already enrolled in this course" } },
      };
      vi.mocked(createPaymentOrder).mockRejectedValueOnce(alreadyEnrolledError);

      render(<EnrollButton itemId="item1" type="course" />);
      await userEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("You're already enrolled");
      });

      // Button label should now show "Go to Course" (enrolled state)
      await waitFor(() => {
        expect(screen.getByRole("button")).toHaveTextContent("Go to Course");
      });
    });
  });

  // ─── Missing itemId ────────────────────────────────────────────────────────

  describe("missing itemId", () => {
    it("shows error toast when itemId is not provided", async () => {
      setLoggedIn();
      render(<EnrollButton type="course" />);
      await userEvent.click(screen.getByRole("button"));

      expect(toast.error).toHaveBeenCalledWith(
        "Course information missing. Please try again."
      );
    });
  });
});
