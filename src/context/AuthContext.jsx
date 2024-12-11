import React, { createContext, useContext, useEffect, useState } from "react";
import { useAddUser } from "../hooks/useCruises";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { mutateAsync: addUser } = useAddUser();
  const { create, findOne } = useOfflineStorage();


  // Initialize user from IndexedDB
  useEffect(() => {
    const loadUserFromDB = async () => {
        const storedUser = await findOne('users', { username: 'q' });
      if (storedUser?.isAuthenticated) {
        setUser(storedUser);
      }
      setLoading(false);
    };

    loadUserFromDB();
  }, []);

  const login = async (userData) => {
    userData = { ...userData, isAuthenticated: true };
    const user = await addUser({ userData });
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
