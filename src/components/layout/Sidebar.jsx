import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      path: "/employees",
      label: "Employees",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      path: "/attendance",
      label: "Attendance",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass-dark border-r border-white/20 flex flex-col z-40 shadow-2xl">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/20 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        <h1 className="text-xl font-black text-white drop-shadow-2xl relative z-10 flex items-center gap-2">
          <span className="text-2xl animate-float">✨</span>
          <span>HRMS Lite</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden group ${
                active
                  ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-purple-500/50 transform scale-105 animate-glow-pulse"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-600 hover:shadow-lg hover:transform hover:scale-105"
              }`}
            >
              {/* Active indicator */}
              {active && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full shadow-lg"></div>
              )}
              {/* Shimmer on hover */}
              {!active && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="shimmer absolute inset-0"></div>
                </div>
              )}
              <span className={`relative z-10 transform transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10 bg-gradient-to-r from-purple-600/20 to-indigo-600/20">
        <p className="text-xs text-gray-600 font-medium">
          © 2026 HRMS Lite
        </p>
      </div>
    </aside>
  );
}
