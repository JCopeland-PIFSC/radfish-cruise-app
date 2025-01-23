import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context";

const AuthenticatedApp = () => {
  const { user, userLoading } = useAuth();

  if (userLoading) return;

  // Redirect to login if not authenticated
  if (!user?.id) {
    return <Navigate to="/switch-accounts" replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthenticatedApp;
