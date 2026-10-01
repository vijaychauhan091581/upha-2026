"use client";

import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-800 p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            !
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-600 mb-6">
            An unexpected error occurred while rendering the page.
          </p>
          <button
            onClick={() => reset()}
            className="w-full bg-[#111827] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-black transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
