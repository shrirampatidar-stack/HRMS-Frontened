export default function Loader({ size = "md", className = "" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <div
          className={`${sizes[size]} border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin shadow-xl`}
        />
        <div
          className={`${sizes[size]} border-4 border-transparent border-r-indigo-400 rounded-full animate-spin absolute inset-0 animate-reverse-spin`}
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>
    </div>
  );
}
