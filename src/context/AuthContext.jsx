import React, { createContext, useContext, useEffect, useState } from "react";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";
import { useStoreUser } from "../hooks/useUsers";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { persistNewUser } = useStoreUser();
  const { findOne } = useOfflineStorage();

  const login = async (authUserData) => {
    // Store the new user
    const newUser = await persistNewUser(authUserData);
    // Reset other users' isCurrentUser and set the new user
    // await resetAndSetCurrentUser(newUser.id);
    try {
      setUser(authUserData); // Ensure userData is valid
    } catch (err) {
      console.error("Error in setUser:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setCurrentUser = async (userId) => {
    const foundUser = await findOne("users", { where: { id: userId } });
    if (foundUser?.isAuthenticated) {
      setUser(foundUser);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, loading, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
