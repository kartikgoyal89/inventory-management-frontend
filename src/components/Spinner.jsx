import { Loader2 } from "lucide-react";

const Spinner = ({ className = "h-6 w-6" }) => (
  <Loader2 className={`animate-spin text-indigo-600 ${className}`} />
);

export default Spinner;
