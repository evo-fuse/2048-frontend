import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PATH } from "../const";
import { useAuthContext } from "../context";

/**
 * PrivateRoute component
 * 
 * This component is used to protect routes that require authentication.
 * It checks if the user is signed in using Clerk's useAuth hook.
 * 
 * If the user is signed in:
 *   - Renders the child routes using <Outlet />
 * If the user is not signed in:
 *   - Redirects to the home page using <Navigate />
 * 
 * Usage in App.tsx:
 * <Route path={PATH.GAME + PATH.ASTERISK} element={<PrivateRoute />}>
 *   <Route path="..." element={<ProtectedComponent />} />
 * </Route>
 */
export const PrivateRoute = () => {
  const { user } = useAuthContext();
  const location = useLocation();
  
  // If user is signed in, render the protected route
  if (user) {
    return <Outlet />;
  }
  
  // If user is not signed in, redirect to home with the current location saved
  return <Navigate to={PATH.WALLET_CREATION} state={{ from: location }} replace />;
};
