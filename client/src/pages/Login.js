import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  axios.defaults.withCredentials = true;

  //? Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Terjadi kesalahan saat login:", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-neutral-800 to-neutral-900">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-zinc-700 p-8 rounded-xl shadow-md md:w-96 w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-200 pb-1 ">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                className="w-full border-gray-300 rounded-md p-2 bg-zinc-800 bg-opacity-90 shadow-lg text-gray-200"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-200 pb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                className="w-full border-gray-300 rounded-md p-2 bg-zinc-800 bg-opacity-90 shadow-lg text-gray-200"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-400 text-dark font-medium p-2 rounded-md transition duration-300 ease-in-out hover:bg-emerald-600 transform"
              disabled={isLoading}
            >
              Login
            </button>
            <p className="pt-3 text-gray-200">
              Dosen't have account ? Register{" "}
              <a
                href="/register"
                className="underline font-medium text-emerald-400"
              >
                here
              </a>
            </p>
          </form>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-5">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
