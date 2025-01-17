import { useState, useEffect } from "react";

export const useStoreUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // Re-hydrate from localStorage on mount
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const authenticated = users.find((u) => u.isAuthenticated);
    if (authenticated) {
      setCurrentUser(authenticated);
    }
    setAllUsers(users);
  }, []);

  // Helper: Save the updated array of users to localStorage
  const saveUserToLocalStorage = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
    setAllUsers(users); 
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

    // Mark all users as not authenticated
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


  // Sign out a user by removing them from localStorage
  const signOutUser = async (userId) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.filter((u) => u.id !== userId); // Remove the user by ID
  
    // If the current user is being signed out, promote another user
    if (currentUser?.id === userId) {
      if (users.length > 0) {
        // Promote the first remaining user to be authenticated
        users[0].isAuthenticated = true;
        setCurrentUser(users[0]);
      } else {
        // No users left; clear the current user
        setCurrentUser(null);
      }
    }
  
    saveUserToLocalStorage(users);
  };
  
  // Get the currently logged-in user
  const getCurrentUser = () => currentUser;

  // Retrieve all users
  const getAllUsers = () => allUsers;

  return {
    loginUser,
    resetAndSetCurrentUser,
    signOutUser,
    getCurrentUser,
    getAllUsers,
  };
};
