import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Boxes } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import { getErrorMessage } from "../utils/format";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}`);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <Boxes className="h-9 w-9 text-indigo-600" />
          <h1 className="text-xl font-semibold text-gray-900">
            StockFlow CI/CD Inventory
          </h1>
          <p className="text-sm text-gray-500">
            Sign in to manage your inventory StockFlow
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <Input
            label="Email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
