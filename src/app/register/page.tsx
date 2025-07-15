"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerUser } from "@/services/auth";
import { toast } from "react-toastify";
import AuthInitializer from "@/components/AuthInitializer";

const step1Schema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Min 8 chars").regex(/[A-Z]/, "1 uppercase").regex(/[0-9]/, "1 number"),
});

const step2Schema = z.object({
  gender: z.string().optional(),
  birthdate: z.string().optional(),
  favorites: z.string().optional(),
  nickname: z.string().optional(),
  about_me: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

const favoritesList = ["Football", "Music", "Running"];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [selectedFavorites, setSelectedFavorites] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const step1Form = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });
  const step2Form = useForm<Step2Data>({ resolver: zodResolver(step2Schema) });

  const handleStep1 = (data: Step1Data) => {
    try {
      console.log("Step 1 data:", data);
      setStep1Data(data);
      setStep(2);
      setError(null);
    } catch (err) {
      console.error("Step 1 error:", err);
      setError("Error in step 1");
    }
  };

  const handleStep2 = async (data: Step2Data) => {
    try {
      if (!step1Data) {
        setError("Step 1 data is missing");
        return;
      }
      
      console.log("Step 1 data:", step1Data);
      console.log("Step 2 data:", data);
      console.log("Selected favorites:", selectedFavorites);
      
      // Convert favorites array to comma-separated string
      const favoritesString = selectedFavorites.length > 0 ? selectedFavorites.join(", ") : undefined;
      
      // Create payload with only the required fields and valid optional fields
      const payload = {
        username: step1Data.username,
        email: step1Data.email,
        password: step1Data.password,
        gender: data.gender || undefined,
        birthdate: data.birthdate || undefined,
        favorites: favoritesString,
        nickname: data.nickname || undefined,
        about_me: data.about_me || undefined,
      };
      
      console.log("Final registration payload:", JSON.stringify(payload, null, 2));
      
      await registerUser(payload);
      toast.success("Registration successful! Please login.");
      router.push("/login");
    } catch (err: unknown) {
      console.error("Registration error details:", err);
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error?.response?.data?.message || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleFavoriteChange = (favorite: string) => {
    try {
      setSelectedFavorites(prev => 
        prev.includes(favorite) 
          ? prev.filter(f => f !== favorite)
          : [...prev, favorite]
      );
    } catch (err) {
      console.error("Favorite change error:", err);
      setError("Error updating favorites");
    }
  };

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Error</h1>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => {
            setError(null);
            setStep(1);
            setStep1Data(null);
          }} 
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <AuthInitializer />
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      {step === 1 && (
        <form onSubmit={step1Form.handleSubmit(handleStep1)} className="space-y-4">
          <div>
            <label className="block mb-1">Username *</label>
            <input {...step1Form.register("username")}
              className="w-full border rounded px-3 py-2" />
            <p className="text-red-500 text-sm">{step1Form.formState.errors.username?.message as string}</p>
          </div>
          <div>
            <label className="block mb-1">Email *</label>
            <input {...step1Form.register("email")}
              className="w-full border rounded px-3 py-2" />
            <p className="text-red-500 text-sm">{step1Form.formState.errors.email?.message as string}</p>
          </div>
          <div>
            <label className="block mb-1">Password *</label>
            <input type="password" {...step1Form.register("password")}
              className="w-full border rounded px-3 py-2" />
            <p className="text-red-500 text-sm">{step1Form.formState.errors.password?.message as string}</p>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Next</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={step2Form.handleSubmit(handleStep2)} className="space-y-4">
          <div>
            <label className="block mb-1">Gender</label>
            <select {...step2Form.register("gender")} className="w-full border rounded px-3 py-2">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Birthdate</label>
            <input type="date" {...step2Form.register("birthdate")} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1">Favorites</label>
            <div className="space-y-2">
              {favoritesList.map(fav => (
                <label key={fav} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFavorites.includes(fav)}
                    onChange={() => handleFavoriteChange(fav)}
                    className="mr-2"
                  />
                  {fav}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1">Nickname</label>
            <input {...step2Form.register("nickname")} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1">About Me</label>
            <textarea {...step2Form.register("about_me")} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-200 py-2 rounded">Back</button>
            <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded">Register</button>
          </div>
        </form>
      )}
    </div>
  );
} 