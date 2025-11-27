import { useEffect, useState } from "react";

export const useMockWebSocket = (initialMessages = []) => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = [
        "Market volatility rising...",
        "ETH just broke resistance!",
        "TSLA earnings report incoming!",
      ];
      const msg = randomMsg[Math.floor(Math.random() * randomMsg.length)];
      setMessages((prev) => [...prev, { id: Date.now(), sender: "System", text: msg, time: new Date().toLocaleTimeString() }]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = (text, sender = "You") => {
    setMessages((prev) => [...prev, { id: Date.now(), sender, text, time: new Date().toLocaleTimeString() }]);
  };

  return { messages, sendMessage, newMessage, setNewMessage };
};
