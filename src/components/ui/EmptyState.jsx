export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {icon && (
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-purple-200 via-indigo-200 to-purple-200 mb-6 shadow-2xl animate-float relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 opacity-20 animate-pulse-glow"></div>
          <div className="text-purple-600 relative z-10 text-4xl animate-bounce-in">
            {icon}
          </div>
        </div>
      )}
      <h3 className="mt-2 text-xl font-black gradient-text">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto font-medium">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
