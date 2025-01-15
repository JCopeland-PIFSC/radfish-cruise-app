import React, { createContext, useContext, useEffect, useState } from "react";
import { useStoreUser } from "../hooks/useStoreUsers";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const {
    loginUser,
    resetAndSetCurrentUser,
    signOutUser,
    getAllUsers,
    getCurrentUser,
  } = useStoreUser();
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    setUserLoading(false);
  }, [getCurrentUser]);

  const login = async (authUserData) => {
    try {
      await loginUser(authUserData);
    } catch (err) {
      console.error("Error in login:", err);
      throw err;
    } finally {
      setUserLoading(false);
    }
  };

  const switchUser = async (authUserData) => {
    try {
      await resetAndSetCurrentUser(authUserData.id);
    } catch (err) {
      console.error("Error in switchUser:", err);
      throw err;
    } finally {
      setUserLoading(false);
    }
  };

  const signOut = async (userId) => {
    try {
      await signOutUser(userId);
    } catch (err) {
      console.error("Error in signOut:", err);
      throw err;
    } finally {
      setUserLoading(false);
    }
  };

  const user = getCurrentUser();

  const allUsers = getAllUsers();

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers,
        login,
        switchUser,
        signOut,
        userLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
