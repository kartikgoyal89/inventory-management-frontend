import { Link } from "react-router-dom";
import { Boxes } from "lucide-react";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50 text-center">
    <Boxes className="h-10 w-10 text-indigo-600" />
    <h1 className="text-3xl font-bold text-gray-900">404</h1>
    <p className="text-sm text-gray-500">The page you're looking for doesn't exist.</p>
    <Link to="/" className="mt-2 text-sm font-medium text-indigo-600 hover:underline">
      Back to dashboard
    </Link>
  </div>
);

export default NotFound;
