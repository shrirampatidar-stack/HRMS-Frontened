export function Table({ children, className = "" }) {
  return (
    <div className={`overflow-x-auto rounded-xl border-2 border-white/30 shadow-lg backdrop-blur-sm ${className}`}>
      <table className="min-w-full divide-y divide-white/20 bg-white/80 backdrop-blur-sm">
        {children}
      </table>
    </div>
  );
}

export default Table;

export function TableHeader({ children }) {
  return (
    <thead className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      <tr className="relative z-10">{children}</tr>
    </thead>
  );
}

export function TableHeaderCell({ children, className = "" }) {
  return (
    <th
      className={`px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}

export function TableBody({ children }) {
  return <tbody className="bg-white/90 divide-y divide-white/20 backdrop-blur-sm">{children}</tbody>;
}

export function TableRow({ children, onClick, className = "" }) {
  return (
    <tr
      onClick={onClick}
      className={`${onClick ? "cursor-pointer hover:bg-gradient-to-r hover:from-purple-50/70 hover:to-indigo-50/70 transition-all duration-300 hover:shadow-md group relative" : ""} ${className}`}
    >
      {onClick && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-full"></div>
      )}
      {children}
    </tr>
  );
}

export function TableCell({ children, className = "" }) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ${className}`}>
      {children}
    </td>
  );
}
