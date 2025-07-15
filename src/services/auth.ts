import api from "./api";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  gender?: string;
  birthdate?: string;
  favorites?: string;
  nickname?: string;
  about_me?: string;
}

interface UpdateProfileData {
  gender?: string;
  birthdate?: string;
  favorites?: string;
  nickname?: string;
  about_me?: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  username: string;
}

export async function registerUser(data: RegisterData) {
  console.log("Sending registration data:", data);
  try {
    const res = await api.post("/users/", data);
    return res.data;
  } catch (error: unknown) {
    const apiError = error as { 
      response?: { 
        data?: unknown;
        status?: number;
        statusText?: string;
      };
      message?: string;
    };
    console.error("Registration API error details:", {
      status: apiError.response?.status,
      statusText: apiError.response?.statusText,
      data: apiError.response?.data,
      message: apiError.message
    });
    throw error;
  }
}

export async function loginUser(data: { username: string; password: string }) {
  const res = await api.post("/auth/login", data);
  const responseData: LoginResponse = res.data;
  
  // Create user object from response
  const user = {
    id: responseData.user_id.toString(),
    username: responseData.username,
    email: "", // Email not returned in login response
    gender: undefined,
    birthdate: undefined,
    favorites: undefined,
    nickname: undefined,
    about_me: undefined,
  };
  
  return {
    user,
    token: responseData.access_token
  };
}

export async function updateProfile(id: string, data: UpdateProfileData) {
  const res = await api.put(`/users/${id}/`, data);
  return res.data;
}

export async function deleteAccount(id: string) {
  const res = await api.delete(`/users/${id}/`);
  return res.data;
} 

export async function getUserById(id: string) {
  const res = await api.get(`/users/${id}/`);
  return res.data;
} 