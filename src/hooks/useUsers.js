import { useCallback } from "react";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";

const userTableName = "users";

export const useGetAuthenticatedUsers = () => {
  const { find } = useOfflineStorage();

  const getAllAuthenticatedUsers = useCallback(async () => {
    const users = await find(userTableName, { isAuthenticated: 1 });
    console.log("Authenticated users:", users);
    return users;
  }, [find]);

  return { getAllAuthenticatedUsers };
};

export const useStoreUser = () => {
  const { create, findOne } = useOfflineStorage();

  const persistNewUser = async (authUserData) => {
    await create(userTableName, authUserData);
    return await findOne(userTableName, { id: authUserData.id });
  };

  return { persistNewUser };
};

export const useResetCurrentUser = () => {
  const { find, update } = useOfflineStorage();

  const resetAndSetCurrentUser = useCallback(
    async (currentUserId) => {
      // Fetch all authenticated users
      const authenticatedUsers = await find(userTableName, {
        isAuthenticated: 1,
      });

      // Prepare the array of updated users
      const updatedUsers = authenticatedUsers.map((user) => ({
        ...user,
        isCurrentUser: user.id === currentUserId ? 1 : 0,
        uuid: user.uuid, // Ensure the `uuid` field is included for bulk update
      }));

      // Perform the bulk update
      try {
        await update(userTableName, updatedUsers);
      } catch (error) {
        console.error("Error updating users:", error);
        throw error;
      }
    },
    [find, update],
  );

  return { resetAndSetCurrentUser };
};
