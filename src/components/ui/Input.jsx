export default function Input({
  label,
  error,
  required = false,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 backdrop-blur-sm font-medium ${
          error
            ? "border-red-400 bg-red-50/70 focus:border-red-500 focus:ring-red-500 shadow-lg shadow-red-500/30 animate-pulse-glow"
            : "border-purple-300 bg-white/90 hover:border-purple-400 hover:shadow-lg focus:shadow-xl focus:shadow-purple-500/30 hover:scale-[1.01]"
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
