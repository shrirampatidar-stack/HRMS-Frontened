export default function Badge({ 
  children, 
  variant = "default",
  className = "" 
}) {
  const variants = {
    default: "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 shadow-md",
    primary: "bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg shadow-blue-500/50",
    success: "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/50",
    danger: "bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg shadow-red-500/50",
    warning: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/50",
    info: "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/50",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black ${variants[variant]} ${className} transition-all duration-300 hover:scale-125 hover:shadow-lg transform cursor-default animate-bounce-in`}
    >
      <span className="relative z-10">{children}</span>
    </span>
  );
}
