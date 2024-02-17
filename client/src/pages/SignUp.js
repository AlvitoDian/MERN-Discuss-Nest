import React from "react";
import { useState } from "react";
import axios from "axios";
import { useSignUp } from "../hooks/useSignUp";

export default function SingUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignUp();
  /* const [errorMessages, setErrorMessages] = useState({}); */

  //? Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signup(name, email, password);
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-neutral-800 to-neutral-900">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-zinc-700 p-8 rounded-xl shadow-md md:w-96 w-full">
          <h2 className="text-2xl font-bold mb-4 text-white">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-200">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="name"
                value={name}
                className="w-full border-gray-300 rounded-md p-2 bg-zinc-800 bg-opacity-90 shadow-lg text-gray-200"
                placeholder="Enter your username"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-200 ">
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
              <label htmlFor="password" className="block text-gray-200">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                className="w-full border-gray-300 rounded-md p-2 bg-zinc-800 bg-opacity-90 shadow-lg text-gray-200"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-400 text-dark font-medium p-2 rounded-md transition duration-300 ease-in-out hover:bg-emerald-600 transform"
              disabled={isLoading}
            >
              Sign Up
            </button>
            <p className="pt-3 text-gray-200">
              Already have account ? Login{" "}
              <a
                href="/login"
                className="underline font-medium text-emerald-400"
              >
                here
              </a>
            </p>
            {/* {errorMessages.length > 0 && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-5">
                <p>Error : </p>
                <ul>
                  {errorMessages.map((errorMessage, index) => (
                    <li key={index}>{errorMessage}</li>
                  ))}
                </ul>
              </div>
            )} */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-5">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
