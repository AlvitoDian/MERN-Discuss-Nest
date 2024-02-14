import { createContext, useReducer, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { set } from "date-fns";
export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

/* export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        dispatch({ type: "LOGIN", payload: decodedToken });
      } catch (error) {
        console.error("Error decoding JWT token:", error);
      }
    }

    setLoading(false);
  }, []);

  if (loading) {
    return;
  }

  console.log("AuthContext State:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}; */

/* export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAndRenewToken = async () => {
      const token = Cookies.get("accessToken");

      if (!token) {
        console.log("No access token found, renewing...");
        try {
          // Make a request to renewAccessToken in the backend

          await axios.post(
            "http://localhost:5000/renew-token",
            {},
            { withCredentials: true }
          );

          // After successful renewal, get the new access token
          const newToken = Cookies.get("accessToken");

          if (newToken) {
            const decodedToken = jwtDecode(newToken);
            dispatch({ type: "LOGIN", payload: decodedToken });
          }
        } catch (error) {
          console.error("Error renewing access token:", error);
        }
      } else {
        try {
          const decodedToken = jwtDecode(token);
          dispatch({ type: "LOGIN", payload: decodedToken });
        } catch (error) {
          console.error("Error decoding JWT token:", error);
        }
      }

      setLoading(false);
    };

    checkAndRenewToken();
  }, []);

  if (loading) {
    return;
  }

  console.log("AuthContext State:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}; */

/* export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = Cookies.get("accessToken");

      if (!accessToken) {
        await renewAccessToken();
      }

      if (accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          dispatch({ type: "LOGIN", payload: decodedToken });
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const renewAccessToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/renew-token",
        {},
        { withCredentials: true }
      );
      console.log(response);
      const newAccessToken = response.data.accessToken;

      // Update the cookies with the new access token
      Cookies.set("accessToken", newAccessToken);

      // Decode and update the user in the context
      const decodedToken = jwtDecode(newAccessToken);
      dispatch({ type: "LOGIN", payload: decodedToken });
    } catch (error) {
      console.error("Error renewing access token:", error);
      // Handle the error or redirect to login page
    }
  };

  if (loading) {
    return;
  }

  console.log("AuthContext State:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}; */

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_DOMAIN_API;

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = Cookies.get("accessToken");
      const statusToken = Cookies.get("statusToken");

      /* console.log("accesToken : ", accessToken); */
      setLoading(false);

      if (!accessToken && statusToken) {
        setLoading(false);
        await renewAccessToken();
      }

      if (accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          dispatch({ type: "LOGIN", payload: decodedToken });
        } catch (error) {
          console.error("Error decoding token:", error);
        } finally {
          setLoading(false); // Set loading to false after obtaining accessToken
        }
      }
    };
    checkAuth();
    // Jalankan useEffect hanya jika statusToken ada
  }, []);

  const renewAccessToken = async () => {
    // Set loading to true before making the Axios request
    try {
      await axios.post(`${apiUrl}/renew-token`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Error renewing access token:", error);
      // Handle the error or redirect to the login page
    } finally {
      window.location.reload();
      // Set loading to false after the Axios request is complete
    }
  };

  if (loading) {
    return;
  }

  /* console.log("AuthContext State:", state); */

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
