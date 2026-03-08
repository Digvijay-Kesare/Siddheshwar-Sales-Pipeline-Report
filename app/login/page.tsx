"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const router = useRouter();

  async function handleLogin(){

    setLoading(true);

    const res = await fetch("/api/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({email,password})
    });

    const data = await res.json();

    setLoading(false);

    if(!res.ok){
      alert(data.message);
      return;
    }

    localStorage.setItem("token",data.token);

    router.push("/dashboard");

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 px-4">

      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          Login
        </h1>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm text-gray-600">Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition duration-300"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?
        </div>

        {/* Signup Redirect */}
        <button
          onClick={()=>router.push("/signup")}
          className="w-full mt-3 border border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-lg font-semibold transition"
        >
          Create New Account
        </button>

      </div>

    </div>

  );

}