import { useState, useEffect } from "react";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";
import { tableNames } from "../db/store";

const CURRENT_USER_KEY = "currentUser";

/**
 * This hook provides functions to manage user data with:
 * - IndexedDB (for storing user records)
 * - localStorage (for storing info for the currently authenticated user)
 */

export const useStoreUser = () => {
  const { create, find, findOne, update } = useOfflineStorage();

  // Holds record of the currently logged-in user, if any
  // Initialized from localStorage on component mount
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  // Holds a list of "authenticated" users retrieved from IndexedDB
  const [allUsers, setAllUsers] = useState([]);

  // Fetch all user records from IndexedDB and updtes allUsers state
  const fetchAllUsersFromDB = async () => {
    try {
      const usersFromDB = await find(tableNames.users, {
        where: { isAuthenticated: 1 },
      });
      setAllUsers(usersFromDB);
    } catch (err) {
      console.error("Error fetching users from IndexedDB:", err);
      setAllUsers([]);
    }
  };

  // On mount, fetch existing users from IndexedDB
  useEffect(() => {
    fetchAllUsersFromDB();
  }, []);

  /**
   * loginUser:
   *  - Logs a user into the system:
   *      1) If the user doesn't exist in IndexedDB, create them with isAuthenticated=1
   *      2) If they exist, update them to isAuthenticated=1
   *      3) Fetch all users again from IndexedDB (so the UI reflects the new user)
   *      4) Store user info in localStorage as the "currentUser"
   */
  const loginUser = async (userData) => {
    const existing = await findOne(tableNames.users, {
      where: { id: userData.id },
    });
    if (!existing) {
      await create(tableNames.users, userData);
    } else {
      await update(tableNames.users, [
        {
          ...userData,
          isAuthenticated: 1,
        },
      ]);
    }

    await fetchAllUsersFromDB();

    const userDataForLocalStorage = {
      id: userData.id,
      username: userData.username,
    };
    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(userDataForLocalStorage),
    );
    setCurrentUser(userDataForLocalStorage);
  };

  /**
   * setCurrentUserInLocalStorage:
   *  - A utility to store a user record in localStorage
   *  - Updates the currentUser state in React as well
   */
  const setCurrentUserInLocalStorage = async (userData) => {
    try {
      const userDataForLocalStorage = {
        id: userData.id,
        username: userData.username,
      };
      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(userDataForLocalStorage),
      );
      setCurrentUser(userDataForLocalStorage);
    } catch (error) {
      console.error("Error setting current user:", error);
    }
  };

  /**
   * signOutUser:
   *  - Marks the user in IndexedDB as isAuthenticated=0
   *  - If the signed-out user is also the currentUser, remove them from localStorage
   *  - Refreshes the list of authenticated users afterward
   */
  const signOutUser = async (userId) => {
    try {
      const userRecord = await findOne(tableNames.users, {
        where: { id: userId },
      });
      if (userRecord) {
        await update(tableNames.users, [
          {
            ...userRecord,
            isAuthenticated: 0,
          },
        ]);
      }

      if (currentUser?.id === userId) {
        localStorage.removeItem(CURRENT_USER_KEY);
        setCurrentUser(null);
      }

      await fetchAllUsersFromDB();
    } catch (err) {
      console.error("Error signing out user:", err);
    }
  };

  // Basic getters
  const getCurrentUser = () => currentUser;
  const getAllUsers = () => allUsers;

  return {
    loginUser,
    setCurrentUserInLocalStorage,
    signOutUser,
    getCurrentUser,
    getAllUsers,
    currentUser,
    allUsers,
  };
};
