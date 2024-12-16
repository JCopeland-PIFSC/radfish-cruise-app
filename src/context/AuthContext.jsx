import React, { createContext, useContext, useEffect, useState } from "react";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";
import { useAddUser } from "../hooks/useUsers";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { mutateAsync: addUser } = useAddUser();
  const { findOne } = useOfflineStorage();

  // Initialize user from IndexedDB
  useEffect(() => {
    const loadUserFromDB = async () => {
      const storedUser = await findOne("users", { isAuthenticated: 1 });
      if (storedUser?.isAuthenticated) {
        setUser(storedUser);
      }
      setLoading(false);
    };

    loadUserFromDB();
  }, []);

  const login = async (userData) => {
    await addUser({ userData });
    setUser(userData);
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
