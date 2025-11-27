import { motion } from "framer-motion";

export default function MessageList({ messages }) {
  return (
    <div className="flex flex-col space-y-3">
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`flex items-start gap-3 ${
            msg.sender === "You" ? "justify-end" : "justify-start"
          }`}
        >
          {msg.sender !== "You" && (
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-800 dark:text-gray-200">
              {msg.sender[0]}
            </div>
          )}
          <div
            className={`max-w-xs px-4 py-2 rounded-2xl break-words ${
              msg.sender === "You"
                ? "bg-blue-500 text-white rounded-br-none"
                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
            }`}
          >
            <div className="text-sm">{msg.text}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
              {msg.time}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
