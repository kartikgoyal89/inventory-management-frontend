const Select = ({ label, error, className = "", children, ...rest }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <select
      className={`rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${className}`}
      {...rest}
    >
      {children}
    </select>
    {error && <span className="text-xs text-red-600">{error}</span>}
  </div>
);

export default Select;
