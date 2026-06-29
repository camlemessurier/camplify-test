"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import MessageList from "@/components/MessageList";
import type { Message } from "@/types";

export default function MessagesSection({ listingId }: { listingId: number }) {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await api.fetchMessages(listingId);
      setMessages(data);
      setAccessDenied(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "Forbidden") setAccessDenied(true);
    }
  }, [listingId]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchMessages]);

  if (!isAuthenticated) {
    return (
      <p className="text-[#8c7b6e] text-sm text-center py-4">
        Sign in to view or send messages.
      </p>
    );
  }

  if (accessDenied) {
    return (
      <p className="text-[#8c7b6e] text-sm text-center py-4">
        Book this rig to message the owner.
      </p>
    );
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setError("");
    setLoading(true);
    try {
      await api.createMessage(listingId, content);
      setContent("");
      await fetchMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <MessageList messages={messages} />
      {error && (
        <p className="text-[#f87171] text-sm">{error}</p>
      )}
      <form onSubmit={handleSend} className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          rows={2}
          className="flex-1 px-3 py-2 rounded bg-[#0a0604] border border-[#2a1a0c] focus:border-[#c73d0f] focus:outline-none text-[#d4c9be] placeholder-[#8c7b6e] resize-none text-sm transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="bg-[#c73d0f] hover:bg-[#e05a28] disabled:opacity-40 text-[#faf6f2] font-medium px-4 rounded transition-colors self-end py-2"
        >
          Send
        </button>
      </form>
    </div>
  );
}
