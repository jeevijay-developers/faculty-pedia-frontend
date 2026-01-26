"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/auth";
import { toast } from "react-hot-toast";
import { createPaymentOrder, verifyPayment } from "../server/payment.routes";

/**
 * Authentication-aware enrollment button component
 * Allows browsing without authentication but requires login for enrollment
 */
const EnrollButton = ({
  type = "course", // "course", "testseries", "webinar", "liveclass"
  itemId,
  studentId = null,
  price = 0,
  title = "Enroll Now",
  joinLabel = null,
  className = "",
  onEnrollmentSuccess = null,
  disabled = false,
  enrollmentEndpoint = null, // Custom API endpoint if needed
  initialEnrolled = false,
}) => {
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [hasEnrolled, setHasEnrolled] = useState(false);

  useEffect(() => {
    if (initialEnrolled) {
      setHasEnrolled(true);
    }
  }, [initialEnrolled]);

  const loadRazorpayScript = () => {
    if (typeof window === "undefined") return Promise.resolve(false);
    if (window.Razorpay) return Promise.resolve(true);

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Failed to load Razorpay"));
      document.body.appendChild(script);
    });
  };

  const resolveProductType = () => {
    const normalized = (type || "").toLowerCase();
    const map = {
      course: "course",
      testseries: "testSeries",
      webinar: "webinar",
      liveclass: "liveClass",
      "live-class": "liveClass",
      test: "test",
    };

    if (enrollmentEndpoint) return null; // custom flow

    return map[normalized];
  };

  const getRedirectTarget = () => {
    if (type === "course") return `/course-panel?courseId=${itemId}`;
    if (type === "testseries") return `/test-series/${itemId}`;
    if (type === "webinar") return `/webinars/${itemId}`;
    return "/profile?tab=courses";
  };

  const handleEnrollment = async () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      toast.error("Please login to enroll in this course");
      // Redirect to login with return URL
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    // Get student ID from localStorage if not provided
    let actualStudentId = studentId;
    if (!actualStudentId) {
      try {
        const userData = JSON.parse(
          localStorage.getItem("faculty-pedia-student-data") || "{}"
        );
        actualStudentId = userData._id || userData.id;
      } catch (error) {
        console.error("Error parsing student data:", error);
      }
    }

    if (!actualStudentId) {
      toast.error("Student information not found. Please login again.");
      router.push("/login");
      return;
    }

    if (!itemId) {
      toast.error("Course information missing. Please try again.");
      return;
    }

    const productType = resolveProductType();
    const redirectTarget = getRedirectTarget();

    if (hasEnrolled) {
      try {
        if (onEnrollmentSuccess) {
          const handled = await onEnrollmentSuccess({
            productType,
            itemId,
            alreadyEnrolled: true,
          });
          if (handled) return;
        }
        router.push(redirectTarget);
      } catch (error) {
        console.error("Redirect error:", error);
        toast.error("Unable to open webinar link right now.");
      }
      return;
    }

    setIsEnrolling(true);

    try {
      if (!productType) {
        throw new Error("Invalid enrollment type");
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Unable to load payment gateway");
      }

      const orderResponse = await createPaymentOrder({
        studentId: actualStudentId,
        productId: itemId,
        productType,
      }).catch((err) => {
        const alreadyEnrolled =
          err?.response?.data?.message
            ?.toLowerCase?.()
            .includes("already enrolled") ||
          err?.response?.data?.errors?.some?.((e) =>
            String(e?.msg || e?.message || "")
              .toLowerCase()
              .includes("already enrolled")
          );

        if (alreadyEnrolled) {
          setHasEnrolled(true);

          if (onEnrollmentSuccess) {
            onEnrollmentSuccess({
              productType,
              itemId,
              alreadyEnrolled: true,
            });
          }

          toast.success("You're already enrolled");
          return null; // Skip payment
        }

        throw err;
      });

      if (!orderResponse) {
        setIsEnrolling(false);
        return;
      }

      const payload = orderResponse?.data || orderResponse;
      const orderData = payload?.data || payload;

      if (!orderData?.orderId || !orderData?.razorpayKey) {
        throw new Error("Invalid payment order response");
      }

      const userData = (() => {
        try {
          return JSON.parse(
            localStorage.getItem("faculty-pedia-student-data") || "{}"
          );
        } catch (err) {
          return {};
        }
      })();

      const options = {
        key: orderData.razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Facultypedia",
        description: orderData.product?.title || "Checkout",
        order_id: orderData.orderId,
        prefill: {
          name: userData?.name || userData?.fullName || "",
          email: userData?.email || "",
        },
        notes: {
          productType,
          productId: itemId,
          intentId: orderData.intentId,
        },
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              intentId: orderData.intentId,
            });

            if (!verifyRes?.success) {
              throw new Error(
                verifyRes?.message || "Payment verification failed"
              );
            }

            toast.success("Enrollment successful!");
            setHasEnrolled(true);

            if (onEnrollmentSuccess) {
              const handled = await onEnrollmentSuccess({
                productType,
                itemId,
                orderData,
                paymentResponse: response,
              });
              if (handled) {
                return;
              }
            }

            setTimeout(() => {
              router.push(redirectTarget);
            }, 800);
          } catch (err) {
            console.error("Verification error", err);
            toast.error(err?.message || "Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            toast("Payment cancelled", { icon: "ℹ️" });
          },
        },
        theme: {
          color: "#0f172a",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error(error.message || "Failed to enroll. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  const getJoinLabel = () => {
    if (joinLabel) return joinLabel;
    
    const normalizedType = String(type).toLowerCase();
    if (normalizedType === "course") return "Go to Course";
    if (normalizedType === "testseries" || normalizedType === "test") return "Go to Test Series";
    if (normalizedType === "webinar") return "Join the Webinar";
    if (normalizedType.includes("live")) return "Join Class";
    
    return "Access Content";
  };

  const displayTitle = price > 0 ? `${title} - ₹${price}` : title;
  const joinCopy = getJoinLabel();
  const finalTitle = hasEnrolled ? joinCopy : displayTitle;

  return (
    <button
      onClick={handleEnrollment}
      disabled={disabled || isEnrolling}
      className={`${className} ${
        disabled || isEnrolling
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-lg transform hover:scale-105"
      } transition-all duration-300`}
    >
      {isEnrolling ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span>Enrolling...</span>
        </div>
      ) : (
        finalTitle
      )}
    </button>
  );
};

export default EnrollButton;
