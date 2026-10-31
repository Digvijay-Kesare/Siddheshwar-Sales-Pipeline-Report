"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Droplet, ArrowLeft, Lock, Mail, User, Loader2 } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const router = useRouter();

  async function handleSignup(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      setLoading(false);

      if (!res.ok) {
        setErrorMsg(data.message || "Signup failed. Please try again.");
        return;
      }

      setSuccessMsg("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50/40 to-slate-100 p-4">
      {/* Return Home Link */}
      <div className="w-full max-w-md mb-4">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-green-700 transition"
        >
          <ArrowLeft size={14} />
          Back to Homepage
        </button>
      </div>

      <div className="bg-white border border-gray-200 shadow-xl rounded-2xl w-full max-w-md p-7 md:p-9 text-gray-900">
        {/* Brand Icon & Heading */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-green-100 text-green-700 rounded-2xl mb-3 shadow-inner">
            <Droplet size={32} />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Create Account
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Sign up to start creating pipeline survey reports
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs md:text-sm rounded-lg font-medium">
            {errorMsg}
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-5 p-3.5 bg-green-50 border border-green-200 text-green-800 text-xs md:text-sm rounded-lg font-medium">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                required
                placeholder="Digvijay Kesare"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg pl-10 pr-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg pl-10 pr-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="password"
                required
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg pl-10 pr-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-3 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs text-gray-500 uppercase">
            <span className="bg-white px-3">Already registered?</span>
          </div>
        </div>

        {/* Login Redirect */}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full bg-white border border-green-600 text-green-700 hover:bg-green-50 py-2.5 rounded-lg font-semibold text-sm transition"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
