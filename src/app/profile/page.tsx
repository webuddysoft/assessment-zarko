"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useForm } from "react-hook-form";
import { updateProfile, deleteAccount, getUserById } from "@/services/auth";
import { toast } from "react-toastify";
import AuthInitializer from "@/components/AuthInitializer";
import Cookies from "js-cookie";
import { setAuthToken } from "@/services/api";

interface ProfileFormData {
  gender?: string;
  birthdate?: string;
  favorites?: string;
  nickname?: string;
  about_me?: string;
}

export default function ProfilePage() {
  // Defensive: Always set token in Axios on every render
  if (typeof window !== "undefined") {
    const token = Cookies.get("token");
    if (token) {
      setAuthToken(token);
    }
  }
  const router = useRouter();
  const { user, logout, setUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const form = useForm<ProfileFormData>();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.replace("/login");
    }
  }, [mounted, user, router]);

  // Reset form with current user data when entering edit mode
  useEffect(() => {
    if (editing && user) {
      form.reset({
        gender: user.gender || "",
        birthdate: user.birthdate || "",
        favorites: user.favorites || "",
        nickname: user.nickname || "",
        about_me: user.about_me || "",
      });
    }
  }, [editing, user, form]);

  if (!mounted) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const onSubmit = async (data: ProfileFormData) => {
    try {
      console.log("[Profile Update] Submitting data:", data);
      await updateProfile(user.id, data);
      console.log("[Profile Update] Update successful, checking token...");
      // Ensure JWT token is set before fetching user
      const token = Cookies.get("token");
      if (!token) {
        console.error("[Profile Update] No JWT token found in cookies before fetching user");
        toast.error("Authentication error: Please log in again.");
        logout();
        router.replace("/login");
        return;
      }
      setAuthToken(token);
      console.log("[Profile Update] JWT token before getUserById:", token);
      // Fetch the full, fresh user object after update
      let updatedUser;
      try {
        console.log("[Profile Update] Calling getUserById with id:", user.id);
        updatedUser = await getUserById(user.id);
        console.log("[Profile Update] getUserById result:", updatedUser);
      } catch (fetchErr) {
        console.error("[Profile Update] Failed to fetch updated user after profile update:", fetchErr);
        if (fetchErr && typeof fetchErr === 'object' && 'response' in fetchErr) {
          // @ts-ignore
          console.error("[Profile Update] Error response:", fetchErr.response);
        }
        toast.error("Failed to refresh user data. Please reload the page.");
        return;
      }
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (err: unknown) {
      console.error("[Profile Update] Profile update error:", err);
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your account?")) {
      try {
        await deleteAccount(user.id);
        toast.success("Account deleted successfully");
        logout();
        router.replace("/login");
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error?.response?.data?.message || "Delete failed");
      }
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form to empty values when canceling
    form.reset({
      gender: "",
      birthdate: "",
      favorites: "",
      nickname: "",
      about_me: "",
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <AuthInitializer />
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      {!editing ? (
        <div className="space-y-2">
          <div><b>Username:</b> {user.username}</div>
          <div><b>Email:</b> {user.email}</div>
          {user.gender && <div><b>Gender:</b> {user.gender}</div>}
          {user.birthdate && <div><b>Birthdate:</b> {user.birthdate}</div>}
          {user.favorites && <div><b>Favorites:</b> {user.favorites}</div>}
          {user.nickname && <div><b>Nickname:</b> {user.nickname}</div>}
          {user.about_me && <div><b>About Me:</b> {user.about_me}</div>}
          <div className="flex gap-2 mt-4">
            <button onClick={handleEdit} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">Edit</button>
            <button onClick={handleDelete} className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors">Delete Account</button>
          </div>
          
        
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Gender</label>
            <select {...form.register("gender")} className="w-full border rounded px-3 py-2">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Birthdate</label>
            <input type="date" {...form.register("birthdate")} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1">Favorites</label>
            <input {...form.register("favorites")} className="w-full border rounded px-3 py-2" placeholder="e.g., Football, Music, Running" />
          </div>
          <div>
            <label className="block mb-1">Nickname</label>
            <input {...form.register("nickname")} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1">About Me</label>
            <textarea {...form.register("about_me")} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleCancel} className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">Save</button>
          </div>
        </form>
      )}
    </div>
  );
} 