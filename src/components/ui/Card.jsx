export default function Card({
  children,
  title,
  subtitle,
  actions,
  className = "",
  padding = true,
}) {
  return (
    <div className={`glass rounded-2xl shadow-2xl border-2 border-white/40 backdrop-blur-xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden group ${className}`}>
      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="shimmer absolute inset-0"></div>
      </div>
      
      {/* Gradient border glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
      
      {(title || actions) && (
        <div className="px-6 py-5 border-b border-white/30 bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-purple-600/10 flex items-center justify-between rounded-t-2xl relative z-10">
          <div>
            {title && (
              <h3 className="text-lg font-bold gradient-text">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-700 font-semibold">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className={padding ? "px-6 py-5 relative z-10" : "relative z-10"}>{children}</div>
    </div>
  );
}
