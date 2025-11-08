"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // If using Next.js
import pb from "../_lib/pb";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const authData = await pb.collection("users").authWithPassword(
        username, // username or email
        password
      );

      // Redirect (example to dashboard page)
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      {/* Left: Image */}
      <div className="w-1/2 h-screen hidden lg:flex items-center justify-center bg-blue-500">
        <img src="/images/logo.png" alt="logo" className="w-60 h-auto rounded-2xl" />
      </div>

      {/* Right: Login Form */}
      <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>

        {error && (
          <p className="mb-4 text-red-500 font-medium text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-600 font-medium"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autoComplete="off"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-600 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autoComplete="off"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
