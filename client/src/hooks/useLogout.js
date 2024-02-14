import { AuthContext } from "../context/AuthContext";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();
  const { dispatch, user } = useAuthContext();
  const apiUrl = process.env.REACT_APP_DOMAIN_API;

  const logout = async () => {
    try {
      const response = await fetch(`${apiUrl}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      });

      dispatch({ type: "LOGOUT" });

      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return { logout };
};
