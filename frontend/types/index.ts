export interface User {
  id: number;
  name: string;
  email: string;
}

export interface RVListing {
  id: number;
  title: string;
  description: string;
  location: string;
  price_per_day: string;
  owner: { id: number; name: string };
  created_at: string;
}

export interface Booking {
  id: number;
  start_date: string;
  end_date: string;
  status: "pending" | "confirmed" | "rejected";
  rv_listing: { id: number; title: string; location: string };
  hirer?: { id: number; name: string };
  created_at: string;
}

export interface Message {
  id: number;
  content: string;
  user: { id: number; name: string };
  created_at: string;
}

export interface ApiError {
  error?: string;
  errors?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}
