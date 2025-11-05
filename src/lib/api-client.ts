import { API_BASE_URL } from "@/config/env";

type ApiFetchOptions = RequestInit & {
  parseJson?: boolean;
};

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { parseJson = true, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  });

  const text = await response.text();
  const data = parseJson && text ? (JSON.parse(text) as T) : (text as unknown as T);

  if (!response.ok || (typeof data === "object" && data !== null && "success" in (data as Record<string, unknown>) && (data as Record<string, unknown>).success === false)) {
    const message =
      (typeof data === "object" && data !== null && "message" in data && typeof (data as Record<string, unknown>).message === "string"
        ? ((data as Record<string, unknown>).message as string)
        : response.statusText) || "Unexpected error";

    throw new ApiError(message, response.status, (data as Record<string, unknown>)?.data);
  }

  return data;
}
