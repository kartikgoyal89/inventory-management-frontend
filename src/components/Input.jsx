const Input = ({ label, error, className = "", ...rest }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input
      className={`rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${className}`}
      {...rest}
    />
    {error && <span className="text-xs text-red-600">{error}</span>}
  </div>
);

export default Input;
