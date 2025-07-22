import { createContext, useState, useEffect } from "react";

const Context = createContext(null);

export const ContextProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem("authToken") || null
  );

  // Save auth token
  const saveAuthToken = (token) => {
    if (typeof token === "string") {
      setAuthToken(token);
      localStorage.setItem("authToken", token);
      console.log("✅ Auth token saved:", token);
    } else {
      console.error("❌ Auth token must be a string");
    }
  };

  // Clear auth token
  const clearAuthToken = () => {
    setAuthToken(null);
    localStorage.removeItem("authToken");
    console.log("🧹 Auth token cleared from localStorage");
  };

  // Optional: Sync authToken from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken && authToken !== storedToken) {
      setAuthToken(storedToken);
      console.log("🔄 Synced auth token from localStorage");
    }
  }, []);

  return (
    <Context.Provider value={{ authToken, saveAuthToken, clearAuthToken }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
