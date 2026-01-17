"use client";

import { useEffect, useMemo, useState } from "react";
import { LuX, LuCheck, LuLoaderCircle, LuRefreshCw } from "react-icons/lu";
import toast from "react-hot-toast";
import {
  requestEmailVerification,
  resendEmailVerification,
  verifyEmailCode,
} from "../server/auth/auth.routes";

const RESEND_COOLDOWN_SECONDS = 60;

const EmailVerificationModal = ({
  isOpen,
  onClose,
  email,
  userType,
  onVerified,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Reset state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setCooldown(0);
    }
  }, [isOpen]);

  // Cooldown timer
  useEffect(() => {
    if (!cooldown) return undefined;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Combined OTP string
  const otpValue = useMemo(() => otp.join(""), [otp]);

  const handleOtpChange = (index, value) => {
    const sanitized = value.replace(/\D/g, "").slice(0, 1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = sanitized;
      return next;
    });
  };

  const handleVerify = async () => {
    if (!email || !userType) {
      setError("Email or user type is missing.");
      return;
    }

    if (otpValue.length !== 6) {
      setError("Enter the 6-digit code sent to your email.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await verifyEmailCode({ email, userType, otp: otpValue });
      toast.success("Email verified successfully!");
      if (typeof onVerified === "function") {
        await onVerified();
      }
      onClose?.();
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Verification failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerResend = async () => {
    if (!email || !userType) return;
    setIsResending(true);
    setError("");

    try {
      await resendEmailVerification({ email, userType });
      setCooldown(RESEND_COOLDOWN_SECONDS);
      toast.success("A new code has been sent to your email.");
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to resend code";
      setError(message);
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  const handleRequestInitial = async () => {
    if (!email || !userType) return;
    try {
      await requestEmailVerification({ email, userType });
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      // Silently ignore; backend auto-sends on signup. Show toast only if explicit resend is triggered.
      console.error("Initial verification send failed:", err?.message || err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleRequestInitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Email Verification
            </p>
            <h3 className="text-lg font-bold text-slate-900">
              Check your inbox
            </h3>
            <p className="text-xs text-slate-500 mt-1 break-all">
              Code sent to {email}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <LuX className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <p className="text-sm text-slate-600">
            Enter the 6-digit verification code we emailed you. It expires in 10
            minutes.
          </p>

          <div className="flex items-center justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className="w-12 h-12 text-center text-lg font-semibold rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
              />
            ))}
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              Didn’t get the code? You can resend after {cooldown || 0}s.
            </span>
            <button
              type="button"
              disabled={cooldown > 0 || isResending}
              onClick={triggerResend}
              className="inline-flex items-center gap-1 text-blue-600 font-semibold disabled:opacity-50"
            >
              {isResending ? (
                <LuLoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <LuRefreshCw className="h-4 w-4" />
              )}
              Resend
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-5 py-3 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-white"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleVerify}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <LuLoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <LuCheck className="h-4 w-4" />
            )}
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
