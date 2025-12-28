/**
 * 404 Not Found Page
 */

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Tenant Not Found</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
          The tenant you&apos;re looking for doesn&apos;t exist or hasn&apos;t been configured yet.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Go to Default Site
        </Link>
      </div>
    </div>
  );
}

