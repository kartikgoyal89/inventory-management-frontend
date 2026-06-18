const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>
    {children}
  </div>
);

export default Card;
