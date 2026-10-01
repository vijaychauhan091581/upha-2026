"use client";

import React, { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Prominent error banner that auto-scrolls into view when shown.
 * Parses the error message to highlight the key field/value.
 */
export default function ErrorBanner({ message, onDismiss, className = "" }: ErrorBannerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [message]);

  if (!message) return null;

  return (
    <div
      ref={ref}
      role="alert"
      className={`rounded-sm border border-red-200 bg-red-50 p-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${className}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="shrink-0 mt-0.5">
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-red-700 uppercase tracking-wide mb-1">
            Registration Could Not Be Completed
          </p>
          <p className="text-sm text-red-700 leading-relaxed whitespace-pre-line">
            {message}
          </p>

          {/* What to do hints parsed from message */}
          {message.includes("email") && message.includes("registered") && (
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-[11px] font-bold text-red-600 uppercase tracking-widest mb-1">What to do</p>
              <ul className="text-[12px] text-red-600 list-disc list-inside space-y-1">
                <li>Use a different email address that hasn&apos;t been registered before</li>
                <li>Already registered? <a href="/login" className="underline font-semibold hover:text-red-800">Login here instead</a></li>
              </ul>
            </div>
          )}

          {message.includes("Aadhar") && message.includes("registered") && (
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-[11px] font-bold text-red-600 uppercase tracking-widest mb-1">What to do</p>
              <ul className="text-[12px] text-red-600 list-disc list-inside space-y-1">
                <li>Each person can only register <strong>once</strong> — check if you have already registered</li>
                <li>Double-check the Aadhar number you entered for any typos</li>
                <li>Contact UPHA support if you believe this is an error</li>
              </ul>
            </div>
          )}

          {message.includes("Transaction ID") && (
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-[11px] font-bold text-red-600 uppercase tracking-widest mb-1">What to do</p>
              <ul className="text-[12px] text-red-600 list-disc list-inside space-y-1">
                <li>Each UPI Transaction ID can only be used <strong>once</strong></li>
                <li>Open your UPI app (PhonePe / GPay / Paytm) and copy the exact Transaction ID</li>
                <li>If you paid multiple times, use the Transaction ID from your <strong>most recent</strong> payment</li>
              </ul>
            </div>
          )}
        </div>

        {/* Dismiss button */}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 text-red-400 hover:text-red-600 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
