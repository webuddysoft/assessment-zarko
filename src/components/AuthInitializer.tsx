"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { setAuthToken } from "@/services/api";

export default function AuthInitializer() {
  useEffect(() => {
    // Initialize auth from cookie if available
    const token = Cookies.get("token");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return null;
} 