'use client';

import { ENABLE_DEBUG_LOGGING } from '@/lib/config';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (ENABLE_DEBUG_LOGGING) {
    console.error('Global error:', error);
  }

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Application Error
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                We{"'ve"} encountered a critical error. Please try again later.
              </p>
            </div>
            <div className="mt-8 space-y-6">
              <button
                onClick={reset}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
