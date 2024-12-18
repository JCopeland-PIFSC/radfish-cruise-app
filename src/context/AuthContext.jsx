import React, { createContext, useContext, useEffect, useState } from "react";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";
import { useStoreUser, useResetCurrentUser } from "../hooks/useUsers";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { persistNewUser } = useStoreUser();
  const { resetAndSetCurrentUser } = useResetCurrentUser();
  const { findOne } = useOfflineStorage();

  // Initialize user on mount
  useEffect(() => {
    loadUserFromDB();
  }, []);

  // Function to load the current user from IndexedDB
  const loadUserFromDB = async () => {
    const storedUser = await findOne("users", { isCurrentUser: 1 });
    if (storedUser?.isAuthenticated) {
      setUser(storedUser);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (authUserData) => {
    // Store the new user
    const newUser = await persistNewUser(authUserData);
    // Reset other users' isCurrentUser and set the new user
    await resetAndSetCurrentUser(newUser.id);
    try {
      setUser(authUserData); // Ensure userData is valid
    } catch (err) {
      console.error("Error in setUser:", err);
      throw err;
    }
  };

  const logout = async () => {
    await updateUser({
      userId: user.id,
      updates: { isAuthenticated: 0, isCurrent: 0 },
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, loadUserFromDB }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
