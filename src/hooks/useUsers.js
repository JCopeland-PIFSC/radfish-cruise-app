import { useCallback } from "react";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";

const userTableName = "users";

export const useGetAuthenticatedUsers = () => {
  const { find } = useOfflineStorage();

  const getAllAuthenticatedUsers = useCallback(async () => {
    const users = await find(userTableName, { where: { isAuthenticated: 1 } });
    return users;
  }, [find]);

  return { getAllAuthenticatedUsers };
};

export const useStoreUser = () => {
  const { create, findOne } = useOfflineStorage();

  const persistNewUser = async (authUserData) => {
    const newUserWithAuth = { ...authUserData, isAuthenticated: 1 };
    await create(userTableName, newUserWithAuth);
    return await findOne(userTableName, { where: { id: authUserData.id } });
  };

  return { persistNewUser };
};
