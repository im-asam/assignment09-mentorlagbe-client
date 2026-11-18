import { authClient } from "./auth-client";

/**
 * Client for the MentorLagbe Express API.
 * Public reads need no token; writes and user-scoped reads attach a
 * BetterAuth JWT (verified by the server via the JWKS endpoint).
 */

// All Express API calls go through the Next.js rewrite proxy
// (/api/server/* -> the Express server), so the browser only talks to
// the client host. NEXT_PUBLIC_API_URL is intentionally not used: a
// direct cross-origin call breaks whenever the route to the server
// host is flaky, while the client host stays reachable.
const API_URL = "/api/server";

export type TuitionMode = "Online" | "Offline";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: TuitionMode;
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: ApprovalStatus;
  isActive: boolean;
  createdAt: string;
}

export interface TuitionInput {
  title: string;
  subject: string;
  classLevel: string;
  mode: TuitionMode;
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
}

export interface Application {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  tutorEmail: string;
  tutorName?: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "student" | "tutor" | "admin";
  phone?: string;
  bio?: string;
  plan: "free" | "pro";
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalTutors: number;
  totalStudents?: number;
  pendingTuitions: number;
  approvedTuitions: number;
  totalRevenue: number;
  totalTransactions?: number;
}

export interface Transaction {
  _id: string;
  userEmail: string;
  userName: string;
  userRole: string;
  planName: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId?: string;
  paymentStatus: string;
  paidAt: string;
}

export interface TuitionsPage {
  tuitions: Tuition[];
  total: number;
  page: number;
  totalPages: number;
}

async function getToken(): Promise<string | null> {
  const { data } = await authClient.token();
  return data?.token ?? null;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(
      (json as { message?: string }).message ||
        (json as { error?: string }).error ||
        `Request failed (${res.status})`,
    ) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return json as T;
}

/* ---------- Public tuitions ---------- */

export async function getTuitions(params?: {
  search?: string;
  subject?: string;
  classLevel?: string;
  mode?: string;
  page?: number;
  limit?: number;
}): Promise<TuitionsPage> {
  const search = new URLSearchParams();
  if (params?.search) search.set("search", params.search);
  if (params?.subject) search.set("subject", params.subject);
  if (params?.classLevel) search.set("classLevel", params.classLevel);
  if (params?.mode) search.set("mode", params.mode);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  const query = search.toString();
  const data = await request<TuitionsPage | Tuition[]>(
    `/tuitions${query ? `?${query}` : ""}`,
  );
  if (Array.isArray(data)) {
    return { tuitions: data, total: data.length, page: 1, totalPages: 1 };
  }
  return data;
}

export async function getTuition(id: string): Promise<Tuition> {
  const data = await request<Tuition | { tuition: Tuition }>(`/tuitions/${id}`);
  return (data as { tuition: Tuition }).tuition ?? (data as Tuition);
}

/* ---------- Tutor tuitions ---------- */

export async function getMyTuitions(): Promise<Tuition[]> {
  const data = await request<Tuition[] | { tuitions: Tuition[] }>(
    "/tuitions/mine",
    {},
    true,
  );
  return Array.isArray(data) ? data : (data.tuitions ?? []);
}

export async function createTuition(data: TuitionInput): Promise<Tuition> {
  return request<Tuition>(
    "/tuitions",
    { method: "POST", body: JSON.stringify(data) },
    true,
  );
}

export async function updateTuition(
  id: string,
  data: Partial<TuitionInput> & { isActive?: boolean },
): Promise<Tuition> {
  return request<Tuition>(
    `/tuitions/${id}`,
    { method: "PATCH", body: JSON.stringify(data) },
    true,
  );
}

export async function deleteTuition(id: string): Promise<void> {
  await request(`/tuitions/${id}`, { method: "DELETE" }, true);
}

/* ---------- Applications ---------- */

export async function applyForTuition(data: {
  tuitionId: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
}): Promise<Application> {
  return request<Application>(
    "/applications",
    { method: "POST", body: JSON.stringify(data) },
    true,
  );
}

export async function getMyApplications(): Promise<Application[]> {
  const data = await request<Application[] | { applications: Application[] }>(
    "/applications/mine",
    {},
    true,
  );
  return Array.isArray(data) ? data : (data.applications ?? []);
}

export async function deleteApplication(id: string): Promise<void> {
  await request(`/applications/${id}`, { method: "DELETE" }, true);
}

export async function getTutorApplications(): Promise<Application[]> {
  const data = await request<Application[] | { applications: Application[] }>(
    "/applications/tutor",
    {},
    true,
  );
  return Array.isArray(data) ? data : (data.applications ?? []);
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<Application> {
  return request<Application>(
    `/applications/${id}/status`,
    { method: "PATCH", body: JSON.stringify({ status }) },
    true,
  );
}

/* ---------- Users / profile ---------- */

export async function getMyProfile(): Promise<UserProfile> {
  const data = await request<UserProfile | { user: UserProfile }>("/users/me", {}, true);
  return (data as { user: UserProfile }).user ?? (data as UserProfile);
}

export async function updateMyProfile(data: {
  name?: string;
  phone?: string;
  bio?: string;
  image?: string;
}): Promise<UserProfile> {
  const res = await request<UserProfile | { user: UserProfile }>(
    "/users/me",
    { method: "PATCH", body: JSON.stringify(data) },
    true,
  );
  return (res as { user: UserProfile }).user ?? (res as UserProfile);
}

/* ---------- Admin ---------- */

export async function getAdminStats(): Promise<AdminStats> {
  return request<AdminStats>("/admin/stats", {}, true);
}

export async function getAdminUsers(): Promise<UserProfile[]> {
  const data = await request<UserProfile[] | { users: UserProfile[] }>(
    "/admin/users",
    {},
    true,
  );
  return Array.isArray(data) ? data : (data.users ?? []);
}

export async function updateUserRole(
  id: string,
  role: "student" | "tutor" | "admin",
): Promise<UserProfile> {
  return request<UserProfile>(
    `/admin/users/${id}/role`,
    { method: "PATCH", body: JSON.stringify({ role }) },
    true,
  );
}

export async function getAdminTuitions(): Promise<Tuition[]> {
  const data = await request<Tuition[] | { tuitions: Tuition[] }>(
    "/admin/tuitions",
    {},
    true,
  );
  return Array.isArray(data) ? data : (data.tuitions ?? []);
}

export async function updateTuitionStatus(
  id: string,
  approvalStatus: ApprovalStatus,
): Promise<Tuition> {
  return request<Tuition>(
    `/admin/tuitions/${id}/status`,
    { method: "PATCH", body: JSON.stringify({ approvalStatus }) },
    true,
  );
}

export async function getAdminTransactions(): Promise<Transaction[]> {
  const data = await request<Transaction[] | { transactions: Transaction[] }>(
    "/admin/transactions",
    {},
    true,
  );
  return Array.isArray(data) ? data : (data.transactions ?? []);
}

/* ---------- Payments ---------- */

export async function createCheckoutSession(
  plan: "tutor-pro" | "student-pro",
): Promise<{ url: string }> {
  return request<{ url: string }>(
    "/payments/create-checkout-session",
    { method: "POST", body: JSON.stringify({ plan }) },
    true,
  );
}

export async function verifyCheckoutSession(
  sessionId: string,
): Promise<{ plan?: string; message?: string }> {
  return request<{ plan?: string; message?: string }>(
    "/payments/verify-session",
    { method: "POST", body: JSON.stringify({ sessionId }) },
    true,
  );
}
