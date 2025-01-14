// import { useCallback } from "react";
// import { useOfflineStorage } from "@nmfs-radfish/react-radfish";

// const userTableName = "users";

// export const useGetAuthenticatedUsers = () => {
//   const { find } = useOfflineStorage();

//   const getAllAuthenticatedUsers = useCallback(async () => {
//     const users = await find(userTableName, { where: { isAuthenticated: 1 } });
//     return users;
//   }, [find]);

//   return { getAllAuthenticatedUsers };
// };

// export const useStoreUser = () => {
//   const { create, findOne } = useOfflineStorage();

//   const persistNewUser = async (authUserData) => {
//     const newUserWithAuth = { ...authUserData, isAuthenticated: 1 };
//     await create(userTableName, newUserWithAuth);
//     return await findOne(userTableName, { where: { id: authUserData.id } });
//   };

//   return { persistNewUser };
// };

// import { useState, useEffect } from "react";

// export const useStoreUser = () => {
//   const persistNewUser = async (userData) => {
//     try {
//       const users = JSON.parse(localStorage.getItem("users")) || [];
//       const newUser = { ...userData, id: users.length + 1 };
//       users.push(newUser);
//       localStorage.setItem("users", JSON.stringify(users));
//       return newUser;
//     } catch (error) {
//       console.error("Error persisting new user:", error);
//       throw error;
//     }
//   };

//   const resetAndSetCurrentUser = async (userId) => {
//     let users = JSON.parse(localStorage.getItem("users")) || [];
//     users = users.filter(user => user.id !== userId);
//     const currentUser = users.find(user => user.id === userId);
//     if (currentUser) {
//       currentUser.isAuthenticated = true;
//       users.push(currentUser);
//     }
//     localStorage.setItem("users", JSON.stringify(users));
//   };

//   const findOne = async (userId) => {
//     const users = JSON.parse(localStorage.getItem("users")) || [];
//     return users.find(user => user.id === userId);
//   };

//   const useGetAuthenticatedUsers = () => {
//     const [authenticatedUsers, setAuthenticatedUsers] = useState([]);

//     useEffect(() => {
//       const users = JSON.parse(localStorage.getItem("users")) || [];
//       const authenticated = users.filter(user => user.isAuthenticated);
//       setAuthenticatedUsers(authenticated);
//     }, []);

//     return authenticatedUsers;
//   };

//   return { persistNewUser, resetAndSetCurrentUser, findOne, useGetAuthenticatedUsers };
// };

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
  const saveUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  // Create or log in a user
  const loginUser = async (userData) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    // Find an existing user with the same id
    let existingUser = users.find((u) => u.id === userData.id);

    // If not found, create a new one
    if (!existingUser) {
      existingUser = { ...userData, id: users.length + 1 };
      users.push(existingUser);
    }

    console.log("hit  ");

    // Mark all users as not authenticated, then authenticate this user
    users = users.map((u) => ({ ...u, isAuthenticated: false }));
    // Update the existing user in the array
    users = users.map((u) =>
      u.id === existingUser.id ? { ...existingUser, isAuthenticated: true } : u,
    );
    saveUsers(users);
    setCurrentUser(existingUser);
  };

  // Switch to a different user by ID
  const switchUser = async (userId) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    users = users.map((u) => ({ ...u, isAuthenticated: false }));
    targetUser.isAuthenticated = true;

    saveUsers(users);
    setCurrentUser(targetUser);
  };

  // Reset all users to not authenticated, then set a given user as authenticated
  const resetAndSetCurrentUser = async (userId) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map((u) => ({ ...u, isAuthenticated: u.id === userId }));
    saveUsers(users);

    const newCurrent = users.find((u) => u.id === userId);
    setCurrentUser(newCurrent || null);
  };

  // Retrieve a single user by ID
  const findOne = (userId) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.find((u) => u.id === userId);
  };

  // Retrieve all users
  const getAllUsers = () => {
    return JSON.parse(localStorage.getItem("users")) || [];
  };

  // Get the currently logged-in user
  const getCurrentUser = () => currentUser;

  return {
    loginUser,
    switchUser,
    resetAndSetCurrentUser,
    findOne,
    getAllUsers,
    getCurrentUser,
  };
};
