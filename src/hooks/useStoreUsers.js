import { useState, useEffect } from "react";

export const useStoreUser = () => {
  const [currentUser, setCurrentUser] = useState(null);

  // Re-hydrate from localStorage on mount
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const authenticated = users.find((u) => u.isAuthenticated);
    if (authenticated) {
      setCurrentUser(authenticated);
    }
  }, []);

  // Helper: Save the updated array of users to localStorage
  const saveUserToLocalStorage = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  // Create or log in a user
  const loginUser = async (userData) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    // Find an existing user with the same id
    let existingUser = users.find((u) => u.id === userData.id);

    // If not found, create a new one
    if (!existingUser) {
      existingUser = { ...userData, id: userData.id };
      users.push(existingUser);
    }

    // Mark all users as not authenticated, then authenticate this user
    users = users.map((u) => ({ ...u, isAuthenticated: false }));
    // Update the existing user in the array
    users = users.map((u) =>
      u.id === existingUser.id ? { ...existingUser, isAuthenticated: true } : u,
    );
    
    saveUserToLocalStorage(users);
    setCurrentUser(existingUser);
  };

  // Reset all users to not authenticated, then set a given user as authenticated
  const resetAndSetCurrentUser = async (userId) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map((u) => ({
      ...u,
      isAuthenticated: u.id === userId,
    }));
    saveUserToLocalStorage(users);
    const newCurrent = users.find((u) => u.id === userId);
    setCurrentUser(newCurrent || null);
  };

  // Get the currently logged-in user
  const getCurrentUser = () => currentUser;

  // Retrieve all users
  const getAllUsers = () => {
    return JSON.parse(localStorage.getItem("users")) || [];
  };

  return {
    loginUser,
    resetAndSetCurrentUser,
    getCurrentUser,
    getAllUsers,
  };
};
