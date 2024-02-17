import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

export const useSignUp = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const signup = async (name, email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }

    if (response.ok) {
      /* //? Save user to local storage
      localStorage.setItem("user", JSON.stringify(json)); */

      //? Update Auth Context
      dispatch({ type: "LOGIN", payload: json });

      setIsLoading(false);
      navigate("/");
    }
  };

  return { signup, isLoading, error };
};
