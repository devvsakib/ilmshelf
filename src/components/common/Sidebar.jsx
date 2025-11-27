import { Home, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();
  const linkClass = (path) =>
    `flex items-center gap-2 p-2 rounded-lg transition-colors ${
      pathname === path
        ? "bg-blue-500 text-white"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <aside className="w-60 h-screen border-r border-gray-200 dark:border-gray-700 p-4">
      <nav className="flex flex-col gap-2">
        <Link to="/" className={linkClass("/")}>
          <Home size={18} /> Dashboard
        </Link>
        <Link to="/chat" className={linkClass("/chat")}>
          <MessageCircle size={18} /> Chat
        </Link>
      </nav>
    </aside>
  );
}
