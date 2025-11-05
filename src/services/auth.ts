import { apiFetch } from "@/lib/api-client";

type ApiResponse<T> = {
  data: T;
  success: boolean;
  message: string;
  status_code: number;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  password: string;
  contact_number: string;
  full_name: string;
};

type VerifyOtpPayload = {
  email: string;
  code: string;
};

type ResendOtpPayload = {
  email: string;
};

type LoginData = {
  token: string | null;
  email: string;
};

type RegisterData = {
  email: string;
};

type VerifyOtpData = {
  token?: string;
};

export async function login(payload: LoginPayload) {
  return apiFetch<ApiResponse<LoginData>>("/api/tournament/director/login/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function register(payload: RegisterPayload) {
  return apiFetch<ApiResponse<RegisterData>>("/api/tournament/director/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyOtp(payload: VerifyOtpPayload) {
  return apiFetch<ApiResponse<VerifyOtpData>>("/api/tournament/director/verify-otp/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resendOtp(payload: ResendOtpPayload) {
  return apiFetch<ApiResponse<Record<string, unknown>>>("/api/tournament/director/resend-otp/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
