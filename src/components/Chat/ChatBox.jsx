import { useMockWebSocket } from "@/hooks/useMockWebSocket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatBox() {
  const { messages, sendMessage, newMessage, setNewMessage } = useMockWebSocket();

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto">
        <MessageList messages={messages} />
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <MessageInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={sendMessage}
        />
      </div>
    </div>
  );
}
