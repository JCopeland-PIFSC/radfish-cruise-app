import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context";
import { useOfflineStatus } from "@nmfs-radfish/react-radfish";

const AuthenticatedApp = () => {
  const { user, userLoading } = useAuth();
  const { isOffline } = useOfflineStatus();

  if (userLoading) return;

  // Redirect to Switch Accounts if not authenticated and not offline
  if (!user?.id && !isOffline) {
    return <Navigate to="/switch-accounts" replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthenticatedApp;
