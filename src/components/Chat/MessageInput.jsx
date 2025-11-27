import { Send } from "lucide-react";

export default function MessageInput({ value, onChange, onSend }) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend(value)}
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={() => onSend(value)}
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center"
      >
        <Send size={18} />
      </button>
    </div>
  );
}
