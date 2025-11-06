import { API_BASE_URL } from "@/config/env";

const USG_GOLF_COURSE_ENDPOINT = "/api/game/v2/tournament/global_golf_courses/";
const AUTH_TOKEN_STORAGE_KEY = "ddf.auth.token";

interface RawCourse extends Record<string, unknown> {
  id?: unknown;
  course_id?: unknown;
  uuid?: unknown;
  slug?: unknown;
  course_name?: unknown;
  FullName?: unknown;
  full_name?: unknown;
  name?: unknown;
  slope_rating?: unknown;
  slope?: unknown;
  slopeRating?: unknown;
  number_of_holes?: unknown;
  holes?: unknown;
  total_holes?: unknown;
  city?: unknown;
  state?: unknown;
  province?: unknown;
  region?: unknown;
  City?: unknown;
  State?: unknown;
  Province?: unknown;
  Region?: unknown;
  Ratings?: unknown;
}

export type CourseResult = {
  id: string;
  name: string;
  location?: string;
  slopeRating: number | null;
  holes: number | null;
  teeSets: string[];
  raw: RawCourse | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function coerceNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function buildLocation(course: RawCourse): string | undefined {
  const cityCandidates = [course.city, course.City];
  const stateCandidates = [course.state, course.State, course.province, course.Province, course.region, course.Region];

  const city = pickFirstString(cityCandidates);
  const state = pickFirstString(stateCandidates);

  const parts = [city, state].filter(Boolean);
  return parts.length ? parts.join(", ") : undefined;
}

function pickFirstString(candidates: unknown[]): string | undefined {
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }
  return undefined;
}

function pickFirstDefined<T>(candidates: unknown[], fallback: T): T {
  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null) {
      return candidate as T;
    }
  }
  return fallback;
}

function collectTeeSetNames(course: RawCourse): string[] {
  if (!Array.isArray(course.Ratings)) {
    return [];
  }

  const names = course.Ratings.map((rating) => {
    if (!isRecord(rating)) {
      return null;
    }

    const rawName = pickFirstDefined<string | null>(
      [rating["TeeSetRatingName"], rating["teeSetRatingName"], rating["Name"], rating["name"]],
      null,
    );

    if (typeof rawName !== "string") {
      return null;
    }

    const trimmed = rawName.trim();
    return trimmed.length > 0 ? trimmed : null;
  });

  return Array.from(new Set(names.filter((value): value is string => Boolean(value))));
}

function extractCourseArray(source: unknown): RawCourse[] {
  if (Array.isArray(source)) {
    return source.filter(isRecord) as RawCourse[];
  }

  if (isRecord(source)) {
    const record = source as {
      courses?: unknown;
      results?: unknown;
      data?: unknown;
    };

    const directCandidates = [record.courses, record.results, record.data];

    for (const candidate of directCandidates) {
      if (Array.isArray(candidate)) {
        return candidate.filter(isRecord) as RawCourse[];
      }
    }

    for (const candidate of directCandidates) {
      if (isRecord(candidate)) {
        const nested = extractCourseArray(candidate);
        if (nested.length > 0) {
          return nested;
        }
      }
    }
  }

  return [];
}

function normalizeCourseResults(payload: unknown): CourseResult[] {
  const courses = extractCourseArray(payload);
  return courses.map((course, index) => {
    const idSource = pickFirstDefined([course.id, course.course_id, course.uuid, course.slug], index.toString());
    const nameSource = pickFirstDefined(
      [course.FullName, course.full_name, course.course_name, course.name],
      `Course ${index + 1}`,
    );
    const slopeSource = pickFirstDefined([course.slope_rating, course.slope, course.slopeRating], null);
    const holesSource = pickFirstDefined([course.number_of_holes, course.holes, course.total_holes], null);

    return {
      id: String(idSource),
      name: String(nameSource),
      location: buildLocation(course),
      slopeRating: coerceNumber(slopeSource),
      holes: coerceNumber(holesSource),
      teeSets: collectTeeSetNames(course),
      raw: course,
    };
  });
}

function extractErrorMessage(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null;
  }

  const record = payload as {
    message?: unknown;
    detail?: unknown;
    error?: unknown;
    reason?: unknown;
  };

  const candidates = [record.message, record.detail, record.error, record.reason];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return null;
}

function parseJsonSafely(text: string): unknown {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export function isGolfCourseSearchConfigured(): boolean {
  return Boolean(resolveAuthToken());
}

function readStoredAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function resolveAuthToken(candidate?: string | null): string | null {
  if (typeof candidate === "string" && candidate.trim().length > 0) {
    return candidate.trim();
  }
  const stored = readStoredAuthToken();
  return stored?.trim() ? stored.trim() : null;
}

export async function searchGolfCourses(query: string, token?: string): Promise<CourseResult[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error("Enter a course name or city before searching.");
  }

  const authToken = resolveAuthToken(token);
  if (!authToken) {
    throw new Error("Missing authentication token. Please sign in again to search courses.");
  }

  const response = await fetch(`${API_BASE_URL}${USG_GOLF_COURSE_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${authToken}`,
    },
    body: JSON.stringify({ course_name: trimmed }),
  });

  const payload = parseJsonSafely(await response.text());

  if (!response.ok) {
    const fallbackMessage =
      extractErrorMessage(payload) ??
      (typeof response.statusText === "string" && response.statusText.trim().length > 0
        ? response.statusText
        : undefined) ??
      "Unable to search courses right now.";
    throw new Error(fallbackMessage);
  }

  return normalizeCourseResults(payload);
}
