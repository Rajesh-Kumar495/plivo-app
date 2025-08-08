"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc"; // You might need to install react-icons

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // To use react-icons, first run: npm install react-icons

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/dashboard");
    }
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-600">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-8 p-8 bg-gray-800 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Welcome back! Please enter your details.
          </p>
        </div>

        {error && (
          <div className="bg-red-400 text-white p-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
        >
          <FcGoogle className="h-5 w-5 mr-3" />
          Sign in with Google
        </button>

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleCredentialsSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              required
            />
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          <p>
            Dummy credentials for testing: <br />
            Email: <span className="text-white">test@example.com</span> <br />
            Password: <span className="text-white">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
