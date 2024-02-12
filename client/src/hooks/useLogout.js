import { AuthContext } from "../context/AuthContext";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

/* export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = () => {
    //? Clear Cookies Token User
    document.cookie =
      "accessToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    document.cookie =
      "refreshToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";

    //? Dispatch logout action
    dispatch({ type: "LOGOUT" });
  };

  return { logout };
}; */
export const useLogout = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const logout = async () => {
    try {
      // Mengirim permintaan ke endpoint logout di backend
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });

      // Dispatch logout action
      dispatch({ type: "LOGOUT" });

      // Mengarahkan pengguna kembali ke halaman '/'
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle error (misalnya, menampilkan pesan kesalahan kepada pengguna)
    }
  };

  return { logout };
};
