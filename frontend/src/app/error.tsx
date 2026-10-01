"use client";

import React, { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route Error Caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          !
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-sm text-gray-600 mb-6">
          We encountered an error loading this section.
        </p>
        <button
          onClick={() => reset()}
          className="bg-[#111827] text-white py-2 px-5 rounded-lg text-sm font-medium hover:bg-black transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
