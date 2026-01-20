export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  type = "button",
  className = "",
  fullWidth = false,
  ...props
}) {
  const baseStyles = "font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 active:scale-95 shadow-xl hover:shadow-2xl relative overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white hover:from-purple-700 hover:via-indigo-700 hover:to-purple-700 focus:ring-purple-500 shadow-purple-500/50 hover:shadow-purple-500/70 animate-glow-pulse",
    secondary: "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400 focus:ring-gray-500",
    danger: "bg-gradient-to-r from-red-500 via-pink-600 to-red-500 text-white hover:from-red-600 hover:via-pink-700 hover:to-red-600 focus:ring-red-500 shadow-red-500/50 hover:shadow-red-500/70",
    outline: "border-2 border-purple-400 text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 focus:ring-purple-500 bg-white/70 backdrop-blur-sm hover:border-purple-500",
    ghost: "text-gray-700 hover:bg-white/60 focus:ring-gray-500 backdrop-blur-sm",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {/* Shimmer effect on hover */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="shimmer absolute inset-0"></span>
      </span>
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </button>
  );
}
