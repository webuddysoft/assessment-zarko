"use client";
import Link from "next/link";
import AuthInitializer from "@/components/AuthInitializer";
import { clearAllUserCache, clearBrowserCache } from "@/utils/cache";
import { toast } from "react-toastify";

export default function Home() {
  const handleClearUserCache = () => {
    clearAllUserCache();
    toast.success("User cache cleared successfully!");
  };

  const handleClearBrowserCache = () => {
    clearBrowserCache();
    toast.success("Browser cache cleared successfully!");
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <AuthInitializer />
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to UserReg
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A modern user management application with secure authentication and profile management.
        </p>
        <div className="space-x-4 mb-8">
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Login
          </Link>
        </div>
        
        {/* Cache Management Section */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Cache Management</h2>
          <div className="space-y-3">
            <button
              onClick={handleClearUserCache}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Clear User Cache
            </button>
            <button
              onClick={handleClearBrowserCache}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              Clear Browser Cache
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Use these buttons to clear cached user data and browser storage.
          </p>
        </div>
      </div>
    </div>
  );
}
