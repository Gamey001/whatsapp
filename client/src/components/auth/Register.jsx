import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(username, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ddf1f7] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#00a884] mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.98-.34-2.22.08-2.81.78l-1.6 2.03c-2.83-1.35-5.48-3.9-6.89-6.83l2.03-1.66c.71-.6 1.08-1.82.75-2.8-.37-1.11-.56-2.3-.56-3.53 0-1.71-1.01-3.29-2.72-3.29H5.11C3.38 3 2 4.3 2 5.97c0 9.94 8.06 18 17.99 18 1.66 0 2.99-1.38 2.99-3.08v-2.88c0-1.7-1.33-3.01-2.99-3.01z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">WhatsApp Web</h1>
          <p className="text-gray-500 text-sm mt-1">Create your account</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-2 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884] focus:border-transparent"
                placeholder="johndoe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884] focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00a884] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#008069] transition-colors disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-[#00a884] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
