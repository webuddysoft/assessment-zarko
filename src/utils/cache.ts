import Cookies from "js-cookie";
import { useAuthStore } from "@/store/auth";
import { setAuthToken } from "@/services/api";

export function clearAllUserCache() {
  // Clear cookies
  Cookies.remove("token");
  
  // Clear localStorage
  if (typeof window !== "undefined") {
    localStorage.clear();
  }
  
  // Clear sessionStorage
  if (typeof window !== "undefined") {
    sessionStorage.clear();
  }
  
  // Clear Zustand store
  const { logout } = useAuthStore.getState();
  logout();
  
  // Clear Axios authorization header
  setAuthToken(null);
  
  console.log("All user cache cleared successfully");
}

export function clearBrowserCache() {
  if (typeof window !== "undefined") {
    // Clear all browser storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    console.log("Browser cache cleared successfully");
  }
} 