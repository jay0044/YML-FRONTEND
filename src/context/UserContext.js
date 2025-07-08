// import React, { createContext, useContext, useEffect, useState } from 'react';
// import SummaryApi from '../common';
// import { useDispatch } from 'react-redux';
// import { setUserDetails } from '../store/userSlice';

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const dispatch = useDispatch();
//   const [user, setUser] = useState(null);

//   // Initialize token from localStorage
//   const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken') || null);

//   // Fetch user info
//   const fetchUserDetails = async (token = authToken) => {
//     if (!token) {
//       console.warn('No auth token available');
//       return;
//     }

//     try {
//       const response = await fetch(SummaryApi.current_user.url, {
//         method: SummaryApi.current_user.method,
//         credentials: 'include',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const result = await response.json();

//       if (result.success) {
//         setUser(result.data);
//         dispatch(setUserDetails(result.data));
//       } else {
//         console.warn('User fetch failed:', result.message);
//         setUser(null);
//       }
//     } catch (err) {
//       console.error('Error fetching user details:', err);
//     }
//   };

//   useEffect(() => {
//     if (authToken) {
//       fetchUserDetails(authToken);
//     }
//   }, [authToken]);

//   // Sync token changes with localStorage
//   const updateAuthToken = (token) => {
//     if (typeof token === 'string') {
//       localStorage.setItem('authToken', token);
//       setAuthToken(token);
//     } else {
//       console.error('Invalid token format');
//     }
//   };

//   const clearUserSession = () => {
//     localStorage.removeItem('authToken');
//     setAuthToken(null);
//     setUser(null);
//     dispatch(setUserDetails(null));
//   };

//   return (
//     <UserContext.Provider
//       value={{
//         user,
//         authToken,
//         setAuthToken: updateAuthToken,
//         fetchUserDetails,
//         clearUserSession,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);





// import React, { createContext, useContext, useEffect, useState } from "react";
// import SummaryApi from "../common";
// import { useDispatch } from "react-redux";
// import { setUserDetails } from "../store/userSlice";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const dispatch = useDispatch();

//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem("user");
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const [authToken, setAuthToken] = useState(
//     () => localStorage.getItem("authToken") || null
//   );
//   const [loading, setLoading] = useState(true); // Optional loading state for startup

//   const fetchUserDetails = async (token = authToken) => {
//     if (!token) {
//       console.warn("No auth token available");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(SummaryApi.current_user.url, {
//         method: SummaryApi.current_user.method,
//         credentials: "include",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();

//       if (result.success) {
//         setUser(result.data);
//         localStorage.setItem(
//           "user",
//           JSON.stringify({
//             _id: result.data._id,
//             role: result.data.role,
//           })
//         );
//         dispatch(setUserDetails(result.data));
//       } else {
//         console.warn("User fetch failed:", result.message);
//         setUser(null);
//         localStorage.removeItem("user");
//         dispatch(setUserDetails(null));
//       }
//     } catch (err) {
//       console.error("Error fetching user details:", err);
//       setUser(null);
//       localStorage.removeItem("user");
//       dispatch(setUserDetails(null));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       const parsedUser = JSON.parse(savedUser);
//       setUser(parsedUser);
//       dispatch(setUserDetails(parsedUser));
//     }

//     if (authToken) {
//       fetchUserDetails(authToken);
//     } else {
//       setLoading(false);
//     }
//   }, [authToken]);

//   const updateAuthToken = (token) => {
//     if (typeof token === "string") {
//       localStorage.setItem("authToken", token);
//       setAuthToken(token);
//     } else {
//       console.error("Invalid token format");
//     }
//   };

//   const clearUserSession = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("user");
//     setAuthToken(null);
//     setUser(null);
//     dispatch(setUserDetails(null));
//   };

//   return (
//     <UserContext.Provider
//       value={{
//         user,
//         authToken,
//         setAuthToken: updateAuthToken,
//         fetchUserDetails,
//         clearUserSession,
//         loading, // Expose loading for conditional rendering
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);




import React, { createContext, useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const dispatch = useDispatch();

  const [user, setUser] = useState(null); // ✅ In-memory only, not localStorage
  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem("authToken") || null
  );
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async (token = authToken) => {
    if (!token) {
      console.warn("⚠️ No auth token available");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        setUser(result.data);
        dispatch(setUserDetails(result.data));
      } else {
        console.warn("⚠️ User fetch failed:", result.message);
        setUser(null);
        dispatch(setUserDetails(null));
      }
    } catch (err) {
      console.error("❌ Error fetching user details:", err);
      setUser(null);
      dispatch(setUserDetails(null));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchUserDetails(authToken);
    } else {
      setLoading(false);
    }
  }, [authToken]);

  const updateAuthToken = (token) => {
    if (typeof token === "string") {
      localStorage.setItem("authToken", token);
      setAuthToken(token);
    } else {
      console.error("❌ Invalid token format");
    }
  };

  const clearUserSession = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setUser(null);
    dispatch(setUserDetails(null));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        authToken,
        setAuthToken: updateAuthToken,
        fetchUserDetails,
        clearUserSession,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
