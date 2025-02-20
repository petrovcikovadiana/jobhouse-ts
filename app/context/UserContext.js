"use client";
import { createContext, useContext, useState, useEffect } from "react";

// create context
const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // loading user after start app
  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth");
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false); // after finishing logging we set loading to false
    }
  };

  //  call fetchUser after loading app
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

//  hook for access to userContext
export function useUser() {
  return useContext(UserContext);
}
