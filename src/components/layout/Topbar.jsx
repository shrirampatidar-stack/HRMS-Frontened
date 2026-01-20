export default function Topbar({ title, actions }) {
  return (
    <header className="h-16 glass-dark border-b-2 border-white/30 flex items-center justify-between px-6 sticky top-0 z-30 shadow-xl backdrop-blur-xl relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-purple-600/10 opacity-50"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
      
      <h2 className="text-xl font-black gradient-text relative z-10 flex items-center gap-2">
        <span className="text-2xl animate-float">📊</span>
        <span>{title || "Dashboard"}</span>
      </h2>
      {actions && <div className="flex items-center gap-3 relative z-10">{actions}</div>}
    </header>
  );
}
