"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useEffect, useState, useRef } from "react";
import { clearAllUserCache } from "@/utils/cache";
import { toast } from "react-toastify";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleClearCache = () => {
    clearAllUserCache();
    toast.success("Cache cleared successfully!");
    setShowDropdown(false);
  };

  // Always render the same structure to prevent hydration mismatch
  return (
    <header className="bg-gray-900 text-white shadow">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="font-bold text-lg">
          <Link href="/">UserReg</Link>
        </div>
        <ul className="flex gap-6 items-center">
          {/* Home link removed as requested */}
          <li>
            {mounted && !user ? (
              <Link href="/register" className={pathname === "/register" ? "underline" : ""}>Register</Link>
            ) : (
              <span className="invisible">Register</span>
            )}
          </li>
          <li>
            {mounted && !user ? (
              <Link href="/login" className={pathname === "/login" ? "underline" : ""}>Login</Link>
            ) : (
              <span className="invisible">Login</span>
            )}
          </li>
          <li>
            {mounted && user ? (
              <Link href="/profile" className={pathname === "/profile" ? "underline" : ""}>Profile</Link>
            ) : (
              <span className="invisible">Profile</span>
            )}
          </li>
          <li className="relative" ref={dropdownRef}>
            {mounted && user ? (
              <>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Menu ▼
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={handleClearCache}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Clear Cache
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <span className="invisible">Menu</span>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
} 