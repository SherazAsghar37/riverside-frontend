import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mic, Mail, Lock, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { login } from "../authSlice";
import Footer from "../../../shared/components/Footer";
import { Button } from "@/components/ui/button";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (user && user.token) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (!email || !password) {
      setLocalError("Please fill in all fields");
      return;
    }
    dispatch(login({ email, password }) as any);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--secondary-background)]">
      <div className="flex flex-col md:flex-row flex-grow h-[100vh]">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 ">
          <div className="max-w-md mx-auto w-full">
            <Link to="/" className="flex items-center space-x-2 mb-10">
              <Mic size={32} className="text-primary" />
              <span className="text-[18px] font-bold tracking-[4px]">
                RIVERSIDE
              </span>
            </Link>

            <h1 className="text-[25px] font-bold mb-1">Welcome back</h1>
            <p className="text-[var(--muted-foreground)] mb-8">
              Log in to your account to continue
            </p>

            {(localError || error) && (
              <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg flex items-start mb-6">
                <AlertCircle size={20} className="mr-3 shrink-0 mt-0.5" />
                <span>{localError || error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail
                      size={18}
                      className="text-[var(--muted-foreground)]"
                    />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10 bg-[var(--input-fields)] border-0 text-sm py-3"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-500" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10 bg-[var(--input-fields)] border-0 text-sm py-3"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex justify-end items-center mb-10">
                <Link
                  to="/"
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                className={`btn btn-primary w-full flex justify-center ${
                  loading ? "opacity-80 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Log in"
                )}
              </Button>

              <div className="mt-6 text-center">
                <p className="text-[var(--muted-foreground)] text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-primary hover:text-indigo-300 font-medium text-sm"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from--var(--secondary-background) to-primary/50 relative">
          <div className="absolute inset-0 bg-black/40"></div>
          <img
            src="https://images.pexels.com/photos/4062560/pexels-photo-4062560.jpeg"
            alt="Recording studio"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
          />
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <div className="max-w-md text-center">
              <h2 className="text-3xl font-bold mb-4">
                Create studio-quality content
              </h2>
              <p className="text-gray-300">
                Join thousands of podcasters, interviewers, and content creators
                making professional recordings with WaveStudio.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
