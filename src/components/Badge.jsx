const variants = {
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
  neutral: "bg-gray-100 text-gray-700",
  info: "bg-indigo-100 text-indigo-700",
};

const Badge = ({ children, variant = "neutral", className = "" }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
