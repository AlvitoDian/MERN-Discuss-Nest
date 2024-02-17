import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    const apiUrl = process.env.REACT_APP_DOMAIN_API;
    const response = await fetch(`${apiUrl}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      dispatch({ type: "LOGIN", payload: json });
      navigate("/");
    }
  };

  return { login, isLoading, error };
};

// import { useState } from "react";
// import jwt from "jsonwebtoken";
// import { AuthContext } from "../context/AuthContext";
// import { useAuthContext } from "./useAuthContext";

// export const useLogin = () => {
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(null);
//   const { dispatch } = useAuthContext();

//   const login = async (email, password) => {
//     setIsLoading(true);
//     setError(null);

//     const response = await fetch("http://localhost:5000/login", {
//       method: "POST",
//       credentials: "include",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const json = await response.json();

//     if (!response.ok) {
//       setIsLoading(false);
//       setError(json.error);
//       return;
//     }

//     // Decode the token to get user information
//     const decodedToken = jwt.decode(json.token);

//     // Assuming your token includes user ID and email in the payload
//     const userId = decodedToken._id;
//     const userEmail = decodedToken.email;

//     // Dispatch user information to the AuthContext
//     dispatch({ type: "LOGIN", payload: { id: userId, email: userEmail } });

//     setIsLoading(false);
//   };

//   return { login, isLoading, error };
// };
