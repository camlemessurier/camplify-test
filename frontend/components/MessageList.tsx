import type { Message } from "@/types";

export default function MessageList({ messages }: { messages: Message[] }) {
  if (messages.length === 0) {
    return (
      <p className="text-[#8c7b6e] text-sm text-center py-6">
        No messages yet. Say something.
      </p>
    );
  }

  return (
    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
      {messages.map((message) => (
        <div key={message.id} className="bg-[#0a0604] border border-[#2a1a0c] rounded p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[#faf6f2] text-sm font-medium">
              {message.user.name}
            </span>
            <span className="text-[#8c7b6e] text-xs">
              {new Date(message.created_at).toLocaleString()}
            </span>
          </div>
          <p className="text-[#d4c9be] text-sm">{message.content}</p>
        </div>
      ))}
    </div>
  );
}
