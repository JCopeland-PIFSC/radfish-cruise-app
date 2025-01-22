import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context";

const AuthenticatedApp = () => {
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user?.isAuthenticated) {
    return <Navigate to="/switch-accounts" replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthenticatedApp;
