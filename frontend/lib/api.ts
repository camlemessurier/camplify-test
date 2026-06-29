import type { RVListing, Booking, Message, AuthResponse } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("rv_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 204) return undefined as T;

  const data = await res.json();
  if (!res.ok) {
    const msg =
      data.error ?? (data.errors as string[])?.join(", ") ?? "Request failed";
    throw new Error(msg);
  }
  return data as T;
}

export const api = {
  fetchListings: () => request<RVListing[]>("/listings"),
  fetchListing: (id: number) => request<RVListing>(`/listings/${id}`),
  createListing: (data: Partial<RVListing>) =>
    request<RVListing>("/listings", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateListing: (id: number, data: Partial<RVListing>) =>
    request<RVListing>(`/listings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteListing: (id: number) =>
    request<void>(`/listings/${id}`, { method: "DELETE" }),

  createBooking: (
    listingId: number,
    data: { start_date: string; end_date: string }
  ) =>
    request<Booking>(`/listings/${listingId}/bookings`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  fetchBookingsAsHirer: () => request<Booking[]>("/bookings/as_hirer"),
  fetchBookingsAsOwner: () => request<Booking[]>("/bookings/as_owner"),
  confirmBooking: (id: number) =>
    request<Booking>(`/bookings/${id}/confirm`, { method: "PATCH" }),
  rejectBooking: (id: number) =>
    request<Booking>(`/bookings/${id}/reject`, { method: "PATCH" }),

  fetchMessages: (listingId: number) =>
    request<Message[]>(`/listings/${listingId}/messages`),
  createMessage: (listingId: number, content: string) =>
    request<Message>(`/listings/${listingId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  logout: () => request<void>("/auth/logout", { method: "DELETE" }),
};
